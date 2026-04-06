"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldAlert, Plus, Trash2, CheckCircle, XCircle, Terminal, Play } from "lucide-react";

interface Rule {
  id: string;
  type: "ALLOW" | "DENY";
  port: string;
  ip: string;
}

export default function FirewallManager({ onComplete }: { onComplete: () => void }) {
  const [rules, setRules] = useState<Rule[]>([
    { id: "1", type: "ALLOW", port: "443", ip: "ANY" },
    { id: "2", type: "ALLOW", port: "22", ip: "192.168.1.50" },
  ]);
  const [newRule, setNewRule] = useState<Omit<Rule, "id">>({ type: "DENY", port: "", ip: "" });
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const addRule = () => {
    if (!newRule.port || !newRule.ip) return;
    setRules([...rules, { ...newRule, id: Date.now().toString() }]);
    setNewRule({ type: "DENY", port: "", ip: "" });
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const runTest = () => {
    setIsTestRunning(true);
    setTestResults([]);
    
    const scenarios = [
      { ip: "10.0.0.5", port: "80", desc: "Incoming Web Traffic" },
      { ip: "192.168.1.50", port: "22", desc: "Admin SSH Access" },
      { ip: "45.77.1.20", port: "3389", desc: "Unknown RDP Request" },
    ];

    let i = 0;
    const interval = setInterval(() => {
      const scenario = scenarios[i];
      if (!scenario) {
        clearInterval(interval);
        setIsTestRunning(false);
        return;
      }
      const match = rules.find(r => 
        (r.port === scenario.port || r.port === "ANY") && 
        (r.ip === scenario.ip || r.ip === "ANY")
      );
      
      const allowed = match ? match.type === "ALLOW" : false; // Default DENY
      
      setTestResults(prev => [...prev, { ...scenario, allowed }]);
      i++;
      
      if (i >= scenarios.length) {
        clearInterval(interval);
        setIsTestRunning(false);
        
        // Success condition: Block port 80 and block unknown RDP
        const success = !rules.some(r => r.port === "80" && r.type === "ALLOW") && 
                      !rules.some(r => r.port === "3389" && r.type === "ALLOW");
        
        if (success) {
          setTimeout(onComplete, 1000);
        }
      }
    }, 1000);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 font-mono">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/30">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Sybrai Advanced Firewall</h3>
        </div>
        <div className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full px-2">STATUS: POLICY ACTIVE</div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 flex-1">
        {/* Rule Builder */}
        <div className="space-y-4">
           <div className="glass-panel p-4 rounded-xl border-white/5">
              <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Add Custom Policy</h4>
              <div className="grid grid-cols-6 gap-2">
                 <select 
                   value={newRule.type}
                   onChange={(e) => setNewRule({...newRule, type: e.target.value as any})}
                   className="col-span-2 bg-black border border-white/10 rounded-lg p-2 text-[11px] text-white focus:border-red-500 outline-none"
                 >
                    <option value="ALLOW">ALLOW</option>
                    <option value="DENY">DENY</option>
                 </select>
                 <input 
                   placeholder="PORT"
                   value={newRule.port}
                   onChange={(e) => setNewRule({...newRule, port: e.target.value})}
                   className="col-span-1 bg-black border border-white/10 rounded-lg p-2 text-[11px] text-white focus:border-red-500 outline-none"
                 />
                 <input 
                   placeholder="SOURCE IP"
                   value={newRule.ip}
                   onChange={(e) => setNewRule({...newRule, ip: e.target.value})}
                   className="col-span-2 bg-black border border-white/10 rounded-lg p-2 text-[11px] text-white focus:border-red-500 outline-none"
                 />
                 <button 
                   onClick={addRule}
                   className="col-span-1 bg-red-500/20 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                 >
                   <Plus className="w-4 h-4" />
                 </button>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto space-y-2 max-h-[250px] pr-2">
              {rules.map((rule) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={rule.id}
                  className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-colors"
                >
                   <div className="flex items-center gap-4">
                      <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${rule.type === 'ALLOW' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                         {rule.type}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[12px] text-white font-bold">PORT: {rule.port}</span>
                         <span className="text-[10px] text-gray-500">FROM: {rule.ip}</span>
                      </div>
                   </div>
                   <button onClick={() => removeRule(rule.id)} className="text-gray-600 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3 h-3" />
                   </button>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Traffic Simulator */}
        <div className="glass-panel p-6 rounded-2xl border-white/10 flex flex-col items-center justify-center text-center">
           {!isTestRunning && testResults.length === 0 ? (
             <div className="space-y-6">
                <Shield className="w-16 h-16 text-gray-600 mx-auto" />
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Global Policy Simulator</h4>
                <p className="text-[10px] text-gray-500 max-w-xs uppercase leading-relaxed">
                  Apply rules to block insecure traffic. Mission requirement: Block Port 80 (HTTP) to force secure comms.
                </p>
                <button onClick={runTest} className="button-primary px-8 py-3 flex items-center gap-2 text-[10px] font-bold uppercase mx-auto">
                   <Play className="w-3 h-3" /> Execute Traffic Test
                </button>
             </div>
           ) : (
             <div className="w-full space-y-4">
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest animate-pulse">Running Inbound Traffic Simulation...</div>
                <div className="space-y-3">
                   {testResults.map((res, i) => (
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={`p-3 rounded-xl border flex items-center justify-between ${res.allowed ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
                     >
                        <div className="flex flex-col items-start gap-1">
                           <span className="text-[10px] font-bold">{res.desc}</span>
                           <span className="text-[8px] font-mono opacity-60">Source IP: {res.ip} | Port: {res.port}</span>
                        </div>
                        {res.allowed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                     </motion.div>
                   ))}
                </div>
                {isTestRunning && <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: "100%" }}
                     transition={{ duration: 3 }}
                     className="h-full bg-red-500"
                   />
                </div>}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
