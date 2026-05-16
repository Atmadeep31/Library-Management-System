"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
interface Transaction {
  id: string;
  studentId: string;
  bookId: string;
  dueDate: string;
  issueDate: string;
  returnDate: string | null;
  status: "ISSUED" | "RETURNED";
  student: {
    name: string;
    studentCode: string;
  };
  book: {
    title: string;
    bookCode: string;
  };
}

export default function BookTransactions() {
  //const router = useRouter();
  // const {isLoaded, userId} = useAuth();
  // if (!isLoaded) return <div>Loading...</div>;
  // if(!userId){
  //   <div>
  //     Sign in to view content
  //   </div>
  // }
  // Toggle State: 'issue' or 'return'
  const [mode, setMode] = useState<"issue" | "return">("issue");

  // Form State
  const [formData, setFormData] = useState({
    studentCode: "",
    bookCode: "",
    dueDate: "",
  });

  // UI State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [message, setMessage] = useState<{ text: string; fine?: number; type: "success" | "error" | "" }>({
    text: "",
    type: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch Transactions on component mount
  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transaction", );
      const data = await res.json();
      if (data.transactions) setTransactions(data.transactions);
    } catch (err) {
      console.error("Failed to load transactions", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
     // This fires when user navigates back via browser back/forward
  window.addEventListener("pageshow", fetchTransactions);
  
  return () => {
    window.removeEventListener("pageshow", fetchTransactions);
  };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Explicit Clear Action
  const handleClear = () => {
    setFormData({ studentCode: "", bookCode: "", dueDate: "" });
    setMessage({ text: "", type: "" }); // Clears message box and persistent fines
  };

  // Submit Processing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const isIssue = mode === "issue";
    const method = isIssue ? "POST" : "PATCH";
    const payload = isIssue 
      ? formData 
      : { studentCode: formData.studentCode, bookCode: formData.bookCode };

    try {
      const res = await fetch("/api/transaction", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        // Construct visual success notice including calculated penalty structural data
        let successNotice = data.message;
        if (data.fine !== undefined) {
          successNotice = `${data.message}. Fine calculated for ${data.studentName || 'student'}: ₹${data.fine}`;
        }
        
        setMessage({ text: successNotice, fine: data.fine, type: "success" });
        fetchTransactions();
        
        if (isIssue) {
          setFormData({ studentCode: "", bookCode: "", dueDate: "" });
        }
      } else {
        setMessage({ text: data.message || data.error || "An error occurred", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network structural communication failure", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-purple-100">
        
        {/* Header - Matching Section 5 Purple branding */}
        <div className="bg-[#6366f1] text-white p-4">
          <h2 className="text-xl font-bold uppercase tracking-wider">5. Issue / Return Book</h2>
        </div>

        <div className="p-6">
          
          {/* PART 1: TOGGLE & FORM FIELDS */}
          <div className="mb-8">
            <div className="flex gap-4 mb-6 border-b">
              <button
                type="button"
                onClick={() => setMode("issue")}
                className={`pb-2 px-4 font-semibold text-sm uppercase tracking-wide transition-all ${
                  mode === "issue" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-400"
                }`}
              >
                Issue Book
              </button>
              <button
                type="button"
                onClick={() => setMode("return")}
                className={`pb-2 px-4 font-semibold text-sm uppercase tracking-wide transition-all ${
                  mode === "return" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-400"
                }`}
              >
                Return Book
              </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-indigo-50/30 p-6 rounded-lg border border-indigo-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">Student ID (Code)</label>
                  <input
                    type="text"
                    name="studentCode"
                    value={formData.studentCode}
                    onChange={handleInputChange}
                    placeholder="e.g., S101"
                    className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white focus:outline-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">Book ID (Code)</label>
                  <input
                    type="text"
                    name="bookCode"
                    value={formData.bookCode}
                    onChange={handleInputChange}
                    placeholder="e.g., B001"
                    className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white focus:outline-indigo-500"
                    required
                  />
                </div>

                {/* Conditional Due Date input field */}
                {mode === "issue" && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white focus:outline-indigo-500"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                {mode === "issue" ? (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-10 py-2 rounded font-bold text-sm tracking-wide transition shadow-sm"
                  >
                    ISSUE BOOK
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-2 rounded font-bold text-sm tracking-wide transition shadow-sm"
                  >
                    PROCESS RETURN
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded font-bold text-sm tracking-wide transition"
                >
                  CLEAR
                </button>
              </div>
            </form>
          </div>

          {/* PART 2: PERSISTENT MESSAGE NOTIFICATION SECTION */}
          {message.text && (
            <div className={`mb-8 p-4 rounded-lg border flex flex-col gap-1 ${
              message.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}>
              <div className="flex items-center gap-2 font-bold">
                <span>{message.type === "success" ? "✓ Action Completed:" : "✕ Action Failed:"}</span>
                <span className="font-normal">{message.text}</span>
              </div>
              
              {/* Specialized dynamic layout badge showing fines generated by back-end calculations */}
              {message.type === "success" && message.fine !== undefined && message.fine > 0 && (
                <div className="mt-2 inline-flex items-center self-start bg-rose-600 text-white font-black text-xs px-3 py-1.5 rounded animate-bounce">
                  COLLECT FINE DUE: ₹{message.fine}
                </div>
              )}
            </div>
          )}

          {/* PART 3: HISTORICAL TRANSACTION RECORD TABLE */}
          <div>
            <h3 className="text-gray-800 font-bold mb-4 border-l-4 border-indigo-500 pl-3">
              Recent Issue Log Registry
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-left">
                <thead className="bg-gray-50 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Book Title</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100 text-sm">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-indigo-50/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{tx.student?.name || "Unknown"}</div>
                        <div className="text-xs text-gray-400 font-mono">{tx.student?.studentCode}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-800 font-medium">{tx.book?.title || "Unknown"}</div>
                        <div className="text-xs text-gray-400 font-mono">{tx.book?.bookCode}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-mono">
                        {new Date(tx.issueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-mono">
                        {new Date(tx.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wide ${
                          tx.status === "ISSUED" 
                            ? "bg-amber-100 text-amber-800 border border-amber-200" 
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-400 font-medium">
                        No transactions found in system logs.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}