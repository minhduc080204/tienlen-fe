
export default function RightPanel() {
  return (
    <div className="absolute bottom-10 right-10 w-64 bg-black/50 backdrop-blur-lg rounded-2xl p-4 text-white">
      
      {/* Token */}
      <div className="flex justify-between items-center mb-4">
        <span>💰 Token</span>
        <span className="font-bold text-yellow-400">1200</span>
      </div>

      {/* Buttons */}
      <button className="w-full flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg mb-2">
        {/* <Volume2 size={18} /> */}
        Âm thanh
      </button>

      <button className="w-full flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg">
        {/* <Settings size={18} /> */}
        Cài đặt
      </button>
    </div>
  );
}
