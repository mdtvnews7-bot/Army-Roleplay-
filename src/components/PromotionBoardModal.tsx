import React, { useState } from 'react';
import { Soldier, MilitaryRank } from '../types/military';
import { InsigniaIcon } from './InsigniaIcon';
import { playTacticalClick, playPromotionFanfare } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { ShieldCheck, Award, X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface PromotionBoardModalProps {
  soldier: Soldier;
  currentRank: MilitaryRank;
  nextRank: MilitaryRank;
  isOpen: boolean;
  onClose: () => void;
  onBoardApproved: (result: {
    boardScore: number;
    recommendation: 'Recommended' | 'Recommended with Distinction' | 'Deferred';
    remarks: string;
  }) => void;
}

export const PromotionBoardModal: React.FC<PromotionBoardModalProps> = ({
  soldier,
  currentRank,
  nextRank,
  isOpen,
  onClose,
  onBoardApproved
}) => {
  const [leadershipScore, setLeadershipScore] = useState<number>(95);
  const [doctrineScore, setDoctrineScore] = useState<number>(90);
  const [bearingScore, setBearingScore] = useState<number>(98);
  const [boardRemarks, setBoardRemarks] = useState(
    'Soldier demonstrated exemplary composure, tactical doctrine mastery, and fierce loyalty under rigorous questioning.'
  );

  if (!isOpen) return null;

  const totalBoardScore = Math.round((leadershipScore + doctrineScore + bearingScore) / 3);

  const handleApprove = (withDistinction: boolean) => {
    playPromotionFanfare();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#10b981', '#ffffff']
    });

    onBoardApproved({
      boardScore: totalBoardScore,
      recommendation: withDistinction ? 'Recommended with Distinction' : 'Recommended',
      remarks: boardRemarks
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono-military text-amber-400">Formal Military Review</div>
              <h3 className="text-base font-bold text-white font-military">
                Promotion Board Convened
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              playTacticalClick();
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Board candidate overview */}
        <div className="p-6 space-y-5">
          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <img src={soldier.avatarUrl} alt={soldier.lastName} className="w-12 h-12 rounded-lg object-cover border border-amber-500/50" />
              <div>
                <div className="text-sm font-bold text-white">
                  Candidate: {currentRank.abbreviation} {soldier.lastName}, {soldier.firstName}
                </div>
                <div className="text-xs text-slate-400">
                  Target Advancement: <strong className="text-amber-400">{nextRank.title} ({nextRank.grade})</strong>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-bold font-mono-military text-amber-400">{totalBoardScore}%</span>
              <div className="text-[10px] text-slate-400 uppercase">Board Average</div>
            </div>
          </div>

          {/* Interactive Evaluation Sliders */}
          <div className="space-y-4 bg-slate-950/40 p-4 rounded-lg border border-slate-800">
            <div className="text-xs font-mono-military uppercase text-slate-400">Board Member Evaluations</div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Tactical Leadership & Fireteam Command</span>
                <span className="text-amber-400 font-mono-military font-bold">{leadershipScore}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={leadershipScore}
                onChange={(e) => setLeadershipScore(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Military Doctrine, Rules of Engagement & Tactics</span>
                <span className="text-amber-400 font-mono-military font-bold">{doctrineScore}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={doctrineScore}
                onChange={(e) => setDoctrineScore(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Military Bearing, Fitness & Uniform Discipline</span>
                <span className="text-amber-400 font-mono-military font-bold">{bearingScore}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={bearingScore}
                onChange={(e) => setBearingScore(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Board president remarks */}
          <div>
            <label className="block text-xs uppercase font-mono-military text-slate-400 mb-1">
              Board President Official Endorsement
            </label>
            <textarea
              rows={2}
              value={boardRemarks}
              onChange={(e) => setBoardRemarks(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>
        </div>

        {/* Board Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              playTacticalClick();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Dismiss Board
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleApprove(false)}
              className="px-4 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded transition"
            >
              Recommend Promotion
            </button>
            <button
              onClick={() => handleApprove(true)}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded transition shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Promote with Distinction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
