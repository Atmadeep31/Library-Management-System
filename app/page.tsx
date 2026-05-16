import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = await auth();

  // CASE 1: USER IS NOT LOGGED IN
  if (!userId) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-block p-4 bg-blue-50 text-blue-700 rounded-full text-4xl mb-6">
          🏫
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Central Library Management Engine
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
          
        </p>
      </div>
    );
  }

  // CASE 2: USER IS AUTHORIZED & SIGNED IN
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white border border-blue-100 rounded-lg shadow-lg overflow-hidden">
        
        {/* Dashboard Header */}
        <div className="bg-[#1e3a8a] text-white p-6">
          <h1 className="text-2xl font-bold uppercase tracking-wide">Control Dashboard</h1>
          <p className="text-blue-200 text-xs mt-1">Authorized Administration Session Active</p>
        </div>

        {/* Informative Grid Summary Panels */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="border border-blue-100 rounded-xl p-5 bg-gradient-to-br from-blue-50/50 to-white">
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Book Inventories</h3>
            <p className="text-gray-500 text-xs mb-4">Add new system tracking titles or restock existing copy items.</p>
            <Link href="/books" className="inline-block bg-[#1e3a8a] text-white text-xs font-bold px-4 py-2 rounded transition hover:bg-blue-800">
              Manage Catalog →
            </Link>
          </div>

          <div className="border border-orange-100 rounded-xl p-5 bg-gradient-to-br from-orange-50/40 to-white">
            <div className="text-2xl mb-2">🎓</div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Student Registry</h3>
            <p className="text-gray-500 text-xs mb-4">Register new institution accounts or process active academic class updates.</p>
            <Link href="/students" className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded transition hover:bg-orange-600">
              Manage Records →
            </Link>
          </div>

          <div className="border border-purple-100 rounded-xl p-5 bg-gradient-to-br from-purple-50/40 to-white">
            <div className="text-2xl mb-2">🔄</div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Circulation Desk</h3>
            <p className="text-gray-500 text-xs mb-4">Issue inventory titles to active accounts and process returns or late penalties.</p>
            <Link href="/action" className="inline-block bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded transition hover:bg-indigo-700">
              Log Transactions →
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
