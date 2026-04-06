"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Search, Activity, Lock, AlertTriangle, ShieldCheck } from "lucide-react";

const PACKETS = [
  { id: 1, src: "192.168.1.10", dst: "10.0.0.1", proto: "TCP", info: "3-Way Handshake [SYN]", length: 64, flag: "low" },
  { id: 2, src: "10.0.0.1", dst: "192.168.1.10", proto: "TCP", info: "3-Way Handshake [SYN, ACK]", length: 64, flag: "low" },
  { id: 3, src: "192.168.1.10", dst: "target-host.io", proto: "HTTP", info: "GET /login HTTP/1.1", length: 128, flag: "medium" },
  { id: 4, src: "target-host.io", dst: "192.168.1.10", proto: "HTTP", info: "HTTP/1.1 200 OK (text/md)", length: 512, flag: "low" },
  { id: 5, src: "192.168.1.10", dst: "target-host.io", proto: "HTTP", info: "POST /auth [USER: admin, PASS: Master99]", length: 342, flag: "high" },
  { id: 6, src: "192.168.1.10", dst: "10.0.0.1", proto: "TCP", info: "Termination [FIN]", length: 64, flag: "low" },
];

export default function PacketSniffer({ onComplete }: { onComplete: () => void }) {
  const [filter, setFilter] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [visiblePackets, setVisiblePackets] = useState<any[]>([]);
  const [selectedPacket, setSelectedPacket] = useState<any>(null);

  const startCapture = () => {
    setIsCapturing(true);
    let i = 0;
    const interval = setInterval(() => {
      setVisiblePackets(prev => [...prev, PACKETS[i]]);
      i++;
      if (i >= PACKETS.length) {
        clearInterval(interval);
        setIsCapturing(false);
      }
    }, 800);
  };

  const filteredPackets = visiblePackets.filter(p => 
    p && p.proto && p.info && (
      p.proto.toLowerCase().includes(filter.toLowerCase()) || 
      p.info.toLowerCase().includes(filter.toLowerCase())
    )
  );

  useEffect(() => {
    if (selectedPacket?.flag === "high" && filter.toLowerCase() === "http") {
      onComplete();
    }
  }, [selectedPacket, filter, onComplete]);

  return (
    <div className="w-full h-full flex flex-col gap-4 bg-[#0A0A0A] p-6 rounded-2xl border border-white/5 font-mono">
      {/* Tool Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-neon/20 rounded-lg">
            <Activity className="w-5 h-5 text-purple-neon" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Network Analyzer v2.0</h3>
            <p className="text-[10px] text-gray-500">Interface: eth0 (PROMISCUOUS)</p>
          </div>
        </div>
        {!isCapturing && visiblePackets.length === 0 ? (
          <button onClick={startCapture} className="button-primary px-4 py-2 text-[10px] flex items-center gap-2">
            <PlayIcon className="w-3 h-3" /> Start Capture
          </button>
        ) : (
          <div className={`text-[10px] font-bold ${isCapturing ? 'animate-pulse text-red-500' : 'text-cyan-neon'}`}>
            {isCapturing ? '● CAPTURING RAWTRAFFIC...' : 'CAPTURE READY'}
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Apply display filter (e.g. 'http', 'tcp', 'ip.addr == 192.168.1.10')"
            className="w-full bg-black/50 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-[11px] text-white focus:outline-none focus:border-purple-neon transition-colors"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Packet Table */}
      <div className="flex-1 glass-panel rounded-xl border-white/5 overflow-hidden flex flex-col">
        <div className="grid grid-cols-12 gap-2 bg-white/5 p-3 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          <div className="col-span-1">No.</div>
          <div className="col-span-2">Source</div>
          <div className="col-span-2">Dest</div>
          <div className="col-span-1">Proto</div>
          <div className="col-span-6">Info</div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {filteredPackets.map((p, i) => (
            <motion.div 
              initial={{ backgroundColor: "rgba(0, 245, 255, 0.1)" }}
              animate={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
              key={`${p.id}-${i}`}
              onClick={() => setSelectedPacket(p)}
              className={`grid grid-cols-12 gap-2 p-3 text-[11px] cursor-pointer hover:bg-white/5 transition-colors ${selectedPacket?.id === p.id ? 'bg-purple-neon/10 text-white' : 'text-gray-400'}`}
            >
              <div className="col-span-1">{p.id}</div>
              <div className="col-span-2">{p.src}</div>
              <div className="col-span-2">{p.dst}</div>
              <div className="col-span-1 font-bold">{p.proto}</div>
              <div className="col-span-6 truncate">{p.info}</div>
            </motion.div>
          ))}
          {visiblePackets.length === 0 && !isCapturing && (
            <div className="p-10 text-center text-[10px] text-gray-600 uppercase italic">
              Terminal idle. Begin capture to see live data streams.
            </div>
          )}
        </div>
      </div>

      {/* Details View */}
      <div className="h-40 bg-black/50 border border-white/5 rounded-xl p-4 overflow-y-auto">
        {selectedPacket ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest underline decoration-purple-neon">Frame {selectedPacket.id} Detail View</span>
              {selectedPacket.flag === "high" && (
                <div className="flex items-center gap-1 text-[10px] text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                  <AlertTriangle className="w-3 h-3" /> SECURITY ALERT: DECRYPTION FAILED (PLAIN TEXT)
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="text-[11px] space-y-1">
                  <div className="text-gray-500">Ethernet II, Src: Apple_ba:c0:3e, Dst: Sybrai_22:04:f5</div>
                  <div className="text-gray-500">Internet Protocol Version 4, Src: {selectedPacket.src}</div>
                  <div className="text-cyan-neon">Transmission Control Protocol, Src Port: 54322, Dst Port: {selectedPacket.proto === 'HTTP' ? '80' : '22'}</div>
               </div>
               <div className="text-[11px] bg-white/5 p-3 rounded border border-white/10 font-mono break-all text-white/70">
                  {selectedPacket.proto === 'HTTP' && selectedPacket.info.includes('POST') ? (
                    <span className="text-red-400">DATA LOAD: email=admin&pass=Master99&session_req=auth_v1</span>
                  ) : (
                    "0000 45 00 00 3c 1d d3 40 00 40 06 9c 5e c0 a8 01 0a\n0010 0a 00 00 01 d4 32 00 16 ac 9d 7a 42 00 00 00 00"
                  )}
               </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-[10px] text-gray-600 italic">
            Select a packet to inspect the hexadecimal and plain-text data load.
          </div>
        )}
      </div>
    </div>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
