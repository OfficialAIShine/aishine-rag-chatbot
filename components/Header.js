// DEPLOYED CODE
// "use client";
// import { Sparkles } from "lucide-react";

// export default function Header({ onClearChat }) {
//   return (
//     <header className="relative z-20 w-full border-b border-white/10 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 backdrop-blur-lg flex items-center justify-between px-6 py-4 shadow-md">
//       {/* Left Section */}
//       <div className="flex items-center gap-3">
//         <Sparkles className="w-6 h-6 text-white animate-pulse" />

//         {/* 🟢 Added animated gradient sparkle effect */}
//         <h1
//           className="text-2xl font-extrabold select-none bg-clip-text text-transparent 
//           bg-gradient-to-r from-pink-300 via-yellow-200 to-blue-300 
//           animate-textShine drop-shadow-sm"
//         >
//           AI Shine
//         </h1>
//       </div>

//       {/* Right Section */}
//       <button
//         onClick={onClearChat}
//         className="px-5 py-2.5 text-sm font-semibold rounded-xl 
//         bg-gradient-to-r from-[#071C39] via-[#0B3266] to-[#134F95] text-white shadow-md flex-shrink-0 hover:shadow-lg hover:scale-105 
//         hover:brightness-110 transition-all duration-300"
//       >
//         Clear Chat
//       </button>
//     </header>
//   );
// }

import { Sparkles, Trash2 } from "lucide-react";

export default function Header({ onClearChat }) {
  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-3">
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-white" />
        <h1 className="text-xl md:text-2xl font-bold text-white">AI Shine</h1>
      </div>
      <button
        onClick={onClearChat}
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
        title="Clear Chat"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}