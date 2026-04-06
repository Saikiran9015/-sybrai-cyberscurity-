"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Download, Shield, LogOut, CheckCircle, XCircle, Award } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, paid: 0, completed: 0 });
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("sybrai_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(data);
      
      // Calculate stats
      setStats({
        total: data.length,
        paid: data.filter((u: any) => u.isPaid).length,
        completed: data.filter((u: any) => u.isCompleted).length
      });
    } catch (err) {
      console.error(err);
      router.push("/learn");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Paid", "Completed", "Joined Date"];
    const rows = users.map(u => [
      u.name,
      u.email,
      u.isPaid ? "Yes" : "No",
      u.isCompleted ? "Yes" : "No",
      new Date(u.createdAt).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sybrai_students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center font-mono text-cyan-neon">
       LOADING ADMIN SECURE NODE...
    </div>
  );

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-neon text-sm font-mono mb-2 uppercase tracking-widest">
              <Shield className="w-4 h-4" /> Admin Command Center
            </div>
            <h1 className="text-4xl font-orbitron font-bold tracking-tighter">
              Student <span className="text-gradient">Registrations</span>
            </h1>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={exportToCSV}
              className="glass-panel px-6 py-3 rounded-xl border-white/10 hover:border-cyan-neon/50 transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cyan-neon"
            >
              <Download className="w-4 h-4" /> Export Excel/CSV
            </button>
            <Link href="/learn" className="button-primary px-6 py-3 text-sm flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Exit Console
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Total Students", value: stats.total, icon: Users, color: "text-white" },
            { label: "Course Unlocks", value: stats.paid, icon: Shield, color: "text-cyan-neon" },
            { label: "Completed Degrees", value: stats.completed, icon: Award, color: "text-purple-neon" },
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label} 
              className="glass-panel p-6 rounded-2xl border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon className="w-12 h-12" />
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className={`text-4xl font-orbitron font-bold ${stat.color}`}>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="glass-panel rounded-2xl border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-5 text-[10px] text-gray-500 uppercase tracking-widest">Student Name</th>
                  <th className="p-5 text-[10px] text-gray-500 uppercase tracking-widest">Email Address</th>
                  <th className="p-5 text-[10px] text-gray-500 uppercase tracking-widest text-center">Status (Paid)</th>
                  <th className="p-5 text-[10px] text-gray-500 uppercase tracking-widest text-center">Completed</th>
                  <th className="p-5 text-[10px] text-gray-500 uppercase tracking-widest">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={user._id} 
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-5 font-bold tracking-tight">{user.name}</td>
                    <td className="p-5 font-mono text-sm text-gray-400">{user.email}</td>
                    <td className="p-5 text-center">
                      <div className="flex justify-center">
                        {user.isPaid ? (
                          <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-bold border border-green-500/20 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> PAID
                          </div>
                        ) : (
                          <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold border border-red-500/20 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> UNPAID
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-5 text-center">
                       <div className="flex justify-center">
                        {user.isCompleted ? (
                          <span className="text-cyan-neon text-xs font-mono font-bold tracking-widest">100% COMPLETE</span>
                        ) : (
                          <span className="text-gray-600 text-[10px] font-mono tracking-widest">IN PROGRESS</span>
                        )}
                       </div>
                    </td>
                    <td className="p-5 text-sm text-gray-500 font-mono">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <div className="p-20 text-center text-gray-500 uppercase tracking-widest font-mono text-xs">
              No students registered yet in the database node.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
