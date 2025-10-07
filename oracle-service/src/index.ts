import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { StacksNetwork, StacksTestnet, StacksMainnet } from '@stacks/network';
import { 
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  createStacksPrivateKey,
  getAddressFromPrivateKey,
  TransactionVersion
} from '@stacks/transactions';

import createAttestationRoutes from './routes/attestation';
import createValidationRoutes from './routes/validation';
import { StacksService } from './services/stacks';
import { AttestationService } from './services/attestation';
import { ValidationService } from './validation/security';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { configureScheduledTasks } from './scheduler/index';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with explicit path to the oracle-service directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

class OracleServer {
  private app: express.Application;
  private stacksNetwork: StacksNetwork;
  private stacksService!: StacksService;
  private attestationService!: AttestationService;
  private validationService!: ValidationService;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.ORACLE_PORT || '3003');
    
    // Initialize Stacks network
    this.stacksNetwork = process.env.STACKS_NETWORK === 'mainnet' 
      ? new StacksMainnet() 
      : new StacksTestnet();
    
    this.initializeServices();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupScheduler();
  }

  private initializeServices(): void {
    try {
      // Initialize validation service first
      this.validationService = new ValidationService();
      
      // Initialize Stacks service with heavy blockchain integration
      this.stacksService = new StacksService(this.stacksNetwork);
      
      // Initialize attestation service with smart contract integration
      this.attestationService = new AttestationService(this.stacksService);
      
      logger.info('Oracle services initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize oracle services:', error);
      process.exit(1);
    }
  }

  private setupMiddleware(): void {
    // CORS configuration for frontend integration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    }));

    // Request parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      next();
    });
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        network: this.stacksNetwork.isMainnet() ? 'mainnet' : 'testnet',
        services: {
          stacks: this.stacksService.isConnected(),
          attestation: true
        }
      });
    });

    // API routes with Stacks integration
    this.app.use('/api/attestation', createAttestationRoutes(
      this.attestationService, 
      this.stacksService, 
      this.validationService
    ));
    this.app.use('/api/validation', createValidationRoutes(this.validationService));

    // Oracle-specific endpoints
    this.app.get('/api/oracle/status', async (req, res) => {
      try {
        const oracleAddress = this.stacksService.getOracleAddress();
        const networkInfo = await this.stacksService.getNetworkInfo();
        
        res.json({
          oracle: {
            address: oracleAddress,
            network: this.stacksNetwork.isMainnet() ? 'mainnet' : 'testnet',
            registered: await this.stacksService.isOracleRegistered(oracleAddress)
          },
          blockchain: {
            height: networkInfo.burn_block_height,
            connected: true
          },
          contracts: {
            oracleRegistry: process.env.ORACLE_REGISTRY_CONTRACT,
            groupFactory: process.env.GROUP_FACTORY_CONTRACT,
            settlement: process.env.SETTLEMENT_CONTRACT
          }
        });
      } catch (error) {
        logger.error('Error getting oracle status:', error);
        res.status(500).json({ error: 'Failed to get oracle status' });
      }
    });

    // Contract interaction endpoints
    this.app.post('/api/oracle/register', async (req, res) => {
      try {
        const txResult = await this.stacksService.registerOracle();
        res.json({
          success: true,
          txId: txResult.txid,
          message: 'Oracle registration transaction broadcasted'
        });
      } catch (error) {
        logger.error('Error registering oracle:', error);
        res.status(500).json({ error: 'Failed to register oracle' });
      }
    });

    // Global error handler
    this.app.use(errorHandler);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
      });
    });
  }

  private setupScheduler(): void {
    // Configure automated settlement tasks
    configureScheduledTasks(this.attestationService, this.stacksService);
    logger.info('Scheduled tasks configured for automated settlements');
  }

  public async start(): Promise<void> {
    try {
      // Verify Stacks connection
      await this.stacksService.initialize();
      
      // Start server
      this.app.listen(this.port, () => {
        logger.info(`Oracle service started on port ${this.port}`);
        logger.info(`Stacks network: ${this.stacksNetwork.isMainnet() ? 'mainnet' : 'testnet'}`);
        logger.info(`Oracle address: ${this.stacksService.getOracleAddress()}`);
      });
    } catch (error) {
      logger.error('Failed to start oracle server:', error);
      process.exit(1);
    }
  }

  public async shutdown(): Promise<void> {
    logger.info('Shutting down oracle service...');
    // Graceful shutdown logic here
    process.exit(0);
  }
}

// Handle process signals
const oracleServer = new OracleServer();

process.on('SIGTERM', () => oracleServer.shutdown());
process.on('SIGINT', () => oracleServer.shutdown());

// Start the server
oracleServer.start().catch((error) => {
  logger.error('Failed to start oracle service:', error);
  process.exit(1);
});

export default oracleServer;