import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Globe, 
  Folder, 
  Settings, 
  Cpu, 
  Wifi, 
  Battery, 
  Search, 
  Command,
  X,
  Minus,
  Maximize2,
  LayoutGrid, // Used for Launchpad icon
  User,
  Sparkles, 
  Send,     
  Code2,    
  Bluetooth,
  Moon,
  Sun,
  Volume2,
  LogOut,
  Power,
  RotateCcw,
  Rocket,
  Sliders
} from 'lucide-react';

// --- API Configuration ---
const apiKey = ""; 

// --- Helper: Gemini API Call ---
const callGemini = async (prompt, systemInstruction = "") => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        }),
      }
    );
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to Gemini AI. Please check your connection or API key.";
  }
};

// --- Constants & Data ---
const WALLPAPERS = [
  "https://images.unsplash.com/photo-1501854140884-074bf6fa8ed7?q=80&w=3432&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2940&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=3270&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=3270&auto=format&fit=crop"
];

const APPS = [
  { id: 'launchpad', name: 'Launchpad', icon: Rocket, color: 'bg-gray-400', component: 'Launchpad', isSystem: true },
  { id: 'finder', name: 'Finder', icon: Folder, color: 'bg-blue-500', component: 'FinderApp' },
  { id: 'safari', name: 'Safari', icon: Globe, color: 'bg-blue-400', component: 'SafariApp' },
  { id: 'terminal', name: 'Terminal', icon: Terminal, color: 'bg-gray-800', component: 'TerminalApp' }, 
  { id: 'vscode', name: 'VS Code', icon: Code2, color: 'bg-blue-600', component: 'VSCodeApp' },
  { id: 'gemini', name: 'Gemini AI', icon: Sparkles, color: 'bg-gradient-to-br from-blue-400 to-purple-500', component: 'GeminiApp' }, 
  { id: 'settings', name: 'Settings', icon: Settings, color: 'bg-gray-500', component: 'SettingsApp' },
];

// --- Helper Hooks ---
const useTime = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return time;
};

// --- Sub-Components ---
const BootScreen = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinished, 500); 
          return 100;
        }
        return prev + Math.random() * 5; 
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 bg-black z-[10000] flex flex-col items-center justify-center text-white">
      <div className="mb-8"><svg className="w-24 h-24 fill-current" viewBox="0 0 170 170"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.1 6.855-11.872 17.206-17.801 31.063-17.801 9.848 0 18.813 3.88 26.903 11.64 4.727 4.53 9.765 6.79 15.111 6.79 5.408 0 10.586-2.26 15.528-6.79 6.043-5.54 12.558-8.39 19.548-8.56 4.108-.18 8.981.83 14.609 3.05 9.483 3.73 17.102 9.87 22.851 18.41-4.938 3.42-8.508 7.35-10.718 11.79-4.305 8.76-4.555 17.52-.751 26.29 2.123 4.9 5.38 9.21 9.771 12.92.546.47 1.119.92 1.716 1.35zm-32.06-87.31c-1.993-4.04-3.136-8.23-3.43-12.57 4.706-1.99 9.389-2.98 14.05-2.98 1.498 0 2.943.1 4.336.31 1.956 4.49 2.955 8.99 2.996 13.51-4.836 2.05-9.691 3.08-14.564 3.08-1.229 0-2.359-.11-3.388-.35z"/></svg></div>
      <div className="w-48 h-1.5 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-white transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div></div>
    </div>
  );
};

