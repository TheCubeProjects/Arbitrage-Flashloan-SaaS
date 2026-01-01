import { ethers } from 'ethers';
import { SWAP_ROUTER_02_ABI, TOKENS } from './constants';

const routerInterface = new ethers.Interface(SWAP_ROUTER_02_ABI);

export interface Hop {
  venue: string;
  routerAddress: string;
  tokenIn: string;
  tokenOut: string;
  fee: number;
}

/**
 * Encodes a series of swaps into the Call[] format for FlashloanArb.sol
 */
export function encodeArbitragePath(hops: Hop[], recipient: string, minAmountOut: bigint = 0n) {
  return hops.map((hop) => {
    // Encode the exactInputSingle call for the specific DEX router
    const data = routerInterface.encodeFunctionData("exactInputSingle", [{
      tokenIn: hop.tokenIn,
      tokenOut: hop.tokenOut,
      fee: hop.fee,
      recipient: recipient, // Usually the contract address
      amountIn: 0, // Contract handles dynamic balance, but quoter provides estimates
      amountOutMinimum: minAmountOut,
      sqrtPriceLimitX96: 0
    }]);

    return {
      target: hop.routerAddress,
      value: 0n,
      data: data
    };
  });
}

/**
 * Calculates the Aave V3 Flashloan Fee (0.05% as per .env)
 */
export function calculateFlashloanPremium(amount: bigint, premiumBps: number): bigint {
  return (amount * BigInt(premiumBps)) / 10000n;
}
