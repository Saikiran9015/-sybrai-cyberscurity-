export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 py-12 mt-20 relative z-10 glass-panel">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-orbitron text-xl font-bold text-white mb-4">SYBRAI</h3>
          <p className="text-gray-400 text-sm">
            AI-Powered Cyber Defense System protecting your digital world in real-time.
          </p>
        </div>
        
        <div>
          <h4 className="text-cyan-neon font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="/about" className="hover:text-white transition">About</a></li>
            <li><a href="/learn" className="hover:text-white transition">Learn</a></li>
            <li><a href="/founder" className="hover:text-white transition">Founder</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-cyan-neon font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-cyan-neon font-semibold mb-4">Connect</h4>
          <p className="text-sm text-gray-400">info@sybrai.com</p>
        </div>
      </div>
      <div className="mt-12 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Sybrai. All rights reserved.
      </div>
    </footer>
  );
}
