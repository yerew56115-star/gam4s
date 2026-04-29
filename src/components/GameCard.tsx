import React from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
  onDelete?: (e: React.MouseEvent, game: Game) => void;
  isOwner?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, onSelect, onDelete, isOwner }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer relative"
      onClick={() => onSelect(game)}
    >
      <div className="aspect-video w-full rounded-lg bg-zinc-900 mb-3 border border-zinc-800 group-hover:border-accent transition-all overflow-hidden relative">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-accent text-white p-2 rounded-full shadow-lg">
            <Play fill="currentColor" size={16} />
          </div>
        </div>

        {isOwner && onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(e, game);
            }}
            className="absolute top-3 right-3 p-2 bg-red-600/90 hover:bg-red-500 text-white rounded-md border border-red-400/30 opacity-0 group-hover:opacity-100 transition-all z-20 shadow-2xl"
            title="Delete Game"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
      
      <h4 className="text-sm font-semibold mb-0.5 group-hover:text-accent transition-colors">
        {game.title}
      </h4>
      <p className="text-[10px] text-zinc-500 italic font-mono uppercase tracking-wider">
        id: {game.id}
      </p>
    </motion.div>
  );
};

export default GameCard;
