import SwapCard from '@/components/SwapCard';
import Logo from '@/components/Logo';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden">
      
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10">
        
        {/* Header */}
        <header className="container mx-auto px-4 sm:px-6 py-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Logo className="w-14 h-14 drop-shadow-2xl" />
              <div>
                <h1 className="text-white font-bold text-2xl tracking-tight">
                  StableFX
                </h1>
                <p className="text-blue-400 text-sm font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Powered by Arc Network
                </p>
              </div>
            </div>
            <ConnectButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-blue-400 text-sm font-medium">Live on Arc Testnet</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Swap Stablecoins
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Instantly & Securely
              </span>
            </h2>
            
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Exchange USDC, EURC and BRLA with minimal fees on Arc Network's high-performance blockchain
            </p>
          </div>

          {/* Swap Card */}
          <SwapCard />

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all group">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">0.3%</div>
              <div className="text-slate-400 text-sm">Trading Fee</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all group">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">&lt;1s</div>
              <div className="text-slate-400 text-sm">Settlement Time</div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 backdrop-blur-xl rounded-2xl p-6 border border-pink-500/20 hover:border-pink-400/40 transition-all group">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-pink-400 mb-2">100%</div>
              <div className="text-slate-400 text-sm">Secure</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 hover:border-green-400/40 transition-all group">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-slate-400 text-sm">Always Available</div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 text-center">
            <p className="text-slate-400 text-sm mb-4">Trusted by DeFi users worldwide</p>
            <div className="flex justify-center gap-8 flex-wrap">
              <div>
                <div className="text-2xl font-bold text-white">$0</div>
                <div className="text-slate-500 text-xs">Total Volume</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-slate-500 text-xs">Transactions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-slate-500 text-xs">Supported Tokens</div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 sm:px-6 py-8 mt-16 border-t border-slate-800/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <div>
                <div className="text-white font-semibold text-sm">StableFX</div>
                <div className="text-slate-500 text-xs">Built for Arc Network Hackathon 2025</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href={`https://testnet.arcscan.app/address/0x0227Beb66D711fB8dB20A42f9fad2062a6Af84a3`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
              >
                View Contract
              </a>
              <span className="text-slate-700">•</span>
              <a 
                href="https://arc.network"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
              >
                Arc Network
              </a>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="font-mono text-xs text-slate-600">
              Contract: <code className="text-blue-400/60">0x0227...84a3</code>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}