const ControlCenter = ({ isOpen, toggle }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-9 right-2 w-80 bg-gray-200/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-white/20 z-[5002] text-gray-800 dark:text-white transition-all animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="col-span-1 bg-white/50 dark:bg-black/20 rounded-xl p-3 flex flex-col space-y-3">
           <div className="flex items-center space-x-3 group cursor-pointer">
             <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center transition-transform group-active:scale-95"><Wifi size={16}/></div>
             <div className="text-sm font-medium">Wi-Fi</div>
           </div>
           <div className="flex items-center space-x-3 group cursor-pointer">
             <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center transition-transform group-active:scale-95"><Bluetooth size={16}/></div>
             <div className="text-sm font-medium">Bluetooth</div>
           </div>
        </div>
        <div className="col-span-1 grid grid-rows-2 gap-3">
          <div className="bg-white/50 dark:bg-black/20 rounded-xl p-3 flex items-center space-x-3 cursor-pointer hover:bg-white/60">
             <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center"><Moon size={16}/></div>
             <span className="text-xs font-medium">Do Not Disturb</span>
          </div>
           <div className="bg-white/50 dark:bg-black/20 rounded-xl p-3 flex items-center space-x-3 cursor-pointer hover:bg-white/60">
             <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center"><LayoutGrid size={16}/></div>
             <span className="text-xs font-medium">Stage Manager</span>
          </div>
        </div>
      </div>
      <div className="bg-white/50 dark:bg-black/20 rounded-xl p-3 mb-3"><div className="text-xs font-semibold mb-2 text-gray-500">Display</div><div className="flex items-center space-x-3"><Sun size={16} className="text-gray-500"/><input type="range" className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer" /></div></div>
      <div className="bg-white/50 dark:bg-black/20 rounded-xl p-3"><div className="text-xs font-semibold mb-2 text-gray-500">Sound</div><div className="flex items-center space-x-3"><Volume2 size={16} className="text-gray-500"/><input type="range" className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer" /></div></div>
    </div>
  );
};

const AppleMenu = ({ isOpen, onClose, onAction }) => {
  if (!isOpen) return null;
  const menuItems = [
    { label: 'About This Mac', action: () => alert('MacOS Web Simulator v2.5') },
    { type: 'separator' },
    { label: 'System Settings...', action: () => onAction('settings') },
    { label: 'App Store...', action: () => {} },
    { type: 'separator' },
    { label: 'Sleep', icon: Moon, action: () => {} },
    { label: 'Restart...', icon: RotateCcw, action: () => window.location.reload() },
    { label: 'Shut Down...', icon: Power, action: () => window.close() },
    { type: 'separator' },
    { label: 'Lock Screen', icon: LogOut, action: () => {} },
  ];
  return (
    <div className="absolute top-7 left-2 w-56 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-lg shadow-xl border border-white/20 py-1 z-[5002] text-sm">
      {menuItems.map((item, idx) => (
        item.type === 'separator' ? <div key={idx} className="h-[1px] bg-gray-300 dark:bg-gray-600 my-1 mx-2"></div> : 
          <div key={idx} className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer flex justify-between items-center group" onClick={() => { item.action(); onClose(); }}><span>{item.label}</span>{item.icon && <item.icon size={12} className="opacity-50 group-hover:opacity-100"/>}</div>
      ))}
    </div>
  );
};

const ContextMenu = ({ x, y, visible, onClose, onRefresh, onChangeWallpaper }) => {
  if (!visible) return null;
  return (
    <div className="fixed bg-white/90 backdrop-blur-xl rounded-lg shadow-xl border border-gray-200 py-1 w-48 z-[6000] text-sm text-gray-800 animate-in fade-in zoom-in-95 duration-100" style={{ top: y, left: x }} onClick={(e) => e.stopPropagation()}>
      <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => { alert('New Folder Created'); onClose(); }}>New Folder</div>
      <div className="h-[1px] bg-gray-200 my-1 mx-2"></div>
      <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => { onRefresh(); onClose(); }}>Get Info</div>
      <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => { onChangeWallpaper(); onClose(); }}>Change Wallpaper</div>
      <div className="h-[1px] bg-gray-200 my-1 mx-2"></div>
      <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={onClose}>Clean Up</div>
    </div>
  );
};

