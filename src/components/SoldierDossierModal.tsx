import React, { useState } from 'react';
import { Soldier, MilitaryRank } from '../types/military';
import { InsigniaIcon } from './InsigniaIcon';
import { playTacticalClick, playTransferChime } from '../utils/soundEffects';
import { 
  X, Award, Shield, FileText, Activity, Target, Clock, 
  ChevronUp, ChevronDown, CheckCircle, PlusCircle, AlertTriangle,
  ArrowRightLeft, Building2, MapPin, Calendar, UserCheck, Compass
} from 'lucide-react';

interface SoldierDossierModalProps {
  soldier: Soldier;
  currentRank: MilitaryRank;
  nextRank?: MilitaryRank;
  prevRank?: MilitaryRank;
  isOpen: boolean;
  onClose: () => void;
  onPromoteClick: () => void;
  onDemoteClick: () => void;
  onAwardMedalClick: () => void;
  onViewWarrantForPromotion?: (historyItem: Soldier['promotionHistory'][0]) => void;
  onTransferUnit?: (
    soldierId: string,
    transferData: {
      toUnit: string;
      toSquad?: string;
      deploymentStatus?: Soldier['deploymentStatus'];
      orderNumber: string;
      authorizingOfficer: string;
      reason?: string;
      date?: string;
    }
  ) => void;
}

const PRESET_UNITS = [
  '1st Infantry Division "Big Red One"',
  '82nd Airborne Division "All American"',
  '101st Airborne Division (Air Assault)',
  '75th Ranger Regiment',
  '1st Special Forces Command (Green Berets)',
  '10th Mountain Division (Light Infantry)',
  '1st Armored Division "Old Ironsides"',
  '3rd Infantry Division "Rock of the Marne"',
  '160th Special Operations Aviation Regiment (Night Stalkers)',
  '4th Infantry Division "Ivy"',
  'Delta Force / 1st SFOD-D',
  'HQ Joint Special Operations Command (JSOC)',
  'Custom Unit...'
];

const PRESET_REASONS = [
  'Permanent Change of Station (PCS) - Rotational Assignment',
  'Special Operations Selection & Tactical Detachment',
  'Operational Unit Reassignment & Troop Surge',
  'Post-Promotion Leadership Placement',
  'Combat Replacement & Tactical Readiness Augmentation',
  'Joint Command Staff Attachment',
  'Advanced Technical Instructor Assignment',
  'Commander Direct Reassignment'
];

