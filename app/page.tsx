import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 -mt-6 overflow-hidden">
      
      {/* NATIVE PRODUCTION OPTIMIZATION LAYER */}
      <Image
        src="/Vibrant Animated University Campus Banner.png"
        alt="University Campus Banner Background"
        fill
        priority // Tells Next.js to download this immediately (removes loading lag)
        quality={85} // Smooth balance between high-fidelity visual presentation and light page weight
        sizes="100vw"
        className="object-cover object-center z-0 select-none pointer-events-none"
      />

      {/* CASE 1: USER IS NOT LOGGED IN */}
      {!userId && (
        <div className="relative z-10 max-w-3xl w-full text-center bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-10 md:p-16 shadow-2xl animate-fade-in">
          <div className="inline-block p-4 bg-blue-500/20 text-blue-400 rounded-full text-4xl mb-6 border border-blue-500/30">
            🏫
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Central Library Management Engine
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto mb-2 leading-relaxed">
            Welcome to the administrator panel. Authenticate your administrative credentials using the sign-in utilities above to manage current inventories, student registration logs, and circulation entries.
          </p>
        </div>
      )}

      {/* CASE 2: USER IS AUTHORIZED & SIGNED IN */}
      {userId && (
        <div className="relative z-10 max-w-5xl w-full bg-slate-900/85 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Dashboard Header - Tinted Glass Accent */}
          <div className="bg-blue-600/20 border-b border-white/10 p-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-wide text-white">Control Dashboard</h1>
              <p className="text-blue-300 text-xs mt-1">Authorized Administration Session Active</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
              System Live
            </span>
          </div>

          {/* Informative Grid Summary Panels */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Books */}
            <div className="border border-white/10 rounded-xl p-5 bg-white/5 hover:bg-white/10 transition-all group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">📚</div>
              <h3 className="font-bold text-white text-lg mb-1">Book Inventories</h3>
              <p className="text-slate-400 text-xs mb-4">Add new system tracking titles or restock existing copy items.</p>
              <Link href="/books" className="inline-block bg-[#1e3a8a] hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded transition shadow-sm">
                Manage Catalog →
              </Link>
            </div>

            {/* Card 2: Students */}
            <div className="border border-white/10 rounded-xl p-5 bg-white/5 hover:bg-white/10 transition-all group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">🎓</div>
              <h3 className="font-bold text-white text-lg mb-1">Student Registry</h3>
              <p className="text-slate-400 text-xs mb-4">Register new institution accounts or process active academic class updates.</p>
              <Link href="/students" className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded transition shadow-sm">
                Manage Records →
              </Link>
            </div>

            {/* Card 3: Transactions */}
            <div className="border border-white/10 rounded-xl p-5 bg-white/5 hover:bg-white/10 transition-all group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">🔄</div>
              <h3 className="font-bold text-white text-lg mb-1">Circulation Desk</h3>
              <p className="text-slate-400 text-xs mb-4">Issue inventory titles to active accounts and process returns or late penalties.</p>
              <Link href="/action" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded transition shadow-sm">
                Log Transactions →
              </Link>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}