const LaunchpadOverlay = ({ isOpen, onClose, apps, onLaunch }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[5500] bg-white/20 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in duration-200" onClick={onClose}>
      <div className="w-full max-w-4xl p-10">
        <div className="grid grid-cols-4 md:grid-cols-6 gap-8 justify-items-center">
          {apps.filter(app => !app.isSystem).map(app => (
            <div key={app.id} className="flex flex-col items-center group cursor-pointer" onClick={(e) => { e.stopPropagation(); onLaunch(app.id); onClose(); }}>
              <div className={`w-20 h-20 rounded-2xl ${app.color} shadow-lg flex items-center justify-center text-white mb-3 transition-transform duration-200 group-hover:scale-110`}><app.icon size={40} /></div>
              <span className="text-white font-medium text-sm drop-shadow-md">{app.name}</span>
            </div>
          ))}
           <div className="flex flex-col items-center group cursor-pointer"><div className="w-20 h-20 rounded-2xl bg-green-500 shadow-lg flex items-center justify-center text-white mb-3 transition-transform duration-200 group-hover:scale-110"><span className="text-2xl">📱</span></div><span className="text-white font-medium text-sm drop-shadow-md">FaceTime</span></div>
            <div className="flex flex-col items-center group cursor-pointer"><div className="w-20 h-20 rounded-2xl bg-yellow-500 shadow-lg flex items-center justify-center text-white mb-3 transition-transform duration-200 group-hover:scale-110"><span className="text-2xl">📝</span></div><span className="text-white font-medium text-sm drop-shadow-md">Notes</span></div>
        </div>
      </div>
      <div className="absolute bottom-10 flex space-x-2"><div className="w-2 h-2 rounded-full bg-white"></div><div className="w-2 h-2 rounded-full bg-white/40"></div></div>
    </div>
  );
};

// --- Inner App Components ---
const GeminiApp = () => {
  const [messages, setMessages] = useState([{ role: 'model', text: "Hello! I'm Gemini, your AI assistant on macOS. How can I help you today?" }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    const aiText = await callGemini(userMsg, "You are a helpful AI assistant integrated into a web-based macOS simulator.");
    setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-3 border-b flex items-center space-x-2 bg-gray-50"><div className="p-1.5 bg-purple-100 rounded-lg"><Sparkles size={18} className="text-purple-600" /></div><div><div className="text-sm font-semibold text-gray-800">Gemini Assistant</div><div className="text-xs text-gray-500">Powered by Google AI</div></div></div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>{msg.text}</div></div>
        ))}
        {isLoading && <div className="text-xs text-gray-400 ml-4 animate-pulse">Gemini is thinking...</div>}
      </div>
      <div className="p-3 bg-white border-t"><div className="flex items-center bg-gray-100 rounded-full px-4 py-2"><input type="text" className="flex-1 bg-transparent border-none outline-none text-sm" placeholder="Ask me anything..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}/><Send size={14} className="text-gray-400"/></div></div>
    </div>
  );
};

