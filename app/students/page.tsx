"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
interface Student {
  id: string;
  studentCode: string;
  name: string;
  stream: string;
  year: string;
}

export default  function StudentManagement() {
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
    studentCode: "",
    name: "",
    stream: "",
    year: "",
  });

  // UI State
  const [students, setStudents] = useState<Student[]>([]);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/student",);
      const data = await res.json();
      if (data.students) setStudents(data.students);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const method = mode === "add" ? "POST" : "PATCH";
    // For PATCH, we only need studentCode and year per your API
    const payload = mode === "add"
      ? formData
      : { studentCode: formData.studentCode, year: formData.year };

    try {
      const res = await fetch("/api/student", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        showMessage(data.message || "Operation successful", "success");
        fetchStudents();
        if (mode === "add") setFormData({ studentCode: "", name: "", stream: "", year: "" });
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
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-orange-100">

        {/* Header - Matching visual 4 in your image */}
        <div className="bg-[#f97316] text-white p-4">
          <h2 className="text-xl font-bold uppercase tracking-wider">4. Student Management</h2>
        </div>

        <div className="p-6">

          {/* TOGGLE TAB */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setMode("add")}
              className={`pb-2 px-4 font-semibold transition-all ${mode === 'add' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400'}`}
            >
              Register Student
            </button>
            <button
            
              onClick={() => {
                console.log("clicked");
                setMode("update")
              }}
              className={`pb-2 px-4 font-semibold transition-all ${mode === 'update' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
            >
              Update Year/Grade
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="bg-orange-50/50 p-6 rounded-lg border border-orange-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Student ID (Code)</label>
                <input
                  type="text"
                  name="studentCode"
                  value={formData.studentCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white"
                  placeholder="NIT/****/****"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Current Year</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white"
                  placeholder="e.g. 2"
                  required
                />
              </div>

              {mode === "add" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white"
                      placeholder="Rahul Sharma"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">Stream/Course</label>
                    <input
                      type="text"
                      name="stream"
                      value={formData.stream}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white"
                      placeholder="B.Tech (CSE)"
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
                  className="bg-green-600 hover:bg-green-700 text-white px-10 py-2 rounded font-bold transition"
                >
                  REGISTER
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2 rounded font-bold transition"
                >
                  UPDATE RECORD
                </button>
              )}
              <button
                type="button"
                onClick={() => setFormData({ studentCode: "", name: "", stream: "", year: "" })}
                className="bg-orange-200 hover:bg-orange-300 text-orange-800 px-6 py-2 rounded font-bold transition"
              >
                CLEAR
              </button>
            </div>
          </form>

          {/* MESSAGE BOX */}
          {message.text && (
            <div className={`mb-6 p-4 rounded border font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
              }`}>
              {message.text}
            </div>
          )}

          {/* STUDENT TABLE */}
          <div>
            <h3 className="text-gray-800 font-bold mb-4 border-l-4 border-orange-500 pl-3">Registered Students</h3>
            {
              
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-[11px] font-black text-gray-500 uppercase">
                      <tr>
                        <th className="px-6 py-4 text-left">Code</th>
                        <th className="px-6 py-4 text-left">Name</th>
                        <th className="px-6 py-4 text-left">Stream</th>
                        <th className="px-6 py-4 text-left">Year</th>
                        <th className="px-6 py-4 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 text-sm">
                      {students.map((student) => (
                        <tr key={student.id} className="hover:bg-orange-50/30">
                          <td className="px-6 py-4 font-bold text-orange-700">{student.studentCode}</td>
                          <td className="px-6 py-4 text-gray-800 font-medium">{student.name}</td>
                          <td className="px-6 py-4 text-gray-500">{student.stream}</td>
                          <td className="px-6 py-4">{student.year}</td>
                          <td className="px-6 py-4">
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase">
                              Active
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