import React, { useState } from 'react';
import { MilitaryRank, RankCategory, Soldier } from '../types/military';
import { MILITARY_RANKS } from '../data/militaryRanks';
import { InsigniaIcon } from './InsigniaIcon';
import { playTacticalClick } from '../utils/soundEffects';
import { Users, Clock, Award, Shield, ChevronRight, Layers } from 'lucide-react';

interface RankHierarchyViewProps {
  soldiers: Soldier[];
  onSelectSoldierFromRank?: (soldier: Soldier) => void;
}

export const RankHierarchyView: React.FC<RankHierarchyViewProps> = ({
  soldiers,
  onSelectSoldierFromRank
}) => {
  const [selectedCategory, setSelectedCategory] = useState<RankCategory | 'All'>('All');
  const [selectedRankId, setSelectedRankId] = useState<string>(MILITARY_RANKS[0].id);

  const categories: Array<RankCategory | 'All'> = [
    'All',
    'Enlisted',
    'NCO',
    'Warrant',
    'Company Officer',
    'Field Officer',
    'General Officer'
  ];

  const filteredRanks = selectedCategory === 'All'
    ? MILITARY_RANKS
    : MILITARY_RANKS.filter((r) => r.category === selectedCategory);

  const selectedRank = MILITARY_RANKS.find((r) => r.id === selectedRankId) || MILITARY_RANKS[0];
  const soldiersAtSelectedRank = soldiers.filter((s) => s.rankId === selectedRank.id);

  return (
    <div className="space-y-6">
      {/* Category Pills Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        <span className="text-xs font-mono-military text-slate-500 uppercase flex items-center gap-1.5 mr-2">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          Filter Tier:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              playTacticalClick();
              setSelectedCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Rank Progression List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredRanks.map((rank) => {
              const count = soldiers.filter((s) => s.rankId === rank.id).length;
              const isSelected = rank.id === selectedRankId;

              return (
                <div
                  key={rank.id}
                  onClick={() => {
                    playTacticalClick();
                    setSelectedRankId(rank.id);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2 rounded-lg bg-slate-950 border ${isSelected ? 'border-amber-500/50' : 'border-slate-800'}`}>
                      <InsigniaIcon type={rank.insigniaType} size="md" glow={isSelected} />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono-military font-bold px-1.5 py-0.5 rounded bg-slate-950 text-amber-400 border border-slate-800">
                          {rank.grade}
                        </span>
                        <span className="text-[10px] font-mono-military text-slate-400">
                          {rank.natoCode}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                        {rank.title} ({rank.abbreviation})
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {rank.typicalCommand}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className={`text-xs font-mono-military font-bold px-2 py-0.5 rounded-full ${
                      count > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {count} {count === 1 ? 'soldier' : 'soldiers'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 font-mono-military">
                      {rank.requiredPoints} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Deep Dive on Selected Rank */}
        <div className="p-6 bg-slate-900/90 border border-amber-500/30 rounded-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase font-mono-military text-amber-400 tracking-wider">
                  {selectedRank.category} Specification
                </span>
                <h3 className="text-xl font-bold text-white font-military">
                  {selectedRank.title} ({selectedRank.abbreviation})
                </h3>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/40">
                <InsigniaIcon type={selectedRank.insigniaType} size="xl" glow />
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Point Requirement
                </div>
                <div className="text-base font-bold text-amber-400 font-mono-military">
                  {selectedRank.requiredPoints} <span className="text-xs font-normal text-slate-500">pts</span>
                </div>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  Min. Time In Grade
                </div>
                <div className="text-base font-bold text-sky-400 font-mono-military">
                  {selectedRank.minTimeInGradeMonths} <span className="text-xs font-normal text-slate-500">months</span>
                </div>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="space-y-2">
              <h5 className="text-xs font-mono-military uppercase text-slate-400">Tactical Role & Scope</h5>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded border border-slate-800">
                {selectedRank.responsibilities}
              </p>
            </div>

            {/* Typical Command */}
            <div className="space-y-1">
              <span className="text-xs font-mono-military uppercase text-slate-400">Standard Command Assignment</span>
              <div className="text-sm font-semibold text-white bg-slate-950/40 p-2.5 rounded border border-slate-800">
                {selectedRank.typicalCommand}
              </div>
            </div>

            {/* Soldiers currently holding this rank */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-military text-slate-400">
                <span>PERSONNEL AT THIS RANK ({soldiersAtSelectedRank.length})</span>
              </div>

              {soldiersAtSelectedRank.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded">
                  No active soldiers currently at this rank. Promote an eligible soldier to fill this echelon!
                </div>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {soldiersAtSelectedRank.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => onSelectSoldierFromRank && onSelectSoldierFromRank(s)}
                      className="p-2 bg-slate-950 rounded border border-slate-800 hover:border-amber-500/50 flex items-center justify-between cursor-pointer transition text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={s.avatarUrl} alt={s.lastName} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-white">{s.lastName}, {s.firstName}</div>
                          <div className="text-[10px] text-slate-400">{s.unit}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="text-[10px] font-mono-military text-slate-500 text-center pt-2 border-t border-slate-800">
            NATO CODE: {selectedRank.natoCode} • US PAY GRADE: {selectedRank.grade}
          </div>
        </div>
      </div>
    </div>
  );
};
