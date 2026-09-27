import React from 'react';
import { Soldier, MilitaryRank } from '../types/military';
import { InsigniaIcon } from './InsigniaIcon';
import { playTacticalClick } from '../utils/soundEffects';
import { ChevronUp, Award, FileText, CheckCircle2 } from 'lucide-react';

interface SoldierTableProps {
  soldiers: Soldier[];
  ranksMap: Record<string, MilitaryRank>;
  onOpenDossier: (soldier: Soldier) => void;
  onPromote: (soldier: Soldier) => void;
  onConveneBoard?: (soldier: Soldier) => void;
  onAwardMedal: (soldier: Soldier) => void;
}

export const SoldierTable: React.FC<SoldierTableProps> = ({
  soldiers,
  ranksMap,
  onOpenDossier,
  onPromote,
  onConveneBoard,
  onAwardMedal
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 shadow-xl">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-mono-military text-slate-400 uppercase tracking-wider">
            <th className="py-3 px-4">Soldier</th>
            <th className="py-3 px-4">Rank / Grade</th>
            <th className="py-3 px-4">MOS / Specialty</th>
            <th className="py-3 px-4">Unit</th>
            <th className="py-3 px-4">Points</th>
            <th className="py-3 px-4">TIG / TIS</th>
            <th className="py-3 px-4">Eligibility</th>
            <th className="py-3 px-4 text-right">Command Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {soldiers.map((soldier) => {
            const currentRank = ranksMap[soldier.rankId] || ranksMap['e1-pv1'];
            const allRanks = Object.values(ranksMap).sort((a, b) => a.level - b.level);
            const currentIdx = allRanks.findIndex((r) => r.id === currentRank.id);
            const nextRank = currentIdx >= 0 && currentIdx < allRanks.length - 1 ? allRanks[currentIdx + 1] : undefined;

            const isEligible = nextRank && soldier.promotionPoints >= nextRank.requiredPoints;

            return (
              <tr key={soldier.id} className="hover:bg-slate-800/40 transition">
                {/* Soldier avatar & name */}
                <td className="py-3 px-4">
                  <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => {
                      playTacticalClick();
                      onOpenDossier(soldier);
                    }}
                  >
                    <img
                      src={soldier.avatarUrl}
                      alt={soldier.lastName}
                      className="w-9 h-9 rounded-lg object-cover border border-slate-700 group-hover:border-amber-400"
                    />
                    <div>
                      <div className="font-bold text-white group-hover:text-amber-300">
                        {soldier.lastName}, {soldier.firstName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-military">
                        "{soldier.callSign}" • {soldier.serviceNumber}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Rank & Insignia */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <InsigniaIcon type={currentRank.insigniaType} size="sm" />
                    <div>
                      <div className="font-bold text-slate-200">
                        {currentRank.title} ({currentRank.abbreviation})
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono-military">
                        {currentRank.grade} • {currentRank.category}
                      </div>
                    </div>
                  </div>
                </td>

                {/* MOS Specialty */}
                <td className="py-3 px-4 text-slate-300">
                  <span className="font-mono-military text-[11px]">{soldier.specialtyMOS}</span>
                </td>

                {/* Unit */}
                <td className="py-3 px-4 text-slate-300 text-[11px]">
                  <div>{soldier.unit}</div>
                  <div className="text-[10px] text-slate-500">{soldier.squad}</div>
                </td>

                {/* Points */}
                <td className="py-3 px-4 font-mono-military">
                  <span className="font-bold text-amber-400">{soldier.promotionPoints}</span>
                  {nextRank && (
                    <span className="text-[10px] text-slate-500 ml-1">/ {nextRank.requiredPoints}</span>
                  )}
                </td>

                {/* TIG / TIS */}
                <td className="py-3 px-4 font-mono-military text-[11px] text-slate-300">
                  <div>TIG: {soldier.timeInGradeMonths} mo</div>
                  <div className="text-[10px] text-slate-500">TIS: {soldier.timeInServiceMonths} mo</div>
                </td>

                {/* Eligibility status */}
                <td className="py-3 px-4">
                  {nextRank ? (
                    isEligible ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Promotable
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Needs {nextRank.requiredPoints - soldier.promotionPoints} pts
                      </span>
                    )
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-military bg-slate-800 text-slate-400">
                      Apex Rank
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => {
                        playTacticalClick();
                        onOpenDossier(soldier);
                      }}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                      title="Inspect Dossier"
                    >
                      <FileText className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        playTacticalClick();
                        onAwardMedal(soldier);
                      }}
                      className="p-1.5 text-amber-400 hover:text-amber-300 rounded hover:bg-slate-800 transition"
                      title="Award Ribbon / Medals"
                    >
                      <Award className="w-4 h-4" />
                    </button>

                    {nextRank && onConveneBoard && (
                      <button
                        onClick={() => {
                          playTacticalClick();
                          onConveneBoard(soldier);
                        }}
                        className="px-2 py-1 text-[11px] font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition border border-slate-700"
                        title="Convene Formal Board"
                      >
                        Board
                      </button>
                    )}

                    {nextRank && (
                      <button
                        onClick={() => {
                          playTacticalClick();
                          onPromote(soldier);
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition shadow ${
                          isEligible
                            ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                            : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                        Promote
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
