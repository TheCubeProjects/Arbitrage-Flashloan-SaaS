import { ethers } from 'ethers';
import { QUOTER_V2_ABI, TOKENS } from './constants';

export async function scanOpportunities(provider: ethers.JsonRpcProvider, venues: any[]) {
  const amountIn = ethers.parseUnits("5000", 6); // 5000 USDC from your .env
  
  // Create quoter contract instances
  const quoters = venues.map(v => new ethers.Contract(v.quoter, QUOTER_V2_ABI, provider));

  // Parallel polling for maximum speed
  const quotes = await Promise.all(quoters.map(async (quoter, idx) => {
    try {
      const result = await quoter.quoteExactInputSingle.staticCall({
        tokenIn: TOKENS.USDC,
        tokenOut: TOKENS.WETH,
        amountIn: amountIn,
        fee: 500, // 0.05% tier
        sqrtPriceLimitX96: 0
      });
      return { venue: venues[idx].name, amountOut: result.amountOut };
    } catch (e) {
      return null;
    }
  }));

  const validQuotes = quotes.filter(q => q !== null);
  
  // Find highest and lowest for arbitrage
  validQuotes.sort((a, b) => Number(b.amountOut - a.amountOut));
  
  const bestEntry = validQuotes[validQuotes.length - 1]; // Cheapest WETH
  const bestExit = validQuotes[0]; // Most expensive WETH
  
  return { bestEntry, bestExit };
}
