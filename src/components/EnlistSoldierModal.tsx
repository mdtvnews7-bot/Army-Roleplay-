import React, { useState } from 'react';
import { Soldier, MilitaryRank } from '../types/military';
import { MILITARY_RANKS } from '../data/militaryRanks';
import { UserPlus, X, Shield, Sparkles } from 'lucide-react';
import { playTacticalClick } from '../utils/soundEffects';

interface EnlistSoldierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnlist: (newSoldier: Soldier) => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&h=300&fit=crop&crop=face'
];

const SPECIALTY_OPTIONS = [
  '11B - Infantryman',
  '18B - Special Forces Weapons Sergeant',
  '68W - Combat Medic Specialist',
  '19D - Cavalry Scout',
  '25B - Cyber Network Specialist',
  '153A - Rotary Wing Aviator',
  '12B - Combat Engineer',
  '35F - Intelligence Analyst',
  '91B - Wheeled Vehicle Mechanic',
  '13F - Fire Support Specialist'
];

export const EnlistSoldierModal: React.FC<EnlistSoldierModalProps> = ({
  isOpen,
  onClose,
  onEnlist
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [callSign, setCallSign] = useState('');
  const [rankId, setRankId] = useState('e1-pv1');
  const [specialtyMOS, setSpecialtyMOS] = useState(SPECIALTY_OPTIONS[0]);
  const [unit, setUnit] = useState('101st Airborne Division');
  const [squad, setSquad] = useState('Alpha Fireteam');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [biography, setBiography] = useState('New recruit enlisted with high tactical aptitude and dedication to command.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    playTacticalClick();

    const selectedRank = MILITARY_RANKS.find((r) => r.id === rankId) || MILITARY_RANKS[0];

    const newSoldier: Soldier = {
      id: `sld-${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      callSign: callSign.trim() || 'Rookie',
      serviceNumber: `RA-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      branch: 'Army',
      rankId: selectedRank.id,
      specialtyMOS,
      unit,
      squad,
      deploymentStatus: 'Active Duty',
      avatarUrl: selectedAvatar,
      gender: 'M',
      promotionPoints: selectedRank.requiredPoints,
      timeInGradeMonths: 1,
      timeInServiceMonths: 1,
      fitnessScore: Math.floor(480 + Math.random() * 100),
      marksmanship: 'Sharpshooter',
      awards: [],
      promotionHistory: [],
      unitHistory: [
        {
          id: `trans-${Date.now()}`,
          fromUnit: 'US Army Recruiting & Training Command',
          fromSquad: 'Personnel Intake Reception Station',
          toUnit: unit.trim() || '1st Infantry Division',
          toSquad: squad.trim() || 'HQ Detachment',
          date: new Date().toISOString().split('T')[0],
          orderNumber: `ASG-${Math.floor(1000 + Math.random() * 9000)}`,
          authorizingOfficer: 'HQ Personnel Command',
          reason: 'Initial active duty operational stationing upon enlistment.'
        }
      ],
      conductRecord: 'Exemplary',
      bloodType: ['O+', 'A+', 'B+', 'AB+'][Math.floor(Math.random() * 4)],
      biography: biography.trim()
    };

    onEnlist(newSoldier);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white font-military">
              Enlist New Soldier Into Active Roster
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Avatar Selector */}
          <div>
            <label className="block text-slate-400 font-mono-military uppercase mb-2">Personnel Portrait</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {AVATAR_OPTIONS.map((avatar, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${
                    selectedAvatar === avatar ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/20' : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">First Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Last Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mercer"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tactical Call Sign</label>
              <input
                type="text"
                placeholder="e.g. Hawk"
                value={callSign}
                onChange={(e) => setCallSign(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Initial Starting Rank</label>
              <select
                value={rankId}
                onChange={(e) => setRankId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {MILITARY_RANKS.slice(0, 10).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.grade} - {r.title} ({r.abbreviation})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Military Occupational Specialty (MOS)</label>
              <select
                value={specialtyMOS}
                onChange={(e) => setSpecialtyMOS(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {SPECIALTY_OPTIONS.map((mos) => (
                  <option key={mos} value={mos}>{mos}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Unit Assignment</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Squad / Team</label>
            <input
              type="text"
              value={squad}
              onChange={(e) => setSquad(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Soldier Background & Bio</label>
            <textarea
              rows={2}
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                playTacticalClick();
                onClose();
              }}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow-lg transition"
            >
              <Sparkles className="w-4 h-4" />
              Complete Enlistment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
