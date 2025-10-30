'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, formatUnits, maxUint256 } from 'viem';

const CONTRACT_ADDRESS = '0x0227Beb66D711fB8dB20A42f9fad2062a6Af84a3';

const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "tokenIn", "type": "address" },
      { "internalType": "address", "name": "tokenOut", "type": "address" },
      { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
      { "internalType": "uint256", "name": "minAmountOut", "type": "uint256" }
    ],
    "name": "swap",
    "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

const ERC20_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

const TOKENS = {
  USDC: { 
    address: '0x22C00BcaaaEa1548e5397846e0Cf83B75B38e757' as `0x${string}`, 
    symbol: 'USDC', 
    name: 'USD Coin',
    decimals: 6
  },
  EURC: { 
    address: '0x40E6eF9881aBFC07099d0D2def1EF43CdAE967A6' as `0x${string}`, 
    symbol: 'EURC', 
    name: 'Euro Coin',
    decimals: 6
  },
  BRLA: { 
    address: '0x595884cEF6b9df4301E69d567735100ea2415e5A' as `0x${string}`, 
    symbol: 'BRLA', 
    name: 'Brazil Real',
    decimals: 6
  },
};

export default function SwapCard() {
  const { address, isConnected } = useAccount();
  const [fromToken, setFromToken] = useState<keyof typeof TOKENS>('USDC');
  const [toToken, setToToken] = useState<keyof typeof TOKENS>('EURC');
  const [amount, setAmount] = useState('');
  const [estimatedOutput, setEstimatedOutput] = useState('0');
  const [needsApproval, setNeedsApproval] = useState(false);

  const { writeContract, data: hash, isPending, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Read balance for fromToken
  const { data: fromBalance, refetch: refetchFromBalance } = useReadContract({
    address: TOKENS[fromToken].address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 3000,
    }
  });

  // Read balance for toToken
  const { data: toBalance, refetch: refetchToBalance } = useReadContract({
    address: TOKENS[toToken].address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 3000,
    }
  });

  // Check allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: TOKENS[fromToken].address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESS] : undefined,
    query: {
      enabled: !!address && !!amount,
      refetchInterval: 3000,
    }
  });

  // Check if approval is needed when amount changes
  useEffect(() => {
    if (amount && allowance !== undefined) {
      const decimals = TOKENS[fromToken].decimals;
      const amountInWei = parseUnits(amount, decimals);
      setNeedsApproval(allowance < amountInWei);
    } else {
      setNeedsApproval(false);
    }
  }, [amount, allowance, fromToken]);

  // Refetch balances when transaction succeeds
  useEffect(() => {
    if (isSuccess) {
      refetchFromBalance();
      refetchToBalance();
      refetchAllowance();
      // Reset after 2 seconds
      setTimeout(() => {
        reset();
      }, 2000);
    }
  }, [isSuccess, refetchFromBalance, refetchToBalance, refetchAllowance, reset]);

  const handleApprove = async () => {
    if (!isConnected) return;

    try {
      writeContract({
        address: TOKENS[fromToken].address,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, maxUint256],
      });
    } catch (error) {
      console.error('Approval error:', error);
    }
  };

  const handleSwap = async () => {
    if (!amount || !isConnected) return;

    try {
      const decimals = TOKENS[fromToken].decimals;
      const amountIn = parseUnits(amount, decimals);
      const minAmountOut = parseUnits((parseFloat(amount) * 0.97).toFixed(decimals), decimals); // 3% slippage

      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'swap',
        args: [
          TOKENS[fromToken].address,
          TOKENS[toToken].address,
          amountIn,
          minAmountOut,
        ],
      });
    } catch (error) {
      console.error('Swap error:', error);
    }
  };

  const calculateOutput = (input: string) => {
    if (!input || isNaN(parseFloat(input))) {
      setEstimatedOutput('0');
      return;
    }
    const output = parseFloat(input) * 0.997;
    setEstimatedOutput(output.toFixed(6));
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    calculateOutput(value);
  };

  const switchTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    if (amount) calculateOutput(amount);
  };

  const formatBalance = (balance: bigint | undefined, decimals: number): string => {
    if (!balance) return '0.00';
    const formatted = formatUnits(balance, decimals);
    const num = parseFloat(formatted);
    if (num === 0) return '0.00';
    if (num < 0.01) return '<0.01';
    return num.toFixed(2);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-slate-700/50">
        
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-white mb-1">Swap</h2>
          <p className="text-slate-400 text-xs">Exchange stablecoins on Arc Network</p>
        </div>

        {/* From Token Section */}
        <div className="mb-2">
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/30 hover:border-slate-600/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs font-medium">You Pay</span>
              <span className="text-slate-500 text-xs">
                Balance: {formatBalance(fromBalance, TOKENS[fromToken].decimals)}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.0"
                className="flex-1 bg-transparent text-white text-2xl font-semibold outline-none placeholder:text-slate-700 w-0"
                step="0.000001"
              />
              
              <div className="flex-shrink-0">
                <select
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value as keyof typeof TOKENS)}
                  className="bg-slate-700/50 hover:bg-slate-700 text-white px-3 py-2 rounded-xl font-bold text-sm cursor-pointer transition-all border border-slate-600/30 outline-none"
                >
                  {Object.entries(TOKENS).map(([key, token]) => (
                    <option key={key} value={key}>{token.symbol}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Switch Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={switchTokens}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-2 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border border-blue-500/50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To Token Section */}
        <div className="mb-4">
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/30 hover:border-slate-600/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs font-medium">You Receive</span>
              <span className="text-slate-500 text-xs">
                Balance: {formatBalance(toBalance, TOKENS[toToken].decimals)}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={estimatedOutput}
                readOnly
                placeholder="0.0"
                className="flex-1 bg-transparent text-white text-2xl font-semibold outline-none placeholder:text-slate-700 w-0"
              />
              
              <div className="flex-shrink-0">
                <select
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value as keyof typeof TOKENS)}
                  className="bg-slate-700/50 hover:bg-slate-700 text-white px-3 py-2 rounded-xl font-bold text-sm cursor-pointer transition-all border border-slate-600/30 outline-none"
                >
                  {Object.entries(TOKENS).map(([key, token]) => (
                    <option key={key} value={key}>{token.symbol}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        {amount && parseFloat(amount) > 0 && (
          <div className="bg-slate-800/40 rounded-xl p-3 mb-4 border border-slate-700/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400 text-xs">Exchange Rate</span>
              <span className="text-white text-xs font-medium">1 {fromToken} = 1 {toToken}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs">Fee (0.3%)</span>
              <span className="text-amber-400 text-xs font-medium">
                {(parseFloat(amount) * 0.003).toFixed(6)} {fromToken}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        {needsApproval ? (
          <button
            onClick={handleApprove}
            disabled={!isConnected || !amount || parseFloat(amount) === 0 || isPending || isConfirming}
            className="w-full bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 hover:from-amber-700 hover:via-amber-800 hover:to-orange-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] text-base"
          >
            {isPending || isConfirming ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Approving...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Approve {fromToken}
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={handleSwap}
            disabled={!isConnected || !amount || parseFloat(amount) === 0 || isPending || isConfirming}
            className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] text-base"
          >
            {!isConnected ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Connect Wallet to Swap
              </span>
            ) : isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Confirming...
              </span>
            ) : isConfirming ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : isSuccess ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Success!
              </span>
            ) : (
              'Swap'
            )}
          </button>
        )}

        {/* Transaction Link */}
        {hash && (
          <div className="mt-4 text-center">
            <a
              href={`https://testnet.arcscan.net/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
            >
              <span>View on Explorer</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