const TerminalApp = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { type: 'output', content: "Initializing secure connection..." },
    { type: 'output', content: "Loading user_profile.dat..." },
    { type: 'output', content: "Welcome to the personal terminal. Type 'help' to explore." },
    { type: 'spacer', content: "" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);
  const focusInput = () => { if (!isTyping) inputRef.current?.focus(); };

  const typeWriter = (text, delay = 15) => {
    setIsTyping(true);
    let index = 0;
    setHistory(prev => [...prev, { type: 'output', content: '' }]);
    const intervalId = setInterval(() => {
        setHistory(prev => {
            const newHistory = [...prev];
            const lastIndex = newHistory.length - 1;
            if (newHistory[lastIndex]) {
               newHistory[lastIndex] = { ...newHistory[lastIndex], content: text.substring(0, index + 1) };
            }
            return newHistory;
        });
        index++;
        if (index >= text.length) {
            clearInterval(intervalId);
            setIsTyping(false);
            setHistory(prev => [...prev, { type: 'spacer', content: "" }]);
            setTimeout(() => inputRef.current?.focus(), 50); 
        }
    }, delay);
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter' && !isTyping) {
      const cmd = input.trim().toLowerCase();
      setHistory(prev => [...prev, { type: 'command', content: input }]);
      setInput("");
      let output = "";
      switch (cmd) {
        case 'help': output = `AVAILABLE COMMANDS:\n  about     - Who am I?\n  projects  - View my latest work\n  skills    - Technical arsenal\n  social    - Connect with me\n  contact   - Send a signal\n  clear     - Clear the terminal\n  date      - Show current server time`; break;
        case 'about': output = `IDENTITY VERIFIED.\n------------------\nRole:     Full Stack Developer / AI Enthusiast\nLocation: Cyberspace (Server Node 8521)\nMission:  Building the future of web interaction.\nStatus:   Online and ready for deployment.`; break;
        case 'projects': output = `PROJECTS LOADED:\n------------------\n1. MacOS Web Sim   [React, Tailwind]\n2. CyberDeck UI    [Vue, Three.js]\n3. Auto-GPT Agent  [Python, Gemini]\n4. Neural Network  [TensorFlow.js]`; break;
        case 'skills': output = `TECHNICAL ARSENAL:\n------------------\n> Frontend:  React, Vue, Next.js, Tailwind CSS\n> Backend:   Node.js, Python (FastAPI), Go\n> AI/ML:     TensorFlow, Gemini API\n> DevOps:    Docker, Kubernetes`; break;
        case 'social':
        case 'contact': output = `CONNECT:\n------------------\nGitHub:   github.com/yourusername\nTwitter:  @yourhandle\nEmail:    dev@example.com`; break;
        case 'date': output = new Date().toString(); break;
        case 'clear': setHistory([]); return;
        case '': setHistory(prev => [...prev, { type: 'spacer', content: "" }]); return;
        default: output = `Command not found: '${cmd}'. Type 'help' for a list of commands.`;
      }
      if (output) typeWriter(output);
    }
  };

  return (
    <div className="h-full bg-black p-4 font-mono text-sm text-green-500 overflow-y-auto selection:bg-green-900 cursor-text" onClick={focusInput}>
      {history.map((item, idx) => (
        <div key={idx} className="mb-1 whitespace-pre-wrap leading-relaxed">
          {item.type === 'command' ? (<div className="flex"><span className="text-blue-400 font-bold mr-2">visitor@blog:~$</span><span className="text-white">{item.content}</span></div>) : (<div className={`opacity-90 ${item.content === '' && item.type === 'output' ? 'animate-pulse' : ''}`}>{item.content}{item.content === '' && item.type === 'output' ? '▋' : ''}</div>)}
        </div>
      ))}
      {!isTyping && (<div className="flex items-center mt-2"><span className="text-blue-400 font-bold mr-2">visitor@blog:~$</span><input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleCommand} className="bg-transparent border-none outline-none text-white flex-1 caret-green-500" autoFocus autoComplete="off" spellCheck="false"/></div>)}
      {isTyping && (<div className="flex items-center mt-2 opacity-50"><span className="text-blue-400 font-bold mr-2">visitor@blog:~$</span><span className="animate-pulse">Processing...</span></div>)}
      <div ref={bottomRef} />
    </div>
  );
};

const SafariApp = () => (
  <div className="flex flex-col h-full bg-white">
    <div className="bg-gray-100 border-b p-2 flex items-center space-x-4">
      <div className="flex space-x-2"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div>
      <div className="flex-1 bg-gray-200 rounded-md px-3 py-1 text-center text-sm text-gray-700 flex items-center justify-center"><span className="mr-2">🔒</span> gemini.google.com</div>
    </div>
    <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white"><div className="flex items-center space-x-3 mb-6"><Sparkles size={40} className="text-blue-500" /><div className="text-4xl font-bold text-gray-800">Gemini Search</div></div><div className="w-full max-w-md h-12 rounded-full border shadow-sm flex items-center px-5 text-gray-400 bg-white"><Search size={18} className="mr-3" /> <span className="flex-1">Ask anything...</span></div></div>
  </div>
);

