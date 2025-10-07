import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  createStacksPrivateKey,
  getAddressFromPrivateKey,
  TransactionVersion,
  TxBroadcastResult,
  callReadOnlyFunction,
  standardPrincipalCV,
  uintCV,
  listCV,
  tupleCV,
  bufferCV,
  stringAsciiCV,
  ContractCallPayload,
  ClarityValue
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { StacksApiSocketClient } from '@stacks/blockchain-api-client';
import axios from 'axios';
import { logger } from '../utils/logger';
import { createError } from '../middleware/errorHandler';

export interface GroupMember {
  address: string;
  contribution: number;
  finalAmount: number;
}

export interface AttestationData {
  groupId: number;
  totalContributed: number;
  totalFinal: number;
  members: GroupMember[];
  investmentPeriodEnd: Date;
  proofHash: string;
}

export interface NetworkInfo {
  burn_block_height: number;
  burn_block_time: number;
  burn_block_time_iso: string;
}

export class StacksService {
  private network: StacksNetwork;
  private privateKey: string;
  private oracleAddress: string;
  private apiClient: StacksApiSocketClient;
  private contractAddresses: {
    oracleRegistry: string;
    groupFactory: string;
    settlement: string;
    escrowStx: string;
  };

  constructor(network: StacksNetwork) {
    this.network = network;
    
    // Initialize oracle private key from environment
    this.privateKey = process.env.ORACLE_PRIVATE_KEY!;
    if (!this.privateKey) {
      throw new Error('ORACLE_PRIVATE_KEY environment variable is required');
    }

    // Generate oracle address from private key
    const stacksPrivateKey = createStacksPrivateKey(this.privateKey);
    this.oracleAddress = getAddressFromPrivateKey(
      stacksPrivateKey.data,
      network.version === TransactionVersion.Mainnet ? TransactionVersion.Mainnet : TransactionVersion.Testnet
    );

    // Initialize API client
    this.apiClient = new StacksApiSocketClient({
      url: this.network.coreApiUrl
    });

    // Contract addresses from environment
    this.contractAddresses = {
      oracleRegistry: process.env.ORACLE_REGISTRY_CONTRACT!,
      groupFactory: process.env.GROUP_FACTORY_CONTRACT!,
      settlement: process.env.SETTLEMENT_CONTRACT!,
      escrowStx: process.env.ESCROW_STX_CONTRACT!
    };

    logger.info('StacksService initialized', {
      network: network.isMainnet() ? 'mainnet' : 'testnet',
      oracleAddress: this.oracleAddress,
      contracts: this.contractAddresses
    });
  }

  public async initialize(): Promise<void> {
    try {
      // Test network connection
      const networkInfo = await this.getNetworkInfo();
      logger.info('Connected to Stacks network', {
        height: networkInfo.burn_block_height,
        time: networkInfo.burn_block_time_iso
      });

      // Verify oracle is registered
      const isRegistered = await this.isOracleRegistered(this.oracleAddress);
      if (!isRegistered) {
        logger.warn('Oracle is not registered. Use /api/oracle/register to register.');
      } else {
        logger.info('Oracle is registered and ready');
      }
    } catch (error) {
      logger.error('Failed to initialize Stacks connection:', error);
      throw createError('Failed to connect to Stacks network', 500, 'STACKS_CONNECTION_ERROR');
    }
  }

  public getOracleAddress(): string {
    return this.oracleAddress;
  }

  public isConnected(): boolean {
    return this.network && this.oracleAddress ? true : false;
  }

  public async getNetworkInfo(): Promise<NetworkInfo> {
    try {
      const response = await axios.get(`${this.network.coreApiUrl}/v2/info`);
      return response.data;
    } catch (error) {
      logger.error('Failed to get network info:', error);
      throw createError('Failed to get network information', 500, 'NETWORK_INFO_ERROR');
    }
  }

