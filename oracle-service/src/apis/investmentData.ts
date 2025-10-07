import { logger } from '../utils/logger';
import { createError } from '../middleware/errorHandler';

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  timestamp: Date;
}

export interface InvestmentPerformance {
  totalValue: number;
  profitLoss: number;
  percentageChange: number;
  breakdown: {
    asset: string;
    allocation: number;
    currentValue: number;
    performance: number;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export class InvestmentDataService {
  private apiKeys: {
    alphaVantage?: string;
    coinGecko?: string;
    mock: boolean;
  };

  constructor() {
    this.apiKeys = {
      alphaVantage: process.env.ALPHA_VANTAGE_API_KEY,
      coinGecko: process.env.COINGECKO_API_KEY,
      mock: process.env.USE_MOCK_DATA === 'true' || true // Default to mock for development
    };

    logger.info('InvestmentDataService initialized', {
      mockMode: this.apiKeys.mock,
      hasAlphaVantage: !!this.apiKeys.alphaVantage,
      hasCoinGecko: !!this.apiKeys.coinGecko
    });
  }

  /**
   * Fetch current market data for specified assets
   */
  public async getMarketData(symbols: string[]): Promise<ApiResponse<MarketData[]>> {
    try {
      if (this.apiKeys.mock) {
        return await this.getMockMarketData(symbols);
      }

      // In production, implement real API calls
      const marketData = await this.fetchRealMarketData(symbols);
      
      return {
        success: true,
        data: marketData,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Failed to fetch market data:', error);
      return {
        success: false,
        error: 'Failed to fetch market data',
        timestamp: new Date()
      };
    }
  }

  /**
   * Calculate investment performance based on group's asset allocation
   */
  public async calculateGroupPerformance(
    groupId: number,
    initialValue: number,
    assetAllocation: { [symbol: string]: number }
  ): Promise<ApiResponse<InvestmentPerformance>> {
    try {
      logger.info('Calculating group performance', {
        groupId,
        initialValue,
        assets: Object.keys(assetAllocation)
      });

      const symbols = Object.keys(assetAllocation);
      const marketDataResponse = await this.getMarketData(symbols);

      if (!marketDataResponse.success || !marketDataResponse.data) {
        throw new Error('Failed to fetch market data for performance calculation');
      }

      const breakdown = symbols.map(symbol => {
        const allocation = assetAllocation[symbol];
        const marketData = marketDataResponse.data!.find(data => data.symbol === symbol);
        
        if (!marketData) {
          return {
            asset: symbol,
            allocation,
            currentValue: allocation, // Fallback to original allocation
            performance: 0
          };
        }

        const currentValue = allocation * (1 + (marketData.change24h / 100));
        const performance = ((currentValue - allocation) / allocation) * 100;

        return {
          asset: symbol,
          allocation,
          currentValue,
          performance
        };
      });

      const totalValue = breakdown.reduce((sum, item) => sum + item.currentValue, 0);
      const profitLoss = totalValue - initialValue;
      const percentageChange = ((totalValue - initialValue) / initialValue) * 100;

      const performance: InvestmentPerformance = {
        totalValue,
        profitLoss,
        percentageChange,
        breakdown
      };

      logger.info('Group performance calculated', {
        groupId,
        totalValue,
        profitLoss,
        percentageChange: percentageChange.toFixed(2) + '%'
      });

      return {
        success: true,
        data: performance,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Failed to calculate group performance:', error);
      return {
        success: false,
        error: 'Failed to calculate investment performance',
        timestamp: new Date()
      };
    }
  }

  /**
   * Get historical performance data for backtesting
   */
  public async getHistoricalData(
    symbols: string[],
    startDate: Date,
    endDate: Date
  ): Promise<ApiResponse<{ [symbol: string]: MarketData[] }>> {
    try {
      if (this.apiKeys.mock) {
        return await this.getMockHistoricalData(symbols, startDate, endDate);
      }

      // Real API implementation would go here
      const historicalData = await this.fetchRealHistoricalData(symbols, startDate, endDate);

      return {
        success: true,
        data: historicalData,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Failed to fetch historical data:', error);
      return {
        success: false,
        error: 'Failed to fetch historical data',
        timestamp: new Date()
      };
    }
  }

  /**
   * Generate mock market data for development/testing
   */
  private async getMockMarketData(symbols: string[]): Promise<ApiResponse<MarketData[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    const mockData: MarketData[] = symbols.map(symbol => {
      // Generate realistic mock data
      const basePrice = this.getBasePriceForSymbol(symbol);
      const volatility = Math.random() * 0.2 - 0.1; // -10% to +10%
      const change24h = volatility * 100;
      
      return {
        symbol,
        price: basePrice * (1 + volatility),
        change24h,
        volume: Math.floor(Math.random() * 1000000) + 100000,
        timestamp: new Date()
      };
    });

    logger.debug('Mock market data generated', {
      symbols,
      dataPoints: mockData.length
    });

    return {
      success: true,
      data: mockData,
      timestamp: new Date()
    };
  }

  /**
   * Generate mock historical data
   */
  private async getMockHistoricalData(
    symbols: string[],
    startDate: Date,
    endDate: Date
  ): Promise<ApiResponse<{ [symbol: string]: MarketData[] }>> {
    const historicalData: { [symbol: string]: MarketData[] } = {};
    
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (const symbol of symbols) {
      const basePrice = this.getBasePriceForSymbol(symbol);
      const dataPoints: MarketData[] = [];
      
      for (let i = 0; i <= daysDiff; i++) {
        const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
        const randomWalk = (Math.random() - 0.5) * 0.05; // ±2.5% daily change
        const price = basePrice * Math.exp(randomWalk * i * 0.1);
        const change24h = i > 0 ? ((price - dataPoints[i-1]?.price || price) / (dataPoints[i-1]?.price || price)) * 100 : 0;
        
        dataPoints.push({
          symbol,
          price,
          change24h,
          volume: Math.floor(Math.random() * 500000) + 50000,
          timestamp: date
        });
      }
      
      historicalData[symbol] = dataPoints;
    }

    return {
      success: true,
      data: historicalData,
      timestamp: new Date()
    };
  }

  /**
   * Get base price for mock data generation
   */
  private getBasePriceForSymbol(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'BTC': 45000,
      'ETH': 3000,
      'STX': 1.5,
      'SOL': 100,
      'ADA': 0.5,
      'DOT': 8,
      'LINK': 15,
      'UNI': 12,
      'AAVE': 120,
      'COMP': 80
    };

    return basePrices[symbol.toUpperCase()] || 100;
  }

  /**
   * Placeholder for real market data API integration
   */
  private async fetchRealMarketData(symbols: string[]): Promise<MarketData[]> {
    // CoinGecko implementation example
    if (this.apiKeys.coinGecko) {
      return await this.fetchFromCoinGecko(symbols);
    }

    // Alpha Vantage implementation example
    if (this.apiKeys.alphaVantage) {
      return await this.fetchFromAlphaVantage(symbols);
    }

    throw new Error('No API keys configured for real market data');
  }

  /**
   * Placeholder for CoinGecko API integration
   */
  private async fetchFromCoinGecko(symbols: string[]): Promise<MarketData[]> {
    // Implementation for CoinGecko API
    // This would include proper API calls, error handling, rate limiting, etc.
    throw new Error('CoinGecko integration not implemented yet');
  }

  /**
   * Placeholder for Alpha Vantage API integration
   */
  private async fetchFromAlphaVantage(symbols: string[]): Promise<MarketData[]> {
    // Implementation for Alpha Vantage API
    // This would include proper API calls, error handling, rate limiting, etc.
    throw new Error('Alpha Vantage integration not implemented yet');
  }

  /**
   * Placeholder for real historical data fetching
   */
  private async fetchRealHistoricalData(
    symbols: string[],
    startDate: Date,
    endDate: Date
  ): Promise<{ [symbol: string]: MarketData[] }> {
    throw new Error('Real historical data fetching not implemented yet');
  }

  /**
   * Get supported asset symbols
   */
  public getSupportedAssets(): string[] {
    return [
      'BTC', 'ETH', 'STX', 'SOL', 'ADA', 
      'DOT', 'LINK', 'UNI', 'AAVE', 'COMP'
    ];
  }

  /**
   * Validate asset allocation percentages
   */
  public validateAssetAllocation(allocation: { [symbol: string]: number }): boolean {
    const total = Object.values(allocation).reduce((sum, value) => sum + value, 0);
    return Math.abs(total - 100) < 0.01; // Allow for small floating point errors
  }
}