const FinderApp = () => (
  <div className="flex h-full bg-white text-gray-700">
    <div className="w-48 bg-gray-100/90 backdrop-blur p-4 border-r flex flex-col space-y-4 text-sm">
      <div className="text-gray-400 text-xs font-semibold px-2">Favorites</div>
      {['AirDrop', 'Recents', 'Applications', 'Desktop', 'Documents', 'Downloads'].map(i => <div key={i} className="px-2 py-1 hover:bg-gray-200 rounded cursor-pointer flex items-center"><Folder size={14} className="mr-2 text-blue-400"/> {i}</div>)}
    </div>
    <div className="flex-1 p-4 grid grid-cols-4 gap-4 content-start">
      {['Resume.pdf', 'Budget.xlsx', 'Photo.jpg', 'Project A', 'Project B'].map((item) => (
        <div key={item} className="flex flex-col items-center group cursor-pointer p-2 hover:bg-blue-100 rounded"><Folder size={48} className="text-blue-400 fill-blue-400 mb-1" /><span className="text-xs text-center">{item}</span></div>
      ))}
    </div>
  </div>
);

const SettingsApp = ({ setWallpaper }) => (
  <div className="h-full bg-[#f5f5f7] flex text-gray-800">
    <div className="w-48 border-r bg-white/50 p-4 space-y-1">
      {['General', 'Display', 'Sound', 'Wallpaper', 'Battery', 'Privacy'].map(i => <div key={i} className={`px-2 py-1 rounded text-sm ${i === 'Wallpaper' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}>{i}</div>)}
    </div>
    <div className="flex-1 p-6">
      <h2 className="text-xl font-bold mb-4">Wallpaper</h2>
      <div className="grid grid-cols-3 gap-4">
        {WALLPAPERS.map((wp, idx) => (
          <div key={idx} className="aspect-video rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 shadow-sm transition-all" onClick={() => setWallpaper(wp)}>
            <img src={wp} className="w-full h-full object-cover" alt="wallpaper" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const VSCodeApp = () => (
  <div className="h-full bg-[#1e1e1e] flex text-gray-300 font-mono text-sm">
    <div className="w-12 border-r border-gray-700 flex flex-col items-center py-4 space-y-4 bg-[#252526]"><Folder size={24} className="text-gray-400"/><Search size={24} className="text-gray-500"/><Settings size={24} className="mt-auto text-gray-500"/></div>
    <div className="w-48 border-r border-gray-700 bg-[#252526] p-2"><div className="text-xs font-bold mb-2 uppercase tracking-wider px-2">Explorer</div><div className="pl-2 py-1 bg-[#37373d] text-white flex items-center"><span className="text-yellow-400 mr-1 text-xs">JS</span> App.jsx</div></div>
    <div className="flex-1 p-4"><div className="text-pink-500">import <span className="text-yellow-300">React</span> from <span className="text-orange-300">'react'</span>;</div><br/><div className="text-blue-400">console<span className="text-white">.</span><span className="text-yellow-300">log</span>(<span className="text-orange-300">"Hello World"</span>);</div></div>
  </div>
);


// --- Main OS Component ---

export default function MacOSSimulator() {
  const [booted, setBooted] = useState(false);
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0]);
  const [windows, setWindows] = useState([
    { id: 'terminal', appId: 'terminal', title: 'Terminal', x: 150, y: 150, w: 600, h: 400, z: 100, isOpen: true, isMin: false }, 
  ]);
  const [activeId, setActiveId] = useState('terminal');
  const [maxZ, setMaxZ] = useState(100);
  const [menuState, setMenuState] = useState({ apple: false, control: false });
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [launchpadOpen, setLaunchpadOpen] = useState(false);
  const time = useTime();
  
  // Revised Interaction Ref to handle both drag and resize
  const interactionRef = useRef({ 
    type: null, // 'drag' | 'resize'
    id: null, 
    startX: 0, 
    startY: 0,
    initialRect: { x: 0, y: 0, w: 0, h: 0 },
    direction: null // 'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'
  });

  // Core Logic: Drag & Resize Handlers (Global mouse handlers)
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      const { type, id, startX, startY, initialRect, direction } = interactionRef.current;
      if (!type || !id) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const minW = 200;
      const minH = 150;

      if (type === 'drag') {
        setWindows(prev => prev.map(w => {
          if (w.id !== id) return w;
          return { ...w, x: initialRect.x + deltaX, y: initialRect.y + deltaY };
        }));
      } else if (type === 'resize') {
        setWindows(prev => prev.map(w => {
          if (w.id !== id) return w;
          
          let newW = initialRect.w;
          let newH = initialRect.h;
          let newX = initialRect.x;
          let newY = initialRect.y;

          // Horizontal Resizing
          if (direction.includes('e')) {
            newW = Math.max(minW, initialRect.w + deltaX);
          } else if (direction.includes('w')) {
            const proposedW = initialRect.w - deltaX;
            if (proposedW >= minW) {
               newW = proposedW;
               newX = initialRect.x + deltaX;
            }
          }

          // Vertical Resizing
          if (direction.includes('s')) {
            newH = Math.max(minH, initialRect.h + deltaY);
          } else if (direction.includes('n')) {
             const proposedH = initialRect.h - deltaY;
             if (proposedH >= minH) {
               newH = proposedH;
               newY = initialRect.y + deltaY;
             }
          }

          return { ...w, x: newX, y: newY, w: newW, h: newH };
        }));
      }
    };

    const handleGlobalMouseUp = () => {
      interactionRef.current = { type: null, id: null };
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []); // Empty dependency array = add listeners once

  const handleMouseDown = (e, winId, type, direction = null) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent text selection/native drag
    
    const win = windows.find(w => w.id === winId);
    if (!win) return;

    // Bring to front
    if (activeId !== winId) {
      setWindows(prev => prev.map(w => w.id === winId ? { ...w, z: maxZ + 1 } : w));
      setMaxZ(z => z + 1);
      setActiveId(winId);
    }

    interactionRef.current = {
      type, // 'drag' or 'resize'
      id: winId,
      startX: e.clientX,
      startY: e.clientY,
      initialRect: { x: win.x, y: win.y, w: win.w, h: win.h },
      direction
    };
  };

  const handleDesktopClick = () => {
    setMenuState({ apple: false, control: false });
    setContextMenu({ ...contextMenu, visible: false });
    setLaunchpadOpen(false);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
    setMenuState({ apple: false, control: false });
  };

  const openApp = (appId) => {
    if (appId === 'launchpad') { setLaunchpadOpen(!launchpadOpen); return; }
    const existing = windows.find(w => w.appId === appId);
    if (existing) {
      setWindows(prev => prev.map(w => w.appId === appId ? { ...w, isMin: false, z: maxZ + 1 } : w));
      setMaxZ(z => z + 1);
      setActiveId(existing.id);
    } else {
      const app = APPS.find(a => a.id === appId);
      const newWin = {
        id: Date.now().toString(),
        appId: app.id,
        title: app.name,
        x: 100 + (Math.random() * 50),
        y: 100 + (Math.random() * 50),
        w: appId === 'gemini' ? 400 : 700,
        h: appId === 'gemini' ? 550 : 500,
        z: maxZ + 1,
        isOpen: true,
        isMin: false
      };
      setWindows([...windows, newWin]);
      setMaxZ(z => z + 1);
      setActiveId(newWin.id);
    }
    setLaunchpadOpen(false);
  };

  const closeWindow = (id) => setWindows(prev => prev.filter(w => w.id !== id));
  const minimizeWindow = (id) => setWindows(prev => prev.map(w => w.id === id ? { ...w, isMin: true } : w));
  const toggleMaximize = (id) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w;
      if (w.w === window.innerWidth) return { ...w, x: 100, y: 100, w: 700, h: 500 };
      return { ...w, x: 0, y: 28, w: window.innerWidth, h: window.innerHeight - 28 };
    }));
  };

  const activeApp = APPS.find(a => a.id === windows.find(w => w.id === activeId)?.appId) || { name: 'Finder' };

  if (!booted) {
    return <BootScreen onFinished={() => setBooted(true)} />;
  }

  return (
    <div 
      className="w-screen h-screen overflow-hidden bg-cover bg-center font-sans select-none relative"
      style={{ backgroundImage: `url(${wallpaper})` }}
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
    >
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-7 bg-gray-900/40 backdrop-blur-md flex items-center px-4 text-white text-xs font-medium justify-between shadow-sm z-[5000]">
        <div className="flex items-center space-x-4">
          <div className={`text-base hover:text-gray-300 cursor-pointer px-2 py-0.5 rounded ${menuState.apple ? 'bg-white/20' : ''}`} onClick={(e) => { e.stopPropagation(); setMenuState({ apple: !menuState.apple, control: false }); }}></div>
          <span className="font-bold cursor-default">{activeApp.name}</span>
          <span className="hidden sm:inline cursor-default opacity-90">File</span>
          <span className="hidden sm:inline cursor-default opacity-90">Edit</span>
          <span className="hidden sm:inline cursor-default opacity-90">View</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-3 px-2 py-0.5 rounded cursor-pointer transition-colors ${menuState.control ? 'bg-white/20' : 'hover:bg-white/10'}`} onClick={(e) => { e.stopPropagation(); setMenuState({ control: !menuState.control, apple: false }); }}>
             <Sliders size={14} className="opacity-90"/>
             <Battery size={16} className="opacity-90"/>
             <Wifi size={15} className="opacity-90"/>
             <Search size={14} className="opacity-90"/>
             <div className="cursor-default">{time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} &nbsp; {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
      </div>

      <AppleMenu isOpen={menuState.apple} onClose={() => setMenuState({ ...menuState, apple: false })} onAction={openApp} />
      <ControlCenter isOpen={menuState.control} toggle={() => setMenuState({ ...menuState, control: false })} />
      <ContextMenu {...contextMenu} onClose={() => setContextMenu({ ...contextMenu, visible: false })} onRefresh={() => window.location.reload()} onChangeWallpaper={() => setWallpaper(WALLPAPERS[(WALLPAPERS.indexOf(wallpaper) + 1) % WALLPAPERS.length])} />
      <LaunchpadOverlay isOpen={launchpadOpen} onClose={() => setLaunchpadOpen(false)} apps={APPS} onLaunch={openApp} />

      {/* Windows Layer */}
      <div className="relative w-full h-full pt-7">
        {windows.map(win => {
          const appDef = APPS.find(a => a.id === win.appId);
          const isFocused = activeId === win.id;
          return (
            <div
              key={win.id}
              style={{
                transform: `translate(${win.x}px, ${win.y}px)`,
                width: win.w,
                height: win.h,
                zIndex: win.z,
                display: win.isMin ? 'none' : 'flex',
              }}
              onMouseDown={() => {
                if (activeId !== win.id) {
                    setWindows(prev => prev.map(w => w.id === win.id ? { ...w, z: maxZ + 1 } : w));
                    setMaxZ(z => z + 1);
                    setActiveId(win.id);
                }
              }}
              className={`absolute flex flex-col rounded-xl overflow-hidden border border-white/20 transition-shadow duration-150 ${isFocused ? 'shadow-2xl ring-1 ring-white/10' : 'shadow-lg opacity-95 grayscale-[0.1]'}`}
            >
              {/* Resize Handles */}
              {['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map(dir => (
                <div
                  key={dir}
                  onMouseDown={(e) => handleMouseDown(e, win.id, 'resize', dir)}
                  className={`absolute z-50 ${
                    dir === 'n' ? 'top-0 left-0 right-0 h-1 cursor-ns-resize' :
                    dir === 's' ? 'bottom-0 left-0 right-0 h-1 cursor-ns-resize' :
                    dir === 'e' ? 'top-0 right-0 bottom-0 w-1 cursor-ew-resize' :
                    dir === 'w' ? 'top-0 left-0 bottom-0 w-1 cursor-ew-resize' :
                    dir === 'ne' ? 'top-0 right-0 w-3 h-3 cursor-nesw-resize' :
                    dir === 'nw' ? 'top-0 left-0 w-3 h-3 cursor-nwse-resize' :
                    dir === 'se' ? 'bottom-0 right-0 w-3 h-3 cursor-nwse-resize' :
                    'bottom-0 left-0 w-3 h-3 cursor-nesw-resize'
                  }`}
                />
              ))}

              {/* Window Header (Drag Area) */}
              <div 
                className="h-8 bg-[#e3e3e3] dark:bg-[#2d2d2d] border-b border-gray-300 dark:border-gray-700 flex items-center px-3 space-x-2 cursor-default relative" 
                onMouseDown={(e) => handleMouseDown(e, win.id, 'drag')}
                onDoubleClick={() => toggleMaximize(win.id)}
              >
                <div className="flex space-x-2 group z-10">
                  <button onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }} className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center hover:brightness-90"><X size={8} className="opacity-0 group-hover:opacity-100 text-black/70" /></button>
                  <button onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }} className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center hover:brightness-90"><Minus size={8} className="opacity-0 group-hover:opacity-100 text-black/70" /></button>
                  <button onClick={(e) => { e.stopPropagation(); toggleMaximize(win.id); }} className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center hover:brightness-90"><Maximize2 size={8} className="opacity-0 group-hover:opacity-100 text-black/70" /></button>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="text-sm font-medium text-gray-500 opacity-80 flex items-center">{appDef.id === 'gemini' && <Sparkles size={12} className="mr-1 text-purple-500" />}{win.title}</span></div>
              </div>

              {/* Content */}
              <div className="flex-1 bg-white relative overflow-hidden pointer-events-auto">
                {appDef.component === 'TerminalApp' && <TerminalApp />}
                {appDef.component === 'SafariApp' && <SafariApp />}
                {appDef.component === 'FinderApp' && <FinderApp />}
                {appDef.component === 'SettingsApp' && <SettingsApp setWallpaper={setWallpaper} />}
                {appDef.component === 'VSCodeApp' && <VSCodeApp />}
                {appDef.component === 'GeminiApp' && <GeminiApp />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dock */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center z-[5000]">
        <div className="bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2 flex items-end space-x-3 shadow-2xl mb-2 transition-all duration-300">
          {APPS.map(app => {
             const isOpen = windows.some(w => w.appId === app.id);
             return (
              <div key={app.id} onClick={(e) => { e.stopPropagation(); openApp(app.id); }} className="group relative flex flex-col items-center cursor-pointer transition-all duration-200 hover:-translate-y-2">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${app.color} shadow-lg flex items-center justify-center text-white mb-1 transition-all duration-200 group-hover:scale-110 active:scale-95 relative overflow-hidden`}>
                  <app.icon size={28} className="relative z-10" />
                  {app.id === 'gemini' && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent animate-pulse"></div>}
                </div>
                {!app.isSystem && <div className={`w-1 h-1 rounded-full bg-white/80 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>}
                <div className="absolute -top-10 bg-gray-800/80 backdrop-blur px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 whitespace-nowrap z-50">{app.name}</div>
              </div>
            );
          })}
          <div className="w-[1px] h-10 bg-white/20 mx-1"></div>
           <div className="group relative flex flex-col items-center cursor-pointer transition-all duration-200 hover:-translate-y-2"><div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-b from-gray-300 to-gray-400 flex items-center justify-center shadow-lg group-hover:scale-110"><div className="text-2xl">🗑️</div></div></div>
        </div>
      </div>
    </div>
  );
}
