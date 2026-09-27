import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Soldier, MilitaryRank } from '../types/military';
import { InsigniaIcon } from './InsigniaIcon';
import { playPromotionFanfare, playDrumRoll, playTacticalClick } from '../utils/soundEffects';
import { Award, CheckCircle2, ChevronRight, ShieldAlert, Sparkles, X, FileText } from 'lucide-react';

interface PromotionModalProps {
  soldier: Soldier;
  currentRank: MilitaryRank;
  nextRank: MilitaryRank;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPromotion: (data: {
    authorizingOfficer: string;
    orderNumber: string;
    citation: string;
    isFieldPromotion: boolean;
  }) => void;
  onViewWarrant?: () => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  soldier,
  currentRank,
  nextRank,
  isOpen,
  onClose,
  onConfirmPromotion,
  onViewWarrant
}) => {
  const [stage, setStage] = useState<'review' | 'ceremony' | 'completed'>('review');
  const [authorizingOfficer, setAuthorizingOfficer] = useState('Brig. Gen. Marcus Vance, HQDA');
  const [orderNumber, setOrderNumber] = useState(() => `HQ-PROMO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [isFieldPromotion, setIsFieldPromotion] = useState(false);
  const [citation, setCitation] = useState(
    `For exceptional meritorious service, unwavering devotion to duty, and demonstrated capacity for elevated command responsibility in the ${soldier.unit}.`
  );

  if (!isOpen) return null;

  const pointsDeficit = Math.max(0, nextRank.requiredPoints - soldier.promotionPoints);
  const timeInGradeDeficit = Math.max(0, nextRank.minTimeInGradeMonths - soldier.timeInGradeMonths);
  const meetsStrictRequirements = pointsDeficit === 0 && timeInGradeDeficit === 0;

  const handleStartCeremony = () => {
    playTacticalClick();
    setStage('ceremony');
    playDrumRoll(1400);

    // After drum roll, play fanfare and shoot celebratory military confetti
    setTimeout(() => {
      playPromotionFanfare();
      setStage('completed');

      // Gold and tactical amber confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#e2e8f0', '#3b82f6', '#10b981']
      });

      // Confirm in parent state
      onConfirmPromotion({
        authorizingOfficer,
        orderNumber,
        citation,
        isFieldPromotion: !meetsStrictRequirements || isFieldPromotion
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-xl shadow-2xl overflow-hidden">
        {/* Top Military Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-400/80 font-mono-military">Command Promotion Action</div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                {stage === 'completed' ? 'Soldier Officially Promoted!' : 'Promotion Authorization Board'}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              playTacticalClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Soldier and Rank Comparison Card */}
          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img
                src={soldier.avatarUrl}
                alt={soldier.lastName}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/60 shadow-lg"
              />
              <div>
                <div className="text-xs text-amber-400 font-mono-military uppercase tracking-wider">{soldier.serviceNumber}</div>
                <div className="text-lg font-bold text-white">
                  {soldier.lastName}, {soldier.firstName}
                </div>
                <div className="text-xs text-slate-400">"{soldier.callSign}" • {soldier.specialtyMOS}</div>
              </div>
            </div>

            {/* Rank Evolution Display */}
            <div className="flex items-center gap-3 bg-slate-900 px-4 py-3 rounded-lg border border-slate-700/80 w-full sm:w-auto justify-center">
              <div className="flex flex-col items-center text-center">
                <InsigniaIcon type={currentRank.insigniaType} size="md" />
                <span className="text-xs font-semibold text-slate-300 mt-1">{currentRank.abbreviation}</span>
                <span className="text-[10px] text-slate-400">{currentRank.grade}</span>
              </div>

              <div className="flex flex-col items-center px-2">
                <ChevronRight className="w-6 h-6 text-amber-400 animate-pulse" />
                <span className="text-[9px] font-mono-military text-amber-400">PROMOTE</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <InsigniaIcon type={nextRank.insigniaType} size="md" glow />
                <span className="text-xs font-bold text-amber-300 mt-1">{nextRank.abbreviation}</span>
                <span className="text-[10px] text-amber-400/90">{nextRank.grade}</span>
              </div>
            </div>
          </div>

          {stage === 'review' && (
            <div className="space-y-4">
              {/* Eligibility Check Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700">
                  <div className="text-slate-400">Time in Grade</div>
                  <div className="font-semibold text-slate-200 mt-0.5">{soldier.timeInGradeMonths} / {nextRank.minTimeInGradeMonths} mo</div>
                  <div className={`text-[10px] font-medium ${timeInGradeDeficit === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {timeInGradeDeficit === 0 ? 'Eligible' : `Short by ${timeInGradeDeficit} mo`}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700">
                  <div className="text-slate-400">Promotion Points</div>
                  <div className="font-semibold text-slate-200 mt-0.5">{soldier.promotionPoints} / {nextRank.requiredPoints} pts</div>
                  <div className={`text-[10px] font-medium ${pointsDeficit === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {pointsDeficit === 0 ? 'Eligible' : `Deficit: ${pointsDeficit} pts`}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700">
                  <div className="text-slate-400">Combat Fitness</div>
                  <div className="font-semibold text-slate-200 mt-0.5">{soldier.fitnessScore} / 600 ACFT</div>
                  <div className="text-[10px] text-emerald-400 font-medium">Qualified</div>
                </div>

                <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700">
                  <div className="text-slate-400">Conduct</div>
                  <div className="font-semibold text-emerald-400 mt-0.5">{soldier.conductRecord}</div>
                  <div className="text-[10px] text-slate-400">Board Approved</div>
                </div>
              </div>

              {!meetsStrictRequirements && (
                <div className="p-3 bg-amber-950/40 border border-amber-600/40 rounded-lg flex items-start gap-3 text-xs text-amber-200">
                  <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">Commander Discretionary Field Promotion:</span> Soldier has not met standard peacetime points/TIG quotas, but can be promoted under wartime battlefield merit authorization.
                  </div>
                </div>
              )}

              {/* Warrant Order Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Authorizing Official / General</label>
                  <input
                    type="text"
                    value={authorizingOfficer}
                    onChange={(e) => setAuthorizingOfficer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500 font-mono-military"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Order / Warrant Number</label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500 font-mono-military"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Official Promotion Citation</label>
                <textarea
                  rows={2}
                  value={citation}
                  onChange={(e) => setCitation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="fieldPromotionCheck"
                  checked={isFieldPromotion || !meetsStrictRequirements}
                  onChange={(e) => setIsFieldPromotion(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="fieldPromotionCheck" className="text-xs text-slate-300 cursor-pointer">
                  Designate as Battlefield / Accelerated Merit Promotion
                </label>
              </div>
            </div>
          )}

          {stage === 'ceremony' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-4 border-amber-500/30 border-t-amber-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <InsigniaIcon type={nextRank.insigniaType} size="xl" glow />
                </div>
              </div>
              <h4 className="text-xl font-bold text-white tracking-widest font-military uppercase">
                Conducting Official Pinning Ceremony...
              </h4>
              <p className="text-sm text-amber-400 font-mono-military animate-pulse">
                Removing {currentRank.abbreviation} • Pinning {nextRank.abbreviation} Insignia
              </p>
            </div>
          )}

          {stage === 'completed' && (
            <div className="py-4 space-y-4 text-center">
              <div className="inline-flex p-4 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 glow-insignia">
                <InsigniaIcon type={nextRank.insigniaType} size="2xl" glow />
              </div>

              <div>
                <div className="text-xs text-amber-400 font-mono-military uppercase tracking-widest">Official Warrant Conferred</div>
                <h4 className="text-2xl font-bold text-white">
                  Congratulations, {nextRank.title} {soldier.lastName}!
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                  Grade {nextRank.grade} ({nextRank.natoCode}). New command authority: {nextRank.typicalCommand}.
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-amber-500/30 rounded text-xs text-amber-200/90 font-mono-military text-left">
                <div><strong className="text-amber-400">Order:</strong> {orderNumber}</div>
                <div><strong className="text-amber-400">Authority:</strong> {authorizingOfficer}</div>
                <div><strong className="text-amber-400">Citation:</strong> {citation}</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              playTacticalClick();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded border border-slate-700 hover:bg-slate-800 transition"
          >
            {stage === 'completed' ? 'Close Window' : 'Cancel'}
          </button>

          {stage === 'review' && (
            <button
              onClick={handleStartCeremony}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-lg hover:shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              Pin {nextRank.title} ({nextRank.abbreviation})
            </button>
          )}

          {stage === 'completed' && (
            <div className="flex items-center gap-2">
              {onViewWarrant && (
                <button
                  onClick={() => {
                    playTacticalClick();
                    onViewWarrant();
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-300 bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 rounded transition"
                >
                  <FileText className="w-4 h-4" />
                  View Promotion Warrant
                </button>
              )}
              <button
                onClick={() => {
                  playTacticalClick();
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
