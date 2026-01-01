import { Interface } from 'ethers';

// Your Deployed Contract ABI
export const FLASHLOAN_ARB_ABI = [
  "function start(address asset, uint256 amount, uint256 minProfit, tuple(address target, uint256 value, bytes data)[] calls) external",
  "function owner() view returns (address)",
  "event Executed(address indexed asset, uint256 amount, uint256 premium, uint256 profit)",
  "error TargetNotAllowed()",
  "error ProfitCheckFailed(uint256 finalBal, uint256 requiredBal)"
];

// Universal ABI for V3-style Quoters (Uniswap, Pancake, Camelot, Sushi, Ramses)
export const QUOTER_V2_ABI = [
  "function quoteExactInputSingle(tuple(address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96)) external returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)"
];

// Router ABI for encoding swap data
export const SWAP_ROUTER_02_ABI = [
  "function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external returns (uint256 amountOut)"
];

// Common ERC20 tokens on Arbitrum
export const TOKENS = {
  USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  ARB: "0x912CE59144191C1204E64559FE8253a0e49E6548"
};
