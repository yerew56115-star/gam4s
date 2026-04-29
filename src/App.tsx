/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Gamepad2, LogIn, LogOut, PlusCircle } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth, loginWithGoogle, logout } from './lib/firebase';
import gameDataStatic from './data/games.json';
import { Game } from './types';
import GameCard from './components/GameCard';
import GameViewer from './components/GameViewer';
import AddGameModal from './components/AddGameModal';

const ADMIN_EMAIL = "yerew56115@aperiol.com";

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [user, setUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isOwner = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    console.log("CONNECTED");
    const unsubAuth = onAuthStateChanged(auth, (u) => setUser(u));
    const q = query(collection(db, 'games'), orderBy('createdAt', 'desc'));
    const unsubGames = onSnapshot(q, (snapshot) => {
      const gameList = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Game[];
      setGames(gameList);
    });

    return () => {
      unsubAuth();
      unsubGames();
    };
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter((game: Game) => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [games, searchQuery, activeCategory]);

  const quickAddMajorasMask = async () => {
    if (!user || !isOwner) return;
    try {
      await addDoc(collection(db, 'games'), {
        id: 'majoras-mask',
        title: "Majora's Mask",
        url: "https://puresite7978.b-cdn.net/api/gc/seraph/games/majorasmask/index.html",
        thumbnail: "https://www.google.com/s2/favicons?domain=puresite7978.b-cdn.net&sz=128",
        category: "Retro",
        addedBy: user.uid,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error(e);
    }
  };

  const deleteGame = async (e: React.MouseEvent, game: Game) => {
    e.stopPropagation();
    console.log("Attempting to delete game:", game.id, game.title);
    
    if (!user) {
      console.error("No user authenticated");
      return;
    }
    if (!isOwner) {
      console.error("User is not the system owner:", user.email);
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'games', game.id));
      console.log("Delete successful");
    } catch (err) {
      console.error('Delete operation failed:', err);
      alert('Delete failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="h-screen flex flex-col font-sans selection:bg-accent/30 overflow-hidden">
      {/* Header/Nav */}
      <nav className="h-16 border-b border-zinc-800 bg-app-surface flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rotate-45"></div>
          </div>
          <span className="text-xl font-bold tracking-tight">STEALTH<span className="text-accent">ARCADE</span></span>
        </div>
        
        <div className="flex-1 max-w-md mx-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-zinc-800 rounded-md bg-zinc-900 text-sm focus:outline-none focus:border-accent transition-colors" 
              placeholder="Search game database..."
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isOwner && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white rounded text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              <PlusCircle size={14} /> NEW INJECTION
            </button>
          )}

          <div className="h-4 w-px bg-zinc-800"></div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-bold text-zinc-100 uppercase tracking-tight leading-none">{user.displayName}</p>
                <p className="text-[8px] text-zinc-500 font-mono leading-none mt-1">{isOwner ? 'SYSTEM OWNER' : 'PLAYER'}</p>
              </div>
              <button 
                onClick={logout}
                className="p-2 text-zinc-500 hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={loginWithGoogle}
              className="flex items-center gap-2 text-xs font-bold text-accent hover:text-accent-hover transition-colors uppercase tracking-widest"
            >
              <LogIn size={16} /> AUTHORIZE
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-zinc-800 bg-app-bg p-6 shrink-0 overflow-y-auto">
          <h3 className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-4 font-bold">Categories</h3>
          <ul className="space-y-1 mb-8">
            {gameDataStatic.categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => setActiveCategory(category)}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeCategory === category 
                    ? 'bg-accent/10 text-accent' 
                    : 'text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>

          <h3 className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-4 font-bold">Library Stats</h3>
          <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
              <div className="text-xs text-zinc-500 font-mono uppercase text-[10px]">Indexed Units</div>
              <div className="text-lg font-mono text-accent">{games.length}</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
              <div className="text-xs text-zinc-500 font-mono uppercase text-[10px]">Memory Integrity</div>
              <div className="text-lg font-mono text-zinc-100 italic">SECURE</div>
            </div>
          </div>
        </aside>

        {/* Game Grid Area */}
        <main className="flex-1 p-8 bg-app-grid overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Active Repositories</h1>
              <p className="text-sm text-zinc-500">Live synchronization with Stealth database node</p>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-[10px] text-zinc-300 uppercase tracking-widest font-bold">
                {activeCategory} Cluster
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game) => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  onSelect={setSelectedGame}
                  onDelete={deleteGame}
                  isOwner={isOwner}
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredGames.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-2xl"
            >
              <div className="flex flex-col items-center gap-4">
                <Gamepad2 size={48} className="text-zinc-800" />
                <p className="text-zinc-500 font-mono text-[10px] uppercase">Node Empty / Invalid Sector</p>
                {isOwner && (
                  <div className="flex flex-col items-center gap-2">
                    <button 
                      onClick={() => setIsAddModalOpen(true)}
                      className="text-accent hover:underline text-xs font-bold uppercase"
                    >
                      Start Technical Injection
                    </button>
                    <button 
                      onClick={quickAddMajorasMask}
                      className="text-[9px] text-zinc-600 font-mono italic hover:text-accent transition-colors"
                    >
                      OR INJECT PRE-SET ASSET: MAJORA'S MASK
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Footer Bar */}
      <footer className="h-10 bg-accent/5 border-t border-accent/20 px-6 flex items-center justify-between text-[11px] text-zinc-400 font-mono shrink-0">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div> 
            SYSLOG: CONNECTION_ESTABLISHED
          </span>
          <span className="text-zinc-600">|</span>
          <span>LATENCY: 4ms</span>
        </div>
        <div className="flex items-center gap-4">
          <span>BUILD: REV_2.0.4</span>
        </div>
      </footer>

      {/* Modals */}
      <GameViewer 
        game={selectedGame} 
        onClose={() => setSelectedGame(null)} 
      />
      
      {isAddModalOpen && (
        <AddGameModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
}

