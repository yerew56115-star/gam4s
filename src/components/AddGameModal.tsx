import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Link as LinkIcon, Tag } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface AddGameModalProps {
  onClose: () => void;
}

export default function AddGameModal({ onClose }: AddGameModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Action');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || !auth.currentUser) return;

    setLoading(true);
    try {
      let finalUrl = url.trim();
      
      // Parse iframe code if provided
      if (finalUrl.toLowerCase().includes('<iframe')) {
        const srcMatch = finalUrl.match(/src=["']([^"']+)["']/i);
        if (srcMatch && srcMatch[1]) {
          finalUrl = srcMatch[1];
        }
      }

      // Ensure protocol
      if (!finalUrl.startsWith('http')) {
        finalUrl = 'https://' + finalUrl;
      }

      const domain = new URL(finalUrl).hostname;
      const gameId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      await addDoc(collection(db, 'games'), {
        id: gameId,
        title,
        url: finalUrl,
        thumbnail: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        category,
        addedBy: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      onClose();
    } catch (error) {
      console.error('Error adding game:', error);
      alert('Failed to add game. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-app-surface border border-zinc-800 rounded-xl w-full max-w-md overflow-hidden"
      >
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Initialize New Game</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-2 font-bold">Game Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Majora's Mask"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-2 font-bold">Source URL or Embed Code</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
              <input 
                type="text" 
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste URL or <iframe> code"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-2 font-bold">Category</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent appearance-none transition-colors"
              >
                <option value="Action">Action</option>
                <option value="Retro">Retro</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Arcade">Arcade</option>
                <option value="Strategy">Strategy</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover disabled:bg-zinc-800 text-white font-bold py-3 rounded-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Validating...' : <><Plus size={18} /> Add to Repository</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
