// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Sparkles } from 'lucide-react';
// import Image from 'next/image';

// const TECH_PERSONALITIES = [
//   {
//     name: "Sundar Pichai",
//     achievement: "CEO of Google & Alphabet",
//     description: "From Chennai to leading one of the world's most influential tech companies, Sundar Pichai's journey exemplifies perseverance and innovation. He championed Chrome, ChromeOS, and Google Drive before becoming CEO.",
//     image: "/assets/personalities/sundar.jpg"
//   },
//   {
//     name: "Satya Nadella",
//     achievement: "CEO of Microsoft",
//     description: "Transformed Microsoft into a cloud-first company, growing Azure to compete with AWS. His leadership focused on empathy, growth mindset, and AI integration across all Microsoft products.",
//     image: "/assets/personalities/satya.jpeg"
//   },
//   {
//     name: "Parag Agrawal",
//     achievement: "Former CEO of Twitter",
//     description: "IIT Bombay graduate who rose through Twitter's ranks to become CTO and later CEO. Led key initiatives in machine learning and algorithmic timeline improvements.",
//     image: "/assets/personalities/parag.avif"
//   },
//   {
//     name: "Shantanu Narayen",
//     achievement: "CEO of Adobe",
//     description: "Pioneered Adobe's transition from boxed software to cloud-based subscription model (Creative Cloud). Led acquisition of Figma and integration of AI across Adobe products.",
//     image: "/assets/personalities/shantanu.webp"
//   },
//   {
//     name: "Arvind Krishna",
//     achievement: "CEO of IBM",
//     description: "Architect of IBM's cloud and AI strategy, including the $34 billion Red Hat acquisition. Led IBM's transformation into a hybrid cloud and AI company.",
//     image: "/assets/personalities/arvind.jpeg"
//   },
//   {
//     name: "Leena Nair",
//     achievement: "Global CEO of Chanel",
//     description: "First Indian woman to lead a luxury fashion house. Former CHRO of Unilever, pioneering HR tech and diversity initiatives across global organizations.",
//     image: "/assets/personalities/leena.jpeg"
//   },
//   {
//     name: "Nikesh Arora",
//     achievement: "CEO of Palo Alto Networks",
//     description: "Former Google executive who led SoftBank's investments before transforming Palo Alto Networks into a cybersecurity powerhouse with AI-driven threat detection.",
//     image: "/assets/personalities/nikesh.jpeg"
//   },
//   {
//     name: "Anjali Sud",
//     achievement: "Former CEO of Vimeo",
//     description: "Youngest woman CEO of a public tech company at 34. Transformed Vimeo from consumer video platform to enterprise SaaS business.",
//     image: "/assets/personalities/anjali.jpg"
//   }
// ];

// export default function MotivationalCard({ show, onClose }) {
//   const randomPersonality = TECH_PERSONALITIES[Math.floor(Math.random() * TECH_PERSONALITIES.length)];

//   if (!show) return null;

//   return (
//     <AnimatePresence>
//       {show && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//           onClick={onClose}
//         >
//           <motion.div
//             initial={{ scale: 0.8, y: 50 }}
//             animate={{ scale: 1, y: 0 }}
//             exit={{ scale: 0.8, y: 50 }}
//             transition={{ type: "spring", damping: 25 }}
//             onClick={(e) => e.stopPropagation()}
//             className="relative max-w-md w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-3xl overflow-hidden shadow-2xl"
//           >
//             {/* Close Button */}
//             <button
//               onClick={onClose}
//               className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all"
//             >
//               <X className="w-5 h-5 text-white" />
//             </button>

//             {/* Sparkles Icon */}
//             <div className="absolute top-4 left-4 z-10">
//               <Sparkles className="w-6 h-6 text-yellow-400" />
//             </div>

//             {/* Image Section */}
//             <div className="relative h-64 bg-gradient-to-b from-transparent to-black/50">
//               <div className="absolute inset-0 bg-[url('/assets/tech-pattern.png')] opacity-10" />
//               <div className="relative h-full flex items-center justify-center p-8">
//                 <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-1">
//                   <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-xl mx-auto flex items-center justify-center">
//   <Image
//     src={randomPersonality.image}
//     alt={randomPersonality.name}
//     fill
//     className="object-cover"
//   />
//                     {/* {randomPersonality.name.charAt(0)} */}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Content Section */}
//             <div className="p-6 text-white space-y-4">
//               <div className="text-center">
//                 <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
//                   {randomPersonality.name}
//                 </h2>
//                 <p className="text-purple-300 font-semibold mt-1">
//                   {randomPersonality.achievement}
//                 </p>
//               </div>

//               <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />

//               <p className="text-gray-300 text-sm leading-relaxed">
//                 {randomPersonality.description}
//               </p>

//               <div className="pt-4">
//                 <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
//                   <p className="text-xs text-purple-200 text-center italic">
//                     "Your journey is just beginning. Every expert was once a beginner."
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Bottom Gradient */}
//             <div className="h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

















