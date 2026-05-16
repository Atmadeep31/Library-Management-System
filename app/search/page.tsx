import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



interface Book {
  id: string;
  bookCode: string;
  title: string;
  author: string;
  availableQuantity: number;
  totalQuantity: number;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.query || "";
  const {userId} = await auth();
  if(!userId){
    redirect('/');
  }
  // Prisma raw query for PostgreSQL pg_trgm similarity logic
  const books = query
    ? ((await prisma.$queryRaw`
        SELECT id, "bookCode", title, author, "availableQuantity", "totalQuantity"
        FROM "Book"
        WHERE similarity(title, ${query}) > 0.2
           OR similarity(author, ${query}) > 0.2
        ORDER BY GREATEST(similarity(title, ${query}), similarity(author, ${query})) DESC
        LIMIT 10
      `) as Book[])
    : [];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-blue-100">
        
        {/* Section Title Header */}
        <div className="bg-[#1e3a8a] text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold uppercase tracking-wider">Book Search Results</h2>
          {query && (
            <span className="bg-blue-950 text-blue-200 text-xs px-3 py-1 rounded font-mono">
              Query: "{query}"
            </span>
          )}
        </div>

        <div className="p-6">
          {books.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-left">
                <thead className="bg-gray-100 text-[11px] font-black text-gray-600 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Book ID</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4">Available</th>
                    <th className="px-6 py-4">Total Stock</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100 text-sm">
                  {books.map((book) => (
                    <tr key={book.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-blue-700">{book.bookCode}</td>
                      <td className="px-6 py-4 text-gray-800 font-medium">{book.title}</td>
                      <td className="px-6 py-4 text-gray-500">{book.author}</td>
                      <td className="px-6 py-4 font-mono font-bold text-gray-700">
                        {book.availableQuantity}
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-400">
                        {book.totalQuantity}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                          book.availableQuantity > 0 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {book.availableQuantity > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="text-gray-700 font-bold text-base">No Matching Records Found</h3>
              <p className="text-gray-400 text-xs mt-1 max-w-xs mx-auto">
                We couldn't find any titles or authors close to your search query. Try checking your spelling.
              </p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}