import React, { useState } from 'react';
import { Soldier, AvailableMedal } from '../types/military';
import { AVAILABLE_MEDALS } from '../data/militaryRanks';
import { Award, Plus, X, Sparkles } from 'lucide-react';
import { playMedalChime, playTacticalClick } from '../utils/soundEffects';

interface AwardMedalModalProps {
  soldier: Soldier;
  isOpen: boolean;
  onClose: () => void;
  onAward: (medal: AvailableMedal, customCitation: string) => void;
}

export const AwardMedalModal: React.FC<AwardMedalModalProps> = ({
  soldier,
  isOpen,
  onClose,
  onAward
}) => {
  const [selectedMedalId, setSelectedMedalId] = useState<string>(AVAILABLE_MEDALS[0].id);
  const [citation, setCitation] = useState<string>('For extraordinary heroism and meritorious achievement in combat operations.');

  if (!isOpen) return null;

  const selectedMedal = AVAILABLE_MEDALS.find((m) => m.id === selectedMedalId) || AVAILABLE_MEDALS[0];

  const handleConfer = () => {
    playMedalChime();
    onAward(selectedMedal, citation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-amber-500/40 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white font-military">
              Confer Commendation or Decoration
            </h3>
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

        <div className="p-6 space-y-5">
          <div className="text-xs text-slate-300">
            Awarding a decoration to <strong className="text-white">{soldier.lastName}, {soldier.firstName}</strong> will grant promotion points and record the honor in their official military service file.
          </div>

          {/* Medal Selector Grid */}
          <div className="space-y-2">
            <label className="block text-xs uppercase font-mono-military text-slate-400">Select Decoration / Ribbon</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {AVAILABLE_MEDALS.map((medal) => {
                const isSelected = medal.id === selectedMedalId;
                return (
                  <button
                    key={medal.id}
                    onClick={() => {
                      playTacticalClick();
                      setSelectedMedalId(medal.id);
                    }}
                    type="button"
                    className={`p-2.5 rounded-lg border text-left transition flex items-center gap-3 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-10 h-3 rounded border border-slate-600 flex overflow-hidden flex-shrink-0">
                      {medal.colors.map((c, i) => (
                        <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold truncate">{medal.name}</div>
                      <div className="text-[10px] text-amber-400 font-mono-military">+{medal.points} pts • {medal.category}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Medal Preview */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-amber-400">{selectedMedal.name}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">{selectedMedal.description}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-3">
              <span className="text-base font-bold text-emerald-400 font-mono-military">+{selectedMedal.points}</span>
              <div className="text-[9px] text-slate-500 uppercase">Promo Points</div>
            </div>
          </div>

          {/* Citation input */}
          <div className="space-y-1">
            <label className="block text-xs uppercase font-mono-military text-slate-400">Award Citation / Justification</label>
            <textarea
              rows={2}
              value={citation}
              onChange={(e) => setCitation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-between">
          <button
            onClick={() => {
              playTacticalClick();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleConfer}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow-lg transition"
          >
            <Sparkles className="w-4 h-4" />
            Confer Award & Add Points
          </button>
        </div>
      </div>
    </div>
  );
};
