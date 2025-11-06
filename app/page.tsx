import { WalletButton } from './components/WalletButton';
import { WalletInfo } from './components/WalletInfo';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Gamify</h1>
              <p className="text-gray-600">Web3 Gaming Platform on OneChain</p>
            </div>
            <WalletButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Welcome to Gamify</h2>
            <p className="text-gray-700 mb-6">
              Experience Web3 gaming with transparency and zero gas fees. Connect your One Wallet
              to start playing games with sponsored transactions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">🎮 Real Games</h3>
                <p className="text-sm text-blue-700">
                  Play stacking and bet-based games with full Web3 transparency
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">⚡ Zero Gas Fees</h3>
                <p className="text-sm text-green-700">
                  Enjoy sponsored transactions - no gas fees for players
                </p>
              </div>
            </div>

            <WalletInfo />
          </div>

          {/* Game Section Placeholder */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Games</h2>
            <p className="text-gray-600 mb-4">
              Connect your wallet to access games and start playing!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <div className="text-4xl mb-2">🎲</div>
                <h3 className="font-semibold mb-2">Betting Games</h3>
                <p className="text-sm text-gray-600">Coming Soon</p>
              </div>
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="font-semibold mb-2">Stacking Games</h3>
                <p className="text-sm text-gray-600">Coming Soon</p>
              </div>
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <div className="text-4xl mb-2">🏆</div>
                <h3 className="font-semibold mb-2">Tournaments</h3>
                <p className="text-sm text-gray-600">Coming Soon</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}