export const SoldierDossierModal: React.FC<SoldierDossierModalProps> = ({
  soldier,
  currentRank,
  nextRank,
  prevRank,
  isOpen,
  onClose,
  onPromoteClick,
  onDemoteClick,
  onAwardMedalClick,
  onViewWarrantForPromotion,
  onTransferUnit
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'units' | 'awards' | 'history'>('profile');
  
  // Transfer Form State
  const [isTransferFormOpen, setIsTransferFormOpen] = useState(false);
  const [selectedUnitPreset, setSelectedUnitPreset] = useState(PRESET_UNITS[0]);
  const [customUnit, setCustomUnit] = useState('');
  const [targetSquad, setTargetSquad] = useState(soldier.squad || 'Alpha Squad, 1st Platoon');
  const [targetStatus, setTargetStatus] = useState<Soldier['deploymentStatus']>(soldier.deploymentStatus);
  const [transferOrderNumber, setTransferOrderNumber] = useState(
    `TO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [authorizingCommander, setAuthorizingCommander] = useState('Brig. Gen. M. Vance, HQDA');
  const [transferReasonPreset, setTransferReasonPreset] = useState(PRESET_REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const pointsDeficit = nextRank ? Math.max(0, nextRank.requiredPoints - soldier.promotionPoints) : 0;
  const isEligibleForPromotion = !!nextRank && pointsDeficit === 0;
  const unitHistory = soldier.unitHistory || [];

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUnit = selectedUnitPreset === 'Custom Unit...' ? customUnit.trim() : selectedUnitPreset;
    if (!finalUnit) return;

    const finalReason = customReason.trim() ? customReason.trim() : transferReasonPreset;

    if (onTransferUnit) {
      onTransferUnit(soldier.id, {
        toUnit: finalUnit,
        toSquad: targetSquad.trim() || 'HQ Detachment',
        deploymentStatus: targetStatus,
        orderNumber: transferOrderNumber.trim() || `TO-${Date.now().toString().slice(-4)}`,
        authorizingOfficer: authorizingCommander.trim() || 'Command Headquarters',
        reason: finalReason,
        date: transferDate || new Date().toISOString().split('T')[0]
      });
    }

    playTransferChime();
    setIsTransferFormOpen(false);
    // Refresh order number for next time
    setTransferOrderNumber(`TO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-mono-military">Classified Military Dossier</div>
              <h2 className="text-lg font-bold text-white font-military tracking-wide">
                {currentRank.title} {soldier.firstName} {soldier.lastName}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              playTacticalClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Soldier Banner Summary */}
        <div className="p-6 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={soldier.avatarUrl}
                alt={soldier.lastName}
                className="w-20 h-20 rounded-xl object-cover border-2 border-amber-500/60 shadow-lg"
              />
              <span className="absolute -bottom-2 -right-2 bg-slate-900 p-1 rounded-full border border-slate-700">
                <InsigniaIcon type={currentRank.insigniaType} size="sm" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-military font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentRank.grade} • {currentRank.abbreviation}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {soldier.deploymentStatus}
                </span>
                <span className="text-xs text-slate-400 font-mono-military">Blood: {soldier.bloodType}</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {soldier.firstName} "{soldier.callSign}" {soldier.lastName}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span>{soldier.unit} • {soldier.squad}</span>
                <button
                  onClick={() => {
                    playTacticalClick();
                    setActiveTab('units');
                    setIsTransferFormOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-military font-semibold bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/40 transition"
                  title="Transfer soldier to a new military unit"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  Transfer Unit
                </button>
              </div>
              <div className="text-xs font-mono-military text-amber-400/90">
                SN: {soldier.serviceNumber} • MOS: {soldier.specialtyMOS}
              </div>
            </div>
          </div>

          {/* Promotion / Demotion Action Buttons */}
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            {nextRank ? (
              <button
                onClick={() => {
                  playTacticalClick();
                  onPromoteClick();
                }}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition shadow-lg ${
                  isEligibleForPromotion
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/20 animate-pulse'
                    : 'bg-amber-600/80 hover:bg-amber-600 text-white'
                }`}
              >
                <ChevronUp className="w-4 h-4" />
                <span>Promote to {nextRank.abbreviation} ({nextRank.title})</span>
              </button>
            ) : (
              <div className="px-3 py-2 text-center text-xs font-mono-military text-amber-400 bg-amber-500/10 rounded border border-amber-500/20">
                Maximum Rank Attained (General)
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  playTacticalClick();
                  onAwardMedalClick();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-amber-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Award Medal / Points
              </button>

              {prevRank && (
                <button
                  onClick={() => {
                    playTacticalClick();
                    onDemoteClick();
                  }}
                  title="Demote soldier rank"
                  className="flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 transition"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                  Demote
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 bg-slate-950 border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => {
              playTacticalClick();
              setActiveTab('profile');
            }}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap border-b-2 ${
              activeTab === 'profile'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Tactical Profile & Readiness
          </button>
          <button
            onClick={() => {
              playTacticalClick();
              setActiveTab('units');
            }}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              activeTab === 'units'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Unit Assignments ({unitHistory.length})
          </button>
          <button
            onClick={() => {
              playTacticalClick();
              setActiveTab('awards');
            }}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap border-b-2 ${
              activeTab === 'awards'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Awards & Commendations ({soldier.awards.length})
          </button>
          <button
            onClick={() => {
              playTacticalClick();
              setActiveTab('history');
            }}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap border-b-2 ${
              activeTab === 'history'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Promotion History ({soldier.promotionHistory.length})
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Readiness Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Promotion Points</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl font-bold font-mono-military text-amber-400">
                    {soldier.promotionPoints} <span className="text-xs text-slate-500 font-normal">pts</span>
                  </div>
                  {nextRank && (
                    <div className="text-[10px] text-slate-400 mt-1">
                      Target: {nextRank.requiredPoints} pts
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Time In Grade</span>
                    <Clock className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-xl font-bold font-mono-military text-sky-400">
                    {soldier.timeInGradeMonths} <span className="text-xs text-slate-500 font-normal">mo</span>
                  </div>
                  {nextRank && (
                    <div className="text-[10px] text-slate-400 mt-1">
                      Req: {nextRank.minTimeInGradeMonths} mo
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>ACFT Fitness</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold font-mono-military text-emerald-400">
                    {soldier.fitnessScore} <span className="text-xs text-slate-500 font-normal">/ 600</span>
                  </div>
                  <div className="text-[10px] text-emerald-400/80 mt-1">Passing standard</div>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Marksmanship</span>
                    <Target className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-base font-bold text-rose-300">
                    {soldier.marksmanship}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Standard Issue M4A1</div>
                </div>
              </div>

              {/* Progress to Next Rank */}
              {nextRank && (
                <div className="p-4 bg-slate-950/80 border border-amber-500/20 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300">Next Rank Progression: {nextRank.title} ({nextRank.abbreviation})</span>
                    <span className="text-amber-400 font-mono-military">
                      {Math.min(100, Math.round((soldier.promotionPoints / nextRank.requiredPoints) * 100))}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round((soldier.promotionPoints / nextRank.requiredPoints) * 100))}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Total Service: {soldier.timeInServiceMonths} months</span>
                    <span>{pointsDeficit === 0 ? '✓ Point threshold achieved' : `${pointsDeficit} points needed`}</span>
                  </div>
                </div>
              )}

              {/* Soldier Biography & Role Description */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-mono-military text-slate-400 tracking-wider">Commander Assessment & Biography</h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                  {soldier.biography}
                </p>
              </div>

              {/* Current Rank Operational Responsibilities */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2">
                <div className="text-xs uppercase font-mono-military text-amber-400 font-bold">
                  {currentRank.title} ({currentRank.grade}) Duties
                </div>
                <p className="text-xs text-slate-300 leading-normal">
                  {currentRank.responsibilities}
                </p>
                <div className="text-[11px] text-slate-400">
                  <strong className="text-slate-300">Command Scope:</strong> {currentRank.typicalCommand}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UNIT ASSIGNMENTS & TRANSFER */}
          {activeTab === 'units' && (
            <div className="space-y-6">
              {/* Active Unit Card */}
              <div className="p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-sky-500/30 rounded-xl relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 px-3 py-1 bg-sky-500/20 border-b border-l border-sky-500/30 rounded-bl text-[10px] font-mono-military uppercase tracking-wider text-sky-300 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  CURRENT ACTIVE STATION
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-sky-400" />
                      <h3 className="text-lg font-bold text-white font-military">
                        {soldier.unit}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="font-mono-military text-amber-400 font-semibold">{soldier.squad}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {soldier.deploymentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Operational duty station for Service Number <span className="font-mono-military text-slate-300">{soldier.serviceNumber}</span>.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      playTacticalClick();
                      setIsTransferFormOpen(!isTransferFormOpen);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition shadow-lg whitespace-nowrap ${
                      isTransferFormOpen
                        ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                        : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/20'
                    }`}
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>{isTransferFormOpen ? 'Close Transfer Form' : 'Execute Unit Transfer'}</span>
                  </button>
                </div>
              </div>

              {/* Transfer Order Execution Form (Collapsible) */}
              {isTransferFormOpen && (
                <form
                  onSubmit={handleExecuteTransfer}
                  className="p-5 bg-slate-950 border border-sky-500/40 rounded-xl space-y-4 shadow-xl animate-in fade-in duration-300"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className="w-4 h-4 text-sky-400" />
                      <span className="text-xs uppercase font-mono-military font-bold text-sky-300 tracking-wider">
                        Official Military Reassignment Order Form
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono-military">
                      ARMY REGULATION 614-200
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Destination Unit */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        New Unit / Command Designation *
                      </label>
                      <select
                        value={selectedUnitPreset}
                        onChange={(e) => setSelectedUnitPreset(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-sky-500"
                      >
                        {PRESET_UNITS.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                      {selectedUnitPreset === 'Custom Unit...' && (
                        <input
                          type="text"
                          required
                          placeholder="Enter custom unit name..."
                          value={customUnit}
                          onChange={(e) => setCustomUnit(e.target.value)}
                          className="w-full mt-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-sky-500"
                        />
                      )}
                    </div>

                    {/* Squad / Subunit */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Assigned Squad / Detachment / Team *
                      </label>
                      <input
                        type="text"
                        required
                        value={targetSquad}
                        onChange={(e) => setTargetSquad(e.target.value)}
                        placeholder="e.g. Bravo Squad, 2nd Platoon"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    {/* Deployment Status */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Operational Readiness / Deployment Status
                      </label>
                      <select
                        value={targetStatus}
                        onChange={(e) => setTargetStatus(e.target.value as Soldier['deploymentStatus'])}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-sky-500"
                      >
                        <option value="Active Duty">Active Duty</option>
                        <option value="Deployed">Deployed</option>
                        <option value="Special Operations">Special Operations</option>
                        <option value="Garrison">Garrison</option>
                        <option value="Reserve">Reserve</option>
                      </select>
                    </div>

                    {/* Transfer Order Number */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Transfer Order Number
                      </label>
                      <input
                        type="text"
                        required
                        value={transferOrderNumber}
                        onChange={(e) => setTransferOrderNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono-military focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    {/* Authorizing Officer */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Authorizing Commander / Authority
                      </label>
                      <input
                        type="text"
                        required
                        value={authorizingCommander}
                        onChange={(e) => setAuthorizingCommander(e.target.value)}
                        placeholder="e.g. Brig. Gen. M. Vance"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    {/* Effective Date */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Effective Transfer Date
                      </label>
                      <input
                        type="date"
                        required
                        value={transferDate}
                        onChange={(e) => setTransferDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  {/* Transfer Reason */}
                  <div className="text-xs">
                    <label className="block text-slate-300 font-semibold mb-1">
                      Reason for Transfer / Reassignment Justification
                    </label>
                    <select
                      value={transferReasonPreset}
                      onChange={(e) => setTransferReasonPreset(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-sky-500 mb-2"
                    >
                      {PRESET_REASONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <textarea
                      rows={2}
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Optional additional tactical notes or specific justification citation..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        playTacticalClick();
                        setIsTransferFormOpen(false);
                      }}
                      className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-lg shadow-lg shadow-sky-500/20 transition"
                    >
                      <UserCheck className="w-4 h-4" />
                      Authorize & Move Soldier
                    </button>
                  </div>
                </form>
              )}

              {/* Chronological Unit Assignment History */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-mono-military uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-sky-400" />
                    Unit Transfer History & Assignment Logs ({unitHistory.length})
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono-military">CHRONOLOGICAL RECORD</span>
                </div>

                {unitHistory.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-lg space-y-1">
                    <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-300">Initial Unit Assignment Active</p>
                    <p className="text-slate-500">
                      No transfer history logged yet. Use the "Execute Unit Transfer" button above to reassign this soldier to another unit.
                    </p>
                  </div>
                ) : (
                  <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                    {unitHistory.map((transfer, idx) => (
                      <div key={transfer.id || idx} className="relative group">
                        <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-sky-500 border-4 border-slate-900 group-hover:scale-110 transition" />
                        
                        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2 hover:border-sky-500/40 transition shadow">
                          {/* Unit From -> To Title */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white font-military">
                                {transfer.toUnit}
                              </span>
                              {transfer.toSquad && (
                                <span className="text-[11px] text-amber-400 font-mono-military">
                                  ({transfer.toSquad})
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono-military text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40 self-start sm:self-auto">
                              Effective: {transfer.date}
                            </span>
                          </div>

                          {/* Previous Station */}
                          <div className="text-xs text-slate-400 flex items-center gap-1.5">
                            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span>
                              Transferred from: <strong className="text-slate-300">{transfer.fromUnit}</strong>
                              {transfer.fromSquad ? ` • ${transfer.fromSquad}` : ''}
                            </span>
                          </div>

                          {/* Reason */}
                          {transfer.reason && (
                            <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800/80 italic">
                              "{transfer.reason}"
                            </p>
                          )}

                          {/* Orders & Authority */}
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-military text-slate-400 pt-1 border-t border-slate-800/60">
                            <span>
                              <strong>Order:</strong> {transfer.orderNumber}
                            </span>
                            <span>
                              <strong>Authorized By:</strong> {transfer.authorizingOfficer}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: AWARDS */}
          {activeTab === 'awards' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400 font-mono-military">
                  RIBBON RACK & COMMENDATIONS ({soldier.awards.length})
                </div>
                <button
                  onClick={() => {
                    playTacticalClick();
                    onAwardMedalClick();
                  }}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                >
                  <PlusCircle className="w-4 h-4" />
                  Confer New Medal
                </button>
              </div>

              {soldier.awards.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-lg">
                  No awards currently logged. Award medals and battle ribbons to confer promotion points!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {soldier.awards.map((award) => (
                    <div
                      key={award.id}
                      className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex flex-col justify-between space-y-2 hover:border-amber-500/40 transition"
                    >
                      <div className="flex items-start gap-3">
                        {/* Realistic Ribbon Graphic */}
                        <div className="w-12 h-4 rounded border border-slate-600 flex overflow-hidden shadow flex-shrink-0 mt-1">
                          {award.ribbonColor.map((color, idx) => (
                            <div key={idx} className="flex-1 h-full" style={{ backgroundColor: color }} />
                          ))}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{award.name}</div>
                          <div className="text-[10px] text-amber-400 font-mono-military">+{award.points} Promotion Points</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 italic">"{award.citation}"</p>
                      <div className="text-[10px] text-slate-500 font-mono-military">
                        Conferred: {award.dateAwarded}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROMOTION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 font-mono-military">
                CHRONOLOGICAL RANK TRANSITIONS & OFFICIAL WARRANTS
              </div>

              {soldier.promotionHistory.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-lg">
                  Initial enlistment rank. No subsequent promotions recorded yet.
                </div>
              ) : (
                <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                  {soldier.promotionHistory.map((history, idx) => (
                    <div key={history.id || idx} className="relative group">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-slate-900" />
                      <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-400">
                            Promoted from {history.fromRankTitle} → {history.toRankTitle}
                          </span>
                          <span className="text-[10px] font-mono-military text-slate-400">
                            {history.date}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300">
                          <strong>Order:</strong> {history.orderNumber} • <strong>Authority:</strong> {history.authorizingOfficer}
                        </div>
                        <p className="text-xs text-slate-400 italic">"{history.citation}"</p>

                        {onViewWarrantForPromotion && (
                          <button
                            onClick={() => {
                              playTacticalClick();
                              onViewWarrantForPromotion(history);
                            }}
                            className="inline-flex items-center gap-1.5 text-[11px] text-amber-400 hover:text-amber-300 font-semibold pt-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            View Warrant Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <span className="text-xs font-mono-military text-slate-500">
            RECORD STATUS: VALIDATED
          </span>
          <button
            onClick={() => {
              playTacticalClick();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
