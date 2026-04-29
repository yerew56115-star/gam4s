import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, ExternalLink, RefreshCw } from 'lucide-react';
import { Game } from '../types';
import { useState } from 'react';

interface GameViewerProps {
  game: Game | null;
  onClose: () => void;
}

export default function GameViewer({ game, onClose }: GameViewerProps) {
  const [key, setKey] = useState(0);

  const reloadGame = () => setKey(prev => prev + 1);

  return (
    <AnimatePresence>
      {game && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-app-surface">
            <div className="flex items-center gap-4">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-white"
                title="Back to list"
              >
                <X size={20} />
              </button>
              <div>
                <h2 className="font-bold text-lg text-white leading-tight">{game.title}</h2>
                <span className="text-[10px] text-zinc-500 font-mono tracking-tighter uppercase tabular-nums">SOURCE: {game.url}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={reloadGame}
                className="p-2 text-zinc-400 hover:text-accent transition-colors" 
                title="Reload"
              >
                <RefreshCw size={18} />
              </button>
              <a 
                href={game.url} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 text-zinc-400 hover:text-accent transition-colors" 
                title="Open in new tab"
              >
                <ExternalLink size={18} />
              </a>
              <button 
                className="p-2 text-zinc-400 hover:text-accent transition-colors"
                title="Fullscreen"
                onClick={() => {
                   const iframe = document.getElementById('game-iframe');
                   if (iframe?.requestFullscreen) iframe.requestFullscreen();
                }}
              >
                <Maximize2 size={18} />
              </button>
            </div>
          </div>

          {/* Game Window */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 w-full bg-black relative"
          >
            <iframe
              id="game-iframe"
              key={key}
              src={game.url}
              className="w-full h-full border-none"
              allow="fullscreen; autoplay; encrypted-media"
              title={game.title}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
