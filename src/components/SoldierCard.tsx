import React from 'react';
import { Soldier, MilitaryRank } from '../types/military';
import { InsigniaIcon } from './InsigniaIcon';
import { playTacticalClick } from '../utils/soundEffects';
import { ChevronUp, Award, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SoldierCardProps {
  soldier: Soldier;
  currentRank: MilitaryRank;
  nextRank?: MilitaryRank;
  onOpenDossier: () => void;
  onQuickPromote: () => void;
  onConveneBoard?: () => void;
  onAwardMedal: () => void;
}

export const SoldierCard: React.FC<SoldierCardProps> = ({
  soldier,
  currentRank,
  nextRank,
  onOpenDossier,
  onQuickPromote,
  onConveneBoard,
  onAwardMedal
}) => {
  const pointsDeficit = nextRank ? Math.max(0, nextRank.requiredPoints - soldier.promotionPoints) : 0;
  const tigDeficit = nextRank ? Math.max(0, nextRank.minTimeInGradeMonths - soldier.timeInGradeMonths) : 0;
  const isEligible = !!nextRank && pointsDeficit === 0;

  const percentProgress = nextRank
    ? Math.min(100, Math.round((soldier.promotionPoints / nextRank.requiredPoints) * 100))
    : 100;

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-xl overflow-hidden shadow-lg transition-all duration-200 flex flex-col justify-between group">
      {/* Top Banner with Branch & Status */}
      <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono-military">
        <span className="text-amber-400 font-semibold">{soldier.serviceNumber}</span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          soldier.deploymentStatus === 'Deployed'
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            : soldier.deploymentStatus === 'Special Operations'
            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        }`}>
          {soldier.deploymentStatus}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Personnel Header */}
        <div className="flex items-start gap-3">
          <div className="relative cursor-pointer" onClick={onOpenDossier}>
            <img
              src={soldier.avatarUrl}
              alt={soldier.lastName}
              className="w-14 h-14 rounded-lg object-cover border-2 border-slate-700 group-hover:border-amber-400/80 transition"
            />
            <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded p-0.5 border border-slate-700 shadow">
              <InsigniaIcon type={currentRank.insigniaType} size="sm" />
            </div>
          </div>

          <div className="flex-1 min-w-0 cursor-pointer" onClick={onOpenDossier}>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono-military font-bold text-amber-400">
                {currentRank.abbreviation}
              </span>
              <span className="text-[10px] text-slate-500 font-mono-military">
                ({currentRank.grade})
              </span>
            </div>
            <h3 className="text-base font-bold text-white truncate group-hover:text-amber-300 transition">
              {soldier.lastName}, {soldier.firstName}
            </h3>
            <div className="text-xs text-slate-400 truncate">
              "{soldier.callSign}" • {soldier.specialtyMOS.split('-')[0]}
            </div>
          </div>
        </div>

        {/* Tactical Unit & Squad */}
        <div className="text-[11px] text-slate-400 truncate bg-slate-950/40 px-2.5 py-1.5 rounded border border-slate-800/80">
          <span className="text-slate-300 font-semibold">{soldier.unit}</span>
        </div>

        {/* Promotion Readiness Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">
              {nextRank ? `Goal: ${nextRank.abbreviation}` : 'Top Rank'}
            </span>
            <span className={`font-mono-military font-bold text-[11px] ${isEligible ? 'text-emerald-400' : 'text-amber-400'}`}>
              {soldier.promotionPoints} {nextRank ? `/ ${nextRank.requiredPoints} pts` : 'pts'}
            </span>
          </div>

          {nextRank && (
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isEligible ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                }`}
                style={{ width: `${percentProgress}%` }}
              />
            </div>
          )}

          <div className="flex justify-between items-center text-[10px] text-slate-400">
            <span>TIG: {soldier.timeInGradeMonths} mo</span>
            {isEligible ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready for Promotion
              </span>
            ) : nextRank ? (
              <span className="text-amber-400/90 font-mono-military">
                {pointsDeficit} pts needed
              </span>
            ) : (
              <span className="text-slate-500 font-mono-military">Honorary Max</span>
            )}
          </div>
        </div>

        {/* Awards mini-rack preview */}
        {soldier.awards.length > 0 && (
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {soldier.awards.slice(0, 5).map((aw) => (
              <div
                key={aw.id}
                title={`${aw.name}: +${aw.points} pts`}
                className="w-6 h-2 rounded-xs border border-slate-600 flex overflow-hidden flex-shrink-0"
              >
                {aw.ribbonColor.map((col, idx) => (
                  <div key={idx} className="flex-1 h-full" style={{ backgroundColor: col }} />
                ))}
              </div>
            ))}
            {soldier.awards.length > 5 && (
              <span className="text-[9px] text-slate-500 font-mono-military">+{soldier.awards.length - 5}</span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2">
        <button
          onClick={() => {
            playTacticalClick();
            onOpenDossier();
          }}
          className="px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition border border-slate-700 flex items-center justify-center gap-1"
          title="Inspect Soldier Dossier"
        >
          <FileText className="w-3.5 h-3.5" />
          Dossier
        </button>

        {nextRank && onConveneBoard && (
          <button
            onClick={() => {
              playTacticalClick();
              onConveneBoard();
            }}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 rounded transition border border-slate-700 flex items-center justify-center gap-1"
            title="Convene Formal Promotion Board"
          >
            Board
          </button>
        )}

        {nextRank && (
          <button
            onClick={() => {
              playTacticalClick();
              onQuickPromote();
            }}
            className={`flex-1 px-3 py-1.5 text-xs font-bold rounded transition flex items-center justify-center gap-1.5 shadow ${
              isEligible
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
            }`}
          >
            <ChevronUp className="w-4 h-4" />
            Promote
          </button>
        )}
      </div>
    </div>
  );
};
