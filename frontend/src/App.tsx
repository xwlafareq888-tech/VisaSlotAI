import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Globe, Plus, Trash2, Power, Activity, Database, AlertCircle, CheckCircle2, Search, Webhook, Scan, LayoutDashboard, Zap, ShieldAlert, Cpu } from 'lucide-react';

const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://127.0.0.1:8000" : "";

interface Target {
  id: number;
  provider: string;
  country: string;
  location: string;
  url: string;
  is_active: boolean;
  created_at: string;
}

interface ScanLog {
  id: number;
  provider: string;
  country: string;
  location: string;
  url: string;
  success: boolean;
  slots_found: number;
  slots_data: any[];
  error_message: string | null;
  created_at: string;
}

const translations = {
  tr: {
    title: "VisaSlot AI",
    subtitle: "Akıllı Randevu Tarama Merkezi",
    dashboardTab: "Genel Bakış",
    targetsTab: "Hedef Konfigürasyonları",
    logsTab: "Canlı Tarama Logları",
    addTargetTitle: "Yeni Tarama Hedefi Ekle",
    providerLabel: "Sağlayıcı",
    countryLabel: "Ülke (Örn: İtalya)",
    locLabel: "Şube/Lokasyon (Örn: Ankara)",
    urlLabel: "Randevu Sayfası Linki",
    addBtn: "Hedefi Takibe Al",
    status: "Durum",
    provider: "Acente",
    destination: "İstikamet",
    action: "Aksiyon",
    active: "Taranıyor",
    paused: "Durduruldu",
    noTargets: "Sistemde taranan hiçbir hedef yok.",
    liveLogsTitle: "Gerçek Zamanlı Uç Nokta Kayıtları",
    systemActive: "Sistem Aktif & Dinlemede",
    date: "Tarih",
    result: "Tarama Sonucu",
    terminal: "Terminal Logu",
    slotFound: "SLOT BULUNDU!",
    noSlot: "Randevu Yok",
    error: "Bağlantı / Bot Hatası",
    noLogs: "Henüz terminal kaydı yok. Sistem veri bekliyor.",
    deleteConfirm: "Bu hedefi kalıcı olarak silmek istediğinize emin misiniz?",
    successStatus: "Başarılı",
    other: "Diğer",
    scanNow: "Hemen Tara",
    scanTriggered: "Manuel tarama tetiklendi!",
    statsTotalScans: "Toplam Tarama",
    statsActive: "Aktif Hedef",
    statsFound: "Bulunan Slot",
    statsErrors: "Bağlantı Hatası"
  },
  en: {
    title: "VisaSlot AI",
    subtitle: "Intelligent Appointment Scanning Hub",
    dashboardTab: "Dashboard",
    targetsTab: "Target Configurations",
    logsTab: "Live Scan Logs",
    addTargetTitle: "Add New Scan Target",
    providerLabel: "Provider",
    countryLabel: "Country (e.g. Italy)",
    locLabel: "Location/Branch (e.g. London)",
    urlLabel: "Appointment Page URL",
    addBtn: "Add to Tracking",
    status: "Status",
    provider: "Agency",
    destination: "Destination",
    action: "Actions",
    active: "Scanning",
    paused: "Paused",
    noTargets: "No targets found in the system.",
    liveLogsTitle: "Real-Time Endpoint Logs",
    systemActive: "System Active & Listening",
    date: "Timestamp",
    result: "Scan Result",
    terminal: "Terminal Log",
    slotFound: "SLOT FOUND!",
    noSlot: "No Appointments",
    error: "Connection / Bot Error",
    noLogs: "No terminal logs yet.",
    deleteConfirm: "Are you sure you want to permanently delete this target?",
    successStatus: "Successful",
    other: "Other",
    scanNow: "Scan Now",
    scanTriggered: "Manual scan triggered successfully!",
    statsTotalScans: "Total Scans",
    statsActive: "Active Targets",
    statsFound: "Slots Found",
    statsErrors: "Bot Errors"
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<'dashboard' | 'targets' | 'logs'>('dashboard');
  
  const [targets, setTargets] = useState<Target[]>([]);
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [stats, setStats] = useState({
    total_targets: 0,
    active_targets: 0,
    total_scans: 0,
    successful_slots: 0,
    errors_logged: 0
  });
  
  const [newProv, setNewProv] = useState("idata");
  const [newCountry, setNewCountry] = useState("");
  const [newLoc, setNewLoc] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const fetchData = async () => {
    try {
        const [resTargets, resLogs, resStats] = await Promise.all([
          axios.get(`${API_BASE}/targets`),
          axios.get(`${API_BASE}/logs?limit=50`),
          axios.get(`${API_BASE}/stats`).catch(() => ({ data: { total_targets:0, active_targets:0, total_scans:0, successful_slots:0, errors_logged:0 } }))
        ]);
        setTargets(resTargets.data);
        setLogs(resLogs.data.logs);
        setStats(resStats.data);
    } catch(e) { console.error("Data fetch error", e); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountry || !newUrl) return;
    
    await axios.post(`${API_BASE}/targets`, {
      provider: newProv,
      country: newCountry,
      location: newLoc,
      url: newUrl,
      is_active: true
    });
    setNewCountry("");
    setNewLoc("");
    setNewUrl("");
    fetchData();
    setActiveTab('targets');
  };

  const toggleTarget = async (id: number) => {
    await axios.put(`${API_BASE}/targets/${id}/toggle`);
    fetchData();
  };

  const deleteTarget = async (id: number) => {
    if(window.confirm(t.deleteConfirm)) {
      await axios.delete(`${API_BASE}/targets/${id}`);
      fetchData();
    }
  };

  const triggerScan = async () => {
    try {
      await axios.get(`${API_BASE}/scan`);
      alert(t.scanTriggered);
    } catch(e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-[#05050f] font-sans text-slate-200 selection:bg-indigo-500/30">
      {/* Üst Navbar */}
      <div className="border-b border-white/5 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <Globe className="text-white w-6 h-6 animate-[spin_10s_linear_infinite]" />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
                {t.title}
              </h1>
              <p className="text-[10px] text-fuchsia-400 font-bold tracking-[0.2em] uppercase">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={triggerScan}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4" />
              {t.scanNow}
            </button>

            <div className="flex bg-[#0f1123] rounded-lg p-1 border border-white/10 ml-2">
              <button onClick={() => setLang('tr')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${lang === 'tr' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-white'}`}>TR</button>
              <button onClick={() => setLang('en')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${lang === 'en' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-white'}`}>EN</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Tab Menüsü */}
        <div className="flex space-x-2 mb-8 bg-[#0f1123] p-1.5 rounded-2xl border border-white/5 w-fit shadow-xl">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
            <LayoutDashboard className="w-4 h-4" /> {t.dashboardTab}
          </button>
          <button onClick={() => setActiveTab('targets')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'targets' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
            <Database className="w-4 h-4" /> {t.targetsTab}
          </button>
          <button onClick={() => setActiveTab('logs')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'logs' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
            <Activity className="w-4 h-4" /> {t.logsTab}
          </button>
        </div>

        {/* DASHBOARD EKRANI */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-b from-[#0f1123] to-[#0a0b16] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Activity className="w-16 h-16 text-indigo-500" /></div>
                <p className="text-sm font-medium text-slate-500 mb-1">{t.statsTotalScans}</p>
                <p className="text-4xl font-black text-white">{stats.total_scans}</p>
              </div>

              <div className="bg-gradient-to-b from-[#0f1123] to-[#0a0b16] border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><CheckCircle2 className="w-16 h-16 text-emerald-500" /></div>
                <p className="text-sm font-medium text-emerald-500/70 mb-1">{t.statsFound}</p>
                <p className="text-4xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">{stats.successful_slots}</p>
              </div>

              <div className="bg-gradient-to-b from-[#0f1123] to-[#0a0b16] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Cpu className="w-16 h-16 text-fuchsia-500" /></div>
                <p className="text-sm font-medium text-slate-500 mb-1">{t.statsActive} / Total</p>
                <p className="text-4xl font-black text-white">{stats.active_targets} <span className="text-xl text-slate-600">/ {stats.total_targets}</span></p>
              </div>

              <div className="bg-gradient-to-b from-[#0f1123] to-[#0a0b16] border border-rose-500/20 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><ShieldAlert className="w-16 h-16 text-rose-500" /></div>
                <p className="text-sm font-medium text-rose-500/70 mb-1">{t.statsErrors}</p>
                <p className="text-4xl font-black text-rose-400">{stats.errors_logged}</p>
              </div>
            </div>

            {/* Yeni Hedef Ekleme Dashboard İçi */}
            <div className="bg-[#0f1123] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl mt-8">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px]"></div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Plus className="text-indigo-400 w-6 h-6" /> {t.addTargetTitle}
              </h2>
              <form onSubmit={handleAddTarget} className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                <select className="bg-[#080912] border border-white/10 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" value={newProv} onChange={e => setNewProv(e.target.value)}>
                  <option value="idata">iData</option>
                  <option value="vfs_global">VFS Global</option>
                  <option value="visametric">Visametric</option>
                  <option value="tlscontact">TLSContact</option>
                  <option value="other">{t.other}</option>
                </select>
                <input required placeholder={t.countryLabel} className="bg-[#080912] border border-white/10 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600" value={newCountry} onChange={e => setNewCountry(e.target.value)} />
                <input required placeholder={t.locLabel} className="bg-[#080912] border border-white/10 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600" value={newLoc} onChange={e => setNewLoc(e.target.value)} />
                <input required type="url" placeholder={t.urlLabel} className="bg-[#080912] border border-white/10 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-600 md:col-span-1" value={newUrl} onChange={e => setNewUrl(e.target.value)} />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2">
                  <Webhook className="w-5 h-5" /> {t.addBtn}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TARGETS EKRANI */}
        {activeTab === 'targets' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {targets.map(trgt => (
                <div key={trgt.id} className="bg-[#0f1123] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors group relative overflow-hidden flex flex-col justify-between">
                  {trgt.is_active && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2"></div>}
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#080912] flex items-center justify-center text-lg font-black text-white border border-white/5 shadow-inner">
                        {trgt.provider.substring(0,1).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                          {trgt.provider.replace('_', ' ')}
                          {trgt.is_active && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-[ping_2s_ease-in-out_infinite]"></span>}
                        </h3>
                        <p className="text-slate-400 text-sm font-medium">{trgt.country} &rarr; {trgt.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleTarget(trgt.id)} className={`p-2.5 rounded-lg transition-colors border ${trgt.is_active ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}>
                        <Power className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteTarget(trgt.id)} className="p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 bg-[#080912] rounded-lg p-3 border border-white/5 relative z-10">
                    <a href={trgt.url} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-indigo-400 truncate block transition-colors font-mono">
                      {trgt.url}
                    </a>
                  </div>
                </div>
              ))}
              {targets.length === 0 && (
                <div className="col-span-1 lg:col-span-2 py-20 text-center bg-[#0f1123] rounded-2xl border border-white/5 flex flex-col items-center">
                  <Search className="w-12 h-12 text-slate-600 mb-4" />
                  <p className="text-lg text-slate-400 font-medium">{t.noTargets}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LOGS EKRANI */}
        {activeTab === 'logs' && (
          <div className="bg-[#0f1123] border border-white/5 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
             <div className="p-6 bg-[#0a0b16] border-b border-white/5 flex justify-between items-center">
                <h2 className="font-bold text-lg text-white flex items-center gap-3">
                  <TerminalIcon />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-indigo-400">{t.liveLogsTitle}</span>
                </h2>
                <span className="text-xs font-bold border border-indigo-500/30 text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span> 
                    {t.systemActive}
                </span>
             </div>
             
             <div className="p-0 max-h-[600px] overflow-y-auto font-mono text-sm custom-scrollbar">
                <table className="min-w-full divide-y divide-white/5">
                  <thead className="bg-[#0f1123]/80 sticky top-0 backdrop-blur-md z-10">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-slate-500 text-xs tracking-widest uppercase">{t.date}</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-500 text-xs tracking-widest uppercase">{t.destination}</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-500 text-xs tracking-widest uppercase">{t.result}</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-500 text-xs tracking-widest uppercase">{t.terminal}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {logs.map(log => (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                          {new Date(log.created_at).toLocaleTimeString(lang === 'tr' ? 'tr-TR' : 'en-US', {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <span className="text-slate-300 font-bold uppercase text-[11px] tracking-widest bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-md">
                             {log.provider}_{log.country}
                           </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           {log.success ? (
                              log.slots_found > 0 
                                  ? <span className="inline-flex items-center gap-1.5 text-emerald-50 bg-emerald-500 px-3 py-1.5 rounded-md text-xs font-black shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                                      <CheckCircle2 className="w-4 h-4" />
                                      {log.slots_found} {t.slotFound}
                                    </span> 
                                  : <span className="text-slate-500 font-medium text-xs flex items-center gap-2 bg-[#080912] px-3 py-1.5 rounded-md border border-white/5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                      {t.noSlot}
                                    </span>
                           ) : (
                              <span className="text-rose-400 font-bold text-xs flex items-center gap-1.5 bg-rose-500/10 px-3 py-1.5 rounded-md border border-rose-500/20">
                                <AlertCircle className="w-4 h-4" />
                                {t.error}
                              </span>
                           )}
                        </td>
                        <td className="px-6 py-4 text-xs w-full max-w-md">
                          <div className="bg-[#080912] p-2 rounded border border-white/5 w-full overflow-hidden">
                            {log.error_message ? (
                              <span className="text-rose-400/90 truncate block cursor-help" title={log.error_message}>
                                &gt; err: {log.error_message}
                              </span>
                            ) : (
                              <span className="text-emerald-400/70 truncate block">
                                &gt; res: {log.slots_data && log.slots_data.length > 0 ? JSON.stringify(log.slots_data) : `[200 OK] -> ${t.successStatus}`}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center text-slate-600">
                          <Scan className="w-10 h-10 mb-3 opacity-20 mx-auto" />
                          <p className="font-medium text-sm">{t.noLogs}</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0a0b16; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
};

const TerminalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fuchsia-400"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
);

export default App;