  public async registerOracle(): Promise<TxBroadcastResult> {
    try {
      logger.info('Registering oracle on blockchain...');

      const [contractAddress, contractName] = this.contractAddresses.oracleRegistry.split('.');
      
      const txOptions = {
        contractAddress,
        contractName,
        functionName: 'register-oracle',
        functionArgs: [standardPrincipalCV(this.oracleAddress)],
        senderKey: this.privateKey,
        network: this.network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResult = await broadcastTransaction(transaction, this.network);

      if (broadcastResult.error) {
        throw new Error(`Transaction failed: ${broadcastResult.error}`);
      }

      logger.info('Oracle registration transaction broadcasted', {
        txId: broadcastResult.txid
      });

      return broadcastResult;
    } catch (error) {
      logger.error('Failed to register oracle:', error);
      throw createError('Failed to register oracle', 500, 'ORACLE_REGISTRATION_ERROR');
    }
  }

  public async isOracleRegistered(address: string): Promise<boolean> {
    try {
      const [contractAddress, contractName] = this.contractAddresses.oracleRegistry.split('.');
      
      const result = await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'is-authorized-oracle',
        functionArgs: [standardPrincipalCV(address)],
        network: this.network,
        senderAddress: address,
      });

      return (result as any).type === 'bool' && (result as any).value === true;
    } catch (error) {
      logger.error('Failed to check oracle registration:', error);
      return false;
    }
  }

  public async publishAttestation(attestationData: AttestationData): Promise<TxBroadcastResult> {
    try {
      logger.info('Publishing attestation to blockchain...', {
        groupId: attestationData.groupId,
        memberCount: attestationData.members.length
      });

      const [contractAddress, contractName] = this.contractAddresses.oracleRegistry.split('.');

      // Prepare investment results list for Clarity
      const investmentResults = attestationData.members.map(member => 
        tupleCV({
          'member': standardPrincipalCV(member.address),
          'final-amount': uintCV(member.finalAmount)
        })
      );

      const txOptions = {
        contractAddress,
        contractName,
        functionName: 'publish-attestation',
        functionArgs: [
          uintCV(attestationData.groupId),
          listCV(investmentResults)
        ],
        senderKey: this.privateKey,
        network: this.network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResult = await broadcastTransaction(transaction, this.network);

      if (broadcastResult.error) {
        throw new Error(`Attestation transaction failed: ${broadcastResult.error}`);
      }

      logger.info('Attestation published successfully', {
        txId: broadcastResult.txid,
        groupId: attestationData.groupId
      });

      return broadcastResult;
    } catch (error) {
      logger.error('Failed to publish attestation:', error);
      throw createError('Failed to publish attestation', 500, 'ATTESTATION_PUBLISH_ERROR');
    }
  }

  public async triggerSettlement(groupId: number): Promise<TxBroadcastResult> {
    try {
      logger.info('Triggering settlement on blockchain...', { groupId });

      const [contractAddress, contractName] = this.contractAddresses.oracleRegistry.split('.');

      const txOptions = {
        contractAddress,
        contractName,
        functionName: 'trigger-settlement',
        functionArgs: [uintCV(groupId)],
        senderKey: this.privateKey,
        network: this.network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResult = await broadcastTransaction(transaction, this.network);

      if (broadcastResult.error) {
        throw new Error(`Settlement transaction failed: ${broadcastResult.error}`);
      }

      logger.info('Settlement triggered successfully', {
        txId: broadcastResult.txid,
        groupId
      });

      return broadcastResult;
    } catch (error) {
      logger.error('Failed to trigger settlement:', error);
      throw createError('Failed to trigger settlement', 500, 'SETTLEMENT_TRIGGER_ERROR');
    }
  }

  public async getGroupMembers(groupId: number): Promise<GroupMember[]> {
    try {
      const [contractAddress, contractName] = this.contractAddresses.groupFactory.split('.');

      const result = await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-group-members',
        functionArgs: [uintCV(groupId)],
        network: this.network,
        senderAddress: this.oracleAddress,
      });

      // Parse the result and convert to GroupMember array
      // This would need to be adapted based on your actual contract return type
      if ((result as any).type === 'list') {
        return (result as any).list.map((item: any) => {
          if (item.type === 'tuple') {
            return {
              address: item.data['member']?.value || '',
              contribution: parseInt(item.data['contribution']?.value?.toString() || '0'),
              finalAmount: 0 // Will be calculated during attestation
            };
          }
          return { address: '', contribution: 0, finalAmount: 0 };
        });
      }

      return [];
    } catch (error) {
      logger.error('Failed to get group members:', error);
      throw createError('Failed to get group members', 500, 'GROUP_MEMBERS_ERROR');
    }
  }

  public async getContractEvents(contractAddress: string, startHeight?: number): Promise<any[]> {
    try {
      const url = `${this.network.coreApiUrl}/extended/v1/contract/${contractAddress}/events`;
      const params = startHeight ? { height: startHeight } : {};
      
      const response = await axios.get(url, { params });
      return response.data.results || [];
    } catch (error) {
      logger.error('Failed to get contract events:', error);
      return [];
    }
  }

  public async waitForTransaction(txId: string, maxWaitTime: number = 60000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const response = await axios.get(`${this.network.coreApiUrl}/extended/v1/tx/${txId}`);
        
        if (response.data.tx_status === 'success') {
          logger.info('Transaction confirmed', { txId });
          return true;
        } else if (response.data.tx_status === 'abort_by_response' || response.data.tx_status === 'abort_by_post_condition') {
          logger.error('Transaction failed', { txId, status: response.data.tx_status });
          return false;
        }
        
        // Wait 2 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        // Transaction might not be found yet, continue waiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    logger.warn('Transaction wait timeout', { txId });
    return false;
  }

  public async getAccountBalance(address: string): Promise<string> {
    try {
      const response = await axios.get(`${this.network.coreApiUrl}/extended/v1/address/${address}/balances`);
      return response.data.stx.balance;
    } catch (error) {
      logger.error('Failed to get account balance:', error);
      return '0';
    }
  }
}