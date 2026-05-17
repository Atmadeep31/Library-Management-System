"use client";

import React, { useState } from "react";

interface HardcodedTransaction {
  id: string;
  studentName: string;
  studentCode: string;
  bookTitle: string;
  bookCode: string;
  issueDate: string;
  dueDate: string;
  status: "ISSUED" | "RETURNED";
}

export default function LibraryReportPage() {
  // 1. Hardcoded data matching your precise circulation log registry
  const staticRecords: HardcodedTransaction[] = [
    {
      id: "tx-1",
      studentName: "Aniruddha Dhar",
      studentCode: "NIT/2023/1020",
      bookTitle: "Atomic Habits",
      bookCode: "BK101",
      issueDate: "2026-05-15",
      dueDate: "2026-05-28",
      status: "RETURNED",
    },
    {
      id: "tx-2",
      studentName: "Aniruddha Dhar",
      studentCode: "NIT/2023/1020",
      bookTitle: "Data Structures",
      bookCode: "BK102",
      issueDate: "2026-05-15",
      dueDate: "2026-05-22",
      status: "RETURNED",
    },
    {
      id: "tx-3",
      studentName: "Aniruddha Dhar",
      studentCode: "NIT/2023/1020",
      bookTitle: "Data Structures",
      bookCode: "BK102",
      issueDate: "2026-05-15",
      dueDate: "2026-05-24",
      status: "RETURNED",
    },
    {
      id: "tx-4",
      studentName: "ATMADEEP KARAR",
      studentCode: "NIT/2023/1026",
      bookTitle: "Atomic Habits",
      bookCode: "BK101",
      issueDate: "2026-05-13",
      dueDate: "2026-08-24",
      status: "ISSUED",
    },
    {
      id: "tx-5",
      studentName: "ATMADEEP KARAR",
      studentCode: "NIT/2023/1026",
      bookTitle: "Atomic Habits",
      bookCode: "BK101",
      issueDate: "2026-05-13",
      dueDate: "2026-08-24",
      status: "RETURNED",
    },
  ];

  // Form State
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  });

  // UI Processing States
  const [displayedTransactions, setDisplayedTransactions] = useState<HardcodedTransaction[]>(staticRecords);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFormData({ startDate: "", endDate: "" });
    setMessage({ text: "", type: "" });
    setDisplayedTransactions(staticRecords);
  };

  // Process matching window dates on frontend filter
  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    const start = formData.startDate ? new Date(formData.startDate) : null;
    const end = formData.endDate ? new Date(formData.endDate) : null;

    if (start && end && start > end) {
      setMessage({ text: "Invalid parameters: Start Date cannot be set after End Date.", type: "error" });
      setIsLoading(false);
      return;
    }

    // Filter static database collection based on issueDate timelines
    const filtered = staticRecords.filter((tx) => {
      const txDate = new Date(tx.issueDate);
      if (start && txDate < start) return false;
      if (end && txDate > end) return false;
      return true;
    });

    setDisplayedTransactions(filtered);
    setMessage({
      text: `Report built successfully. Found ${filtered.length} matching data records.`,
      type: "success",
    });
    setIsLoading(false);
  };

  // Triggers browser print window optimized to layout views natively as PDF
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen print:bg-white print:p-0">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-purple-100 print:shadow-none print:border-none">
        
        {/* Header - Matching Purple layout theme */}
        <div className="bg-[#6366f1] text-white p-4 flex justify-between items-center print:bg-gray-800">
          <h2 className="text-xl font-bold uppercase tracking-wider">6. Circulation Audit Reports</h2>
          <span className="text-xs bg-indigo-900/40 px-3 py-1 rounded font-mono print:hidden">
            System Static Engine
          </span>
        </div>

        <div className="p-6">
          
          {/* PART 1: TIMELINE INTERVAL SELECTION FORM */}
          <div className="mb-8 print:hidden">
            <form onSubmit={handleGenerateReport} className="bg-indigo-50/30 p-6 rounded-lg border border-indigo-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white focus:outline-indigo-500 text-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white focus:outline-indigo-500 text-gray-700"
                    required
                  />
                </div>

              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded font-bold text-sm tracking-wide transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  GENERATE REPORT
                </button>

                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded font-bold text-sm tracking-wide transition shadow-sm cursor-pointer"
                >
                  EXPORT AS PDF
                </button>
                
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded font-bold text-sm tracking-wide transition cursor-pointer"
                >
                  RESET VIEW
                </button>
              </div>
            </form>
          </div>

          {/* PART 2: SUCCESS / ERROR STATE BANNERS */}
          {message.text && (
            <div className={`mb-8 p-4 rounded-lg border flex flex-col gap-1 print:hidden ${
              message.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}>
              <div className="flex items-center gap-2 font-bold">
                <span>{message.type === "success" ? "✓" : "✕"}</span>
                <span className="font-normal">{message.text}</span>
              </div>
            </div>
          )}

          {/* PART 3: HISTORICAL REGISTRY SUMMARY TABLE */}
          <div>
            <div className="flex justify-between items-center mb-4 border-l-4 border-indigo-500 pl-3">
              <h3 className="text-gray-800 font-bold">
                Generated Activity Output Log
              </h3>
              {formData.startDate && formData.endDate && (
                <span className="text-xs text-gray-400 font-mono">
                  Range: {new Date(formData.startDate).toLocaleDateString()} – {new Date(formData.endDate).toLocaleDateString()}
                </span>
              )}
            </div>
            
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
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
                  {displayedTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-indigo-50/20 transition-colors print:hover:bg-transparent">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{tx.studentName}</div>
                        <div className="text-xs text-gray-400 font-mono">{tx.studentCode}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-800 font-medium">{tx.bookTitle}</div>
                        <div className="text-xs text-gray-400 font-mono">{tx.bookCode}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-mono">
                        {new Date(tx.issueDate).toLocaleDateString("en-US")}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-mono">
                        {new Date(tx.dueDate).toLocaleDateString("en-US")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wide border ${
                          tx.status === "ISSUED" 
                            ? "bg-amber-100 text-amber-800 border-amber-200" 
                            : "bg-emerald-100 text-emerald-800 border-emerald-200"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  
                  {displayedTransactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium bg-gray-50/50">
                        No transactions match the selected date limits.
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