"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
interface Book {
  id: string;
  bookCode: string;
  title: string;
  author: string;
  totalQuantity: number;
  availableQuantity: number;
}

export default function BookManagement() {
  // const router = useRouter();
  // const {isLoaded, userId} = useAuth();
  // if (!isLoaded) return <div>Loading...</div>;
  // if(!userId){
  //   router.push('/')
  // }
  // Toggle State: 'add' or 'update'
  const [mode, setMode] = useState<"add" | "update">("add");
  
  // Form State
  const [formData, setFormData] = useState({
    bookCode: "",
    title: "",
    author: "",
    quantity: "",
  });

  // UI State
  const [books, setBooks] = useState<Book[]>([]);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/book", );
      const data = await res.json();
      if (data.books) setBooks(data.books);
    } catch (err) {
      console.error("Failed to fetch books", err);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // Submit Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const method = mode === "add" ? "POST" : "PATCH";
    // For PATCH, we only need bookCode and quantity per your API
    const payload = mode === "add" 
      ? formData 
      : { bookCode: formData.bookCode, quantity: formData.quantity };

    try {
      const res = await fetch("/api/book", {
        method: method,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (res.ok) {
        showMessage(data.message || "Success!", "success");
        fetchBooks();
        if(mode === "add") setFormData({ bookCode: "", title: "", author: "", quantity: "" });
      } else {
        showMessage(data.error || data.message, "error");
      }
    } catch (err) {
      showMessage("Request failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen font-sans">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-blue-100">
        
        {/* Header */}
        <div className="bg-[#1e3a8a] text-white p-4">
          <h2 className="text-xl font-bold uppercase tracking-wider">3. Book Management</h2>
        </div>

        <div className="p-6">
          
          {/* PART 1: TOGGLE & FORM */}
          <div className="mb-8">
            <div className="flex gap-4 mb-6 border-b">
              <button 
                onClick={() => setMode("add")}
                className={`pb-2 px-4 font-semibold transition-all ${mode === 'add' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400'}`}
              >
                Add New Book
              </button>
              <button 
                onClick={() => setMode("update")}
                className={`pb-2 px-4 font-semibold transition-all ${mode === 'update' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
              >
                Update Stock
              </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Book Code - Required for both */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">Book ID (Code)</label>
                  <input
                    type="text"
                    name="bookCode"
                    value={formData.bookCode}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white focus:outline-blue-500 text-gray-900"
                    placeholder="B001"
                    required
                  />
                </div>

                {/* Quantity - Required for both */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white focus:outline-blue-500 text-gray-900"
                    placeholder={mode === 'add' ? "10" : "Add more e.g. 5"}
                    required
                  />
                </div>

                {/* Conditional Fields: Only show for 'Add' mode */}
                {mode === "add" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white text-gray-900"
                        placeholder="Data Structures"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase">Author</label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white text-gray-900"
                        placeholder="Mark Allen Weiss"
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                {mode === "add" ? (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-10 py-2 rounded font-bold shadow-sm transition"
                  >
                    ADD BOOK
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2 rounded font-bold shadow-sm transition"
                  >
                    UPDATE 
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setFormData({ bookCode: "", title: "", author: "", quantity: "" })}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded font-bold transition"
                >
                  CLEAR
                </button>
              </div>
            </form>
          </div>

          {/* PART 2: MESSAGE SECTION */}
          {message.text && (
            <div className={`mb-6 p-4 rounded border font-medium ${
              message.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
            }`}>
              {message.type === "success" ? "✓ " : "✕ "} {message.text}
            </div>
          )}

          {/* PART 3: TABLE */}
          <div>
            <h3 className="text-blue-900 font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-5 bg-blue-900 rounded-full"></span>
              Current Inventory
            </h3>
            {
                books.length===0 ? <div>
                    Loading
                </div>:
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-left">
                  <thead className="bg-gray-100 text-[11px] font-black text-gray-600 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Book ID</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Author</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100 text-sm">
                    {books.map((book) => (
                      <tr key={book.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-blue-700">{book.bookCode}</td>
                        <td className="px-6 py-4 text-gray-800">{book.title}</td>
                        <td className="px-6 py-4 text-gray-500">{book.author}</td>
                        <td className="px-6 py-4 font-mono text-gray-500">{book.availableQuantity}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            book.availableQuantity > 0 
                              ? "bg-green-100 text-green-700" 
                              : "bg-red-100 text-red-700"
                          }`}>
                            {book.availableQuantity > 0 ? "Available" : "Out of Stock"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
            
          </div>
        </div>
      </div>
    </div>
  );
}