/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Soldier, MilitaryRank, AvailableMedal, UnitTransferRecord } from './types/military';
import { MILITARY_RANKS } from './data/militaryRanks';
import { INITIAL_SOLDIERS } from './data/initialSoldiers';
import { InsigniaIcon } from './components/InsigniaIcon';
import { SoldierCard } from './components/SoldierCard';
import { SoldierTable } from './components/SoldierTable';
import { PromotionModal } from './components/PromotionModal';
import { PromotionWarrantModal } from './components/PromotionWarrantModal';
import { PromotionBoardModal } from './components/PromotionBoardModal';
import { SoldierDossierModal } from './components/SoldierDossierModal';
import { AwardMedalModal } from './components/AwardMedalModal';
import { EnlistSoldierModal } from './components/EnlistSoldierModal';
import { RankHierarchyView } from './components/RankHierarchyView';
import { UnitDeploymentView } from './components/UnitDeploymentView';
import { 
  playTacticalClick, 
  playPromotionFanfare, 
  isSoundEnabled, 
  setSoundEnabled 
} from './utils/soundEffects';
import { 
  Shield, 
  Users, 
  Award, 
  ChevronUp, 
  Search, 
  UserPlus, 
  Layers, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Grid, 
  List, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert,
  Flame,
  FileCheck2,
  BarChart3
} from 'lucide-react';

const STORAGE_KEY = 'vanguard_military_roster_v2';

export default function App() {
  // State: Soldiers List
  const [soldiers, setSoldiers] = useState<Soldier[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s: Soldier) => {
            const defaultMatch = INITIAL_SOLDIERS.find((init) => init.id === s.id);
            const history = s.unitHistory && s.unitHistory.length > 0
              ? s.unitHistory
              : (defaultMatch?.unitHistory || [
                  {
                    id: `trans-init-${s.id}`,
                    fromUnit: 'US Army Reception Station & Initial Training',
                    fromSquad: 'Personnel Command',
                    toUnit: s.unit,
                    toSquad: s.squad,
                    date: '2023-01-01',
                    orderNumber: 'DA-INIT-001',
                    authorizingOfficer: 'HQ Personnel Command',
                    reason: 'Initial assignment to current station.'
                  }
                ]);
            return {
              ...s,
              unitHistory: history
            };
          });
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_SOLDIERS;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(soldiers));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [soldiers]);

  // Audio mute state
  const [soundOn, setSoundOn] = useState(true);
  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playTacticalClick();
  };

  // Main UI Navigation Tabs: 'roster' | 'ranks' | 'eligible' | 'deployment'
  const [activeMainTab, setActiveMainTab] = useState<'roster' | 'ranks' | 'eligible' | 'deployment'>('roster');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Active Modals State
  const [dossierSoldier, setDossierSoldier] = useState<Soldier | null>(null);
  const [promotedSoldier, setPromotedSoldier] = useState<Soldier | null>(null);
  const [boardReviewSoldier, setBoardReviewSoldier] = useState<Soldier | null>(null);
  const [medalAwardSoldier, setMedalAwardSoldier] = useState<Soldier | null>(null);
  const [isEnlistModalOpen, setIsEnlistModalOpen] = useState(false);
  
  // Promotion Warrant modal state
  const [warrantData, setWarrantData] = useState<{
    isOpen: boolean;
    soldier: Soldier | null;
    rank: MilitaryRank | null;
    orderNumber?: string;
    authorizingOfficer?: string;
    citation?: string;
  }>({
    isOpen: false,
    soldier: null,
    rank: null
  });

  // Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // Rank Map Lookup
  const ranksMap = useMemo(() => {
    const map: Record<string, MilitaryRank> = {};
    MILITARY_RANKS.forEach((r) => {
      map[r.id] = r;
    });
    return map;
  }, []);

  // Sorted Ranks Array
  const sortedRanks = useMemo(() => {
    return [...MILITARY_RANKS].sort((a, b) => a.level - b.level);
  }, []);

  // Helper: Find next and previous ranks
  const getRankNeighbors = (rankId: string) => {
    const currentIdx = sortedRanks.findIndex((r) => r.id === rankId);
    const currentRank = ranksMap[rankId] || sortedRanks[0];
    const prevRank = currentIdx > 0 ? sortedRanks[currentIdx - 1] : undefined;
    const nextRank = currentIdx >= 0 && currentIdx < sortedRanks.length - 1 ? sortedRanks[currentIdx + 1] : undefined;
    return { currentRank, prevRank, nextRank };
  };

  // Handle Soldier Promotion
  const handleConfirmPromotion = (
    soldierId: string,
    promotionData: {
      authorizingOfficer: string;
      orderNumber: string;
      citation: string;
      isFieldPromotion: boolean;
    }
  ) => {
    setSoldiers((prev) =>
      prev.map((s) => {
        if (s.id !== soldierId) return s;

        const { currentRank, nextRank } = getRankNeighbors(s.rankId);
        if (!nextRank) return s;

        const newRecord = {
          id: `prom-${Date.now()}`,
          fromRankId: currentRank.id,
          fromRankTitle: currentRank.title,
          toRankId: nextRank.id,
          toRankTitle: nextRank.title,
          date: new Date().toISOString().split('T')[0],
          orderNumber: promotionData.orderNumber,
          authorizingOfficer: promotionData.authorizingOfficer,
          citation: promotionData.citation,
          isFieldPromotion: promotionData.isFieldPromotion
        };

        const updatedSoldier: Soldier = {
          ...s,
          rankId: nextRank.id,
          timeInGradeMonths: 1, // Reset TIG for newly attained rank
          timeInServiceMonths: s.timeInServiceMonths + 1,
          promotionPoints: Math.max(s.promotionPoints, nextRank.requiredPoints),
          promotionHistory: [newRecord, ...s.promotionHistory]
        };

        // Prepare warrant modal view
        setWarrantData({
          isOpen: false, // user can click view warrant
          soldier: updatedSoldier,
          rank: nextRank,
          orderNumber: promotionData.orderNumber,
          authorizingOfficer: promotionData.authorizingOfficer,
          citation: promotionData.citation
        });

        // If dossier modal is open for this soldier, update it
        if (dossierSoldier?.id === s.id) {
          setDossierSoldier(updatedSoldier);
        }

        showToast(`Official Promotion: ${updatedSoldier.lastName} advanced to ${nextRank.title} (${nextRank.abbreviation})!`);
        return updatedSoldier;
      })
    );
  };

  // Quick Direct Promotion
  const handleQuickPromote = (soldier: Soldier) => {
    const { nextRank } = getRankNeighbors(soldier.rankId);
    if (!nextRank) return;
    setPromotedSoldier(soldier);
  };

  // Soldier Demotion
  const handleDemoteSoldier = (soldierId: string) => {
    const soldier = soldiers.find((s) => s.id === soldierId);
    if (!soldier) return;

    const { currentRank, prevRank } = getRankNeighbors(soldier.rankId);
    if (!prevRank) return;

    if (!window.confirm(`Confirm rank reduction for ${soldier.lastName} from ${currentRank.title} to ${prevRank.title}?`)) {
      return;
    }

    setSoldiers((prev) =>
      prev.map((s) => {
        if (s.id !== soldierId) return s;
        const updated: Soldier = {
          ...s,
          rankId: prevRank.id,
          timeInGradeMonths: 1,
          conductRecord: 'Under Review'
        };
        if (dossierSoldier?.id === s.id) {
          setDossierSoldier(updated);
        }
        return updated;
      })
    );
    showToast(`Administrative rank reduction: ${soldier.lastName} reduced to ${prevRank.title}.`);
  };

  // Award Medal to Soldier
  const handleAwardMedal = (soldierId: string, medal: AvailableMedal, customCitation: string) => {
    setSoldiers((prev) =>
      prev.map((s) => {
        if (s.id !== soldierId) return s;

        const newAward = {
          id: `awd-${Date.now()}`,
          name: medal.name,
          ribbonColor: medal.colors,
          description: medal.description,
          points: medal.points,
          dateAwarded: new Date().toISOString().split('T')[0],
          citation: customCitation
        };

        const updated: Soldier = {
          ...s,
          promotionPoints: s.promotionPoints + medal.points,
          awards: [newAward, ...s.awards]
        };

        if (dossierSoldier?.id === s.id) {
          setDossierSoldier(updated);
        }

        showToast(`Commendation Conferred: ${medal.name} awarded to ${s.lastName} (+${medal.points} pts)!`);
        return updated;
      })
    );
  };

  // Board Approved Promotion
  const handleBoardApproval = (
    soldierId: string,
    result: { boardScore: number; recommendation: string; remarks: string }
  ) => {
    const soldier = soldiers.find((s) => s.id === soldierId);
    if (!soldier) return;

    const { nextRank } = getRankNeighbors(soldier.rankId);
    if (!nextRank) return;

    handleConfirmPromotion(soldierId, {
      authorizingOfficer: `HQDA Board President (Score: ${result.boardScore}%)`,
      orderNumber: `BOARD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      citation: result.remarks,
      isFieldPromotion: false
    });
  };

  // Enlist New Soldier
  const handleEnlistSoldier = (newSoldier: Soldier) => {
    setSoldiers((prev) => [newSoldier, ...prev]);
    showToast(`Recruit Enlisted: ${newSoldier.lastName}, ${newSoldier.firstName} added to roster.`);
  };

  // Transfer Soldier Unit
  const handleTransferUnit = (
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
  ) => {
    setSoldiers((prev) =>
      prev.map((s) => {
        if (s.id !== soldierId) return s;

        const newRecord: UnitTransferRecord = {
          id: `trans-${Date.now()}`,
          fromUnit: s.unit,
          fromSquad: s.squad,
          toUnit: transferData.toUnit,
          toSquad: transferData.toSquad || s.squad,
          date: transferData.date || new Date().toISOString().split('T')[0],
          orderNumber: transferData.orderNumber,
          authorizingOfficer: transferData.authorizingOfficer,
          reason: transferData.reason || 'Operational reassignment order.'
        };

        const existingHistory = s.unitHistory || [];
        const updatedSoldier: Soldier = {
          ...s,
          unit: transferData.toUnit,
          squad: transferData.toSquad || s.squad,
          deploymentStatus: transferData.deploymentStatus || s.deploymentStatus,
          unitHistory: [newRecord, ...existingHistory]
        };

        if (dossierSoldier?.id === s.id) {
          setDossierSoldier(updatedSoldier);
        }

        showToast(`Reassignment Order Executed: ${updatedSoldier.lastName} transferred to ${transferData.toUnit}`);
        return updatedSoldier;
      })
    );
  };

  // Reset to default roster
  const handleResetRoster = () => {
    if (window.confirm('Reset personnel roster to initial default division formation?')) {
      playTacticalClick();
      setSoldiers(INITIAL_SOLDIERS);
      localStorage.removeItem(STORAGE_KEY);
      showToast('Roster reset to baseline division strength.');
    }
  };

  // Filtered soldiers list
  const filteredSoldiers = useMemo(() => {
    return soldiers.filter((s) => {
      // Main tab filter
      if (activeMainTab === 'eligible') {
        const { nextRank } = getRankNeighbors(s.rankId);
        if (!nextRank || s.promotionPoints < nextRank.requiredPoints) return false;
      }

      // Category filter
      if (selectedCategory !== 'All') {
        const r = ranksMap[s.rankId];
        if (!r || r.category !== selectedCategory) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const r = ranksMap[s.rankId];
        const matchName = `${s.firstName} ${s.lastName} ${s.callSign}`.toLowerCase().includes(q);
        const matchSN = s.serviceNumber.toLowerCase().includes(q);
        const matchMOS = s.specialtyMOS.toLowerCase().includes(q);
        const matchRank = r ? `${r.title} ${r.abbreviation} ${r.grade}`.toLowerCase().includes(q) : false;
        const matchUnit = s.unit.toLowerCase().includes(q);
        if (!matchName && !matchSN && !matchMOS && !matchRank && !matchUnit) return false;
      }

      return true;
    });
  }, [soldiers, activeMainTab, selectedCategory, searchQuery, ranksMap]);

  // Command metrics
  const promotableCount = useMemo(() => {
    return soldiers.filter((s) => {
      const { nextRank } = getRankNeighbors(s.rankId);
      return nextRank && s.promotionPoints >= nextRank.requiredPoints;
    }).length;
  }, [soldiers]);

  const totalPoints = useMemo(() => {
    return soldiers.reduce((acc, s) => acc + s.promotionPoints, 0);
  }, [soldiers]);

  const totalMedals = useMemo(() => {
    return soldiers.reduce((acc, s) => acc + s.awards.length, 0);
  }, [soldiers]);

  const distinctUnitCount = useMemo(() => {
    return new Set(soldiers.map((s) => s.unit)).size;
  }, [soldiers]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30">
      {/* Top Banner Notice / Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className="p-3 px-4 bg-slate-900 border border-amber-400 rounded-lg shadow-2xl flex items-center gap-3 text-xs text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Military Command Center Header */}
      <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Callout */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-400 shadow-md shadow-amber-500/10">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-military uppercase tracking-[0.25em] text-amber-400/90 font-bold">
                  DEFENSE COMMAND HQ
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-400 font-mono-military font-bold border border-emerald-500/30">
                  SYSTEM READY
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-wide text-white font-military flex items-center gap-2">
                VANGUARD <span className="text-slate-400 font-normal">| Soldier Rank & Promotion Command</span>
              </h1>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={toggleSound}
              title={soundOn ? 'Mute Military Audio' : 'Enable Tactical Audio'}
              className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={handleResetRoster}
              title="Reset Roster"
              className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                playTacticalClick();
                setIsEnlistModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition shadow-lg shadow-amber-500/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enlist Soldier</span>
            </button>
          </div>
        </div>

        {/* Global Key Stats Bar */}
        <div className="border-t border-slate-800/80 bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono-military">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Total Force:</span>
              <span className="font-bold text-white">{soldiers.length} Soldiers</span>
            </div>

            <div className="flex items-center gap-2">
              <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Promotion Eligible:</span>
              <span className={`font-bold ${promotableCount > 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                {promotableCount} Ready
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Medals Conferred:</span>
              <span className="font-bold text-amber-400">{totalMedals}</span>
            </div>

            <div className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-400">Total Merit Points:</span>
              <span className="font-bold text-sky-300">{totalPoints.toLocaleString()} pts</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => {
                playTacticalClick();
                setActiveMainTab('roster');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-military tracking-wider transition whitespace-nowrap flex items-center gap-2 ${
                activeMainTab === 'roster'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              Active Soldier Roster ({soldiers.length})
            </button>

            <button
              onClick={() => {
                playTacticalClick();
                setActiveMainTab('eligible');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-military tracking-wider transition whitespace-nowrap flex items-center gap-2 ${
                activeMainTab === 'eligible'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Promotion Eligible ({promotableCount})
            </button>

            <button
              onClick={() => {
                playTacticalClick();
                setActiveMainTab('deployment');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-military tracking-wider transition whitespace-nowrap flex items-center gap-2 ${
                activeMainTab === 'deployment'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-sky-400" />
              Unit Deployment ({distinctUnitCount})
            </button>

            <button
              onClick={() => {
                playTacticalClick();
                setActiveMainTab('ranks');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-military tracking-wider transition whitespace-nowrap flex items-center gap-2 ${
                activeMainTab === 'ranks'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              Military Rank Hierarchy Guide
            </button>
          </div>

          {/* View toggle (Grid vs Table) when in roster or eligible mode */}
          {activeMainTab !== 'ranks' && activeMainTab !== 'deployment' && (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800">
                <button
                  onClick={() => {
                    playTacticalClick();
                    setViewMode('cards');
                  }}
                  className={`p-1.5 rounded transition ${
                    viewMode === 'cards' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Card View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    playTacticalClick();
                    setViewMode('table');
                  }}
                  className={`p-1.5 rounded transition ${
                    viewMode === 'table' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Table Spreadsheet View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content based on Active Tab */}
        {activeMainTab === 'ranks' ? (
          <RankHierarchyView
            soldiers={soldiers}
            onSelectSoldierFromRank={(s) => setDossierSoldier(s)}
          />
        ) : activeMainTab === 'deployment' ? (
          <UnitDeploymentView
            soldiers={soldiers}
            ranksMap={ranksMap}
            onSelectSoldier={(s) => setDossierSoldier(s)}
            onPromoteSoldier={(s) => setPromotedSoldier(s)}
          />
        ) : (
          <div className="space-y-6">
            {/* Search and Category Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search name, callsign, MOS, serial no..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Category buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {['All', 'Enlisted', 'NCO', 'Warrant', 'Company Officer', 'Field Officer'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      playTacticalClick();
                      setSelectedCategory(cat);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Action Promotion Alert Box if soldiers are ready */}
            {promotableCount > 0 && activeMainTab === 'roster' && (
              <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/30 border border-emerald-500/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-military">
                      {promotableCount} Soldier{promotableCount > 1 ? 's' : ''} Eligible for Military Promotion!
                    </h4>
                    <p className="text-xs text-slate-300">
                      Soldiers have satisfied required promotion points and time in grade. Authorize promotion ceremonies or convene promotion boards.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playTacticalClick();
                    setActiveMainTab('eligible');
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow transition whitespace-nowrap"
                >
                  Review Promotable Soldiers →
                </button>
              </div>
            )}

            {/* Soldiers Display */}
            {filteredSoldiers.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30 space-y-3">
                <ShieldAlert className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-300">No Soldiers Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No personnel matching the current search parameters or category filter. Try clearing your filters or enlist a new soldier.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 text-xs text-amber-400 bg-amber-500/10 rounded-lg border border-amber-500/30 hover:bg-amber-500/20"
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSoldiers.map((soldier) => {
                  const { currentRank, nextRank } = getRankNeighbors(soldier.rankId);
                  return (
                    <SoldierCard
                      key={soldier.id}
                      soldier={soldier}
                      currentRank={currentRank}
                      nextRank={nextRank}
                      onOpenDossier={() => setDossierSoldier(soldier)}
                      onQuickPromote={() => handleQuickPromote(soldier)}
                      onConveneBoard={() => setBoardReviewSoldier(soldier)}
                      onAwardMedal={() => setMedalAwardSoldier(soldier)}
                    />
                  );
                })}
              </div>
            ) : (
              <SoldierTable
                soldiers={filteredSoldiers}
                ranksMap={ranksMap}
                onOpenDossier={(s) => setDossierSoldier(s)}
                onPromote={(s) => handleQuickPromote(s)}
                onConveneBoard={(s) => setBoardReviewSoldier(s)}
                onAwardMedal={(s) => setMedalAwardSoldier(s)}
              />
            )}
          </div>
        )}
      </main>

      {/* --- MODALS --- */}

      {/* 1. Direct Ceremonial Promotion Modal */}
      {promotedSoldier && (
        <PromotionModal
          soldier={promotedSoldier}
          currentRank={getRankNeighbors(promotedSoldier.rankId).currentRank}
          nextRank={getRankNeighbors(promotedSoldier.rankId).nextRank || getRankNeighbors(promotedSoldier.rankId).currentRank}
          isOpen={true}
          onClose={() => setPromotedSoldier(null)}
          onConfirmPromotion={(data) => handleConfirmPromotion(promotedSoldier.id, data)}
          onViewWarrant={() => {
            setWarrantData((prev) => ({ ...prev, isOpen: true }));
            setPromotedSoldier(null);
          }}
        />
      )}

      {/* 2. Promotion Warrant Certificate Modal (Printable) */}
      {warrantData.isOpen && warrantData.soldier && warrantData.rank && (
        <PromotionWarrantModal
          soldier={warrantData.soldier}
          rank={warrantData.rank}
          isOpen={true}
          orderNumber={warrantData.orderNumber}
          authorizingOfficer={warrantData.authorizingOfficer}
          citation={warrantData.citation}
          onClose={() => setWarrantData((prev) => ({ ...prev, isOpen: false }))}
        />
      )}

      {/* 3. Soldier Classified Dossier Modal */}
      {dossierSoldier && (
        <SoldierDossierModal
          soldier={dossierSoldier}
          currentRank={getRankNeighbors(dossierSoldier.rankId).currentRank}
          nextRank={getRankNeighbors(dossierSoldier.rankId).nextRank}
          prevRank={getRankNeighbors(dossierSoldier.rankId).prevRank}
          isOpen={true}
          onClose={() => setDossierSoldier(null)}
          onPromoteClick={() => {
            setPromotedSoldier(dossierSoldier);
          }}
          onDemoteClick={() => handleDemoteSoldier(dossierSoldier.id)}
          onAwardMedalClick={() => setMedalAwardSoldier(dossierSoldier)}
          onTransferUnit={handleTransferUnit}
          onViewWarrantForPromotion={(history) => {
            const histRank = ranksMap[history.toRankId] || sortedRanks[0];
            setWarrantData({
              isOpen: true,
              soldier: dossierSoldier,
              rank: histRank,
              orderNumber: history.orderNumber,
              authorizingOfficer: history.authorizingOfficer,
              citation: history.citation
            });
          }}
        />
      )}

      {/* 4. Award Medal / Commendation Modal */}
      {medalAwardSoldier && (
        <AwardMedalModal
          soldier={medalAwardSoldier}
          isOpen={true}
          onClose={() => setMedalAwardSoldier(null)}
          onAward={(medal, cit) => handleAwardMedal(medalAwardSoldier.id, medal, cit)}
        />
      )}

      {/* 5. Promotion Board Review Modal */}
      {boardReviewSoldier && (
        <PromotionBoardModal
          soldier={boardReviewSoldier}
          currentRank={getRankNeighbors(boardReviewSoldier.rankId).currentRank}
          nextRank={getRankNeighbors(boardReviewSoldier.rankId).nextRank || getRankNeighbors(boardReviewSoldier.rankId).currentRank}
          isOpen={true}
          onClose={() => setBoardReviewSoldier(null)}
          onBoardApproved={(result) => handleBoardApproval(boardReviewSoldier.id, result)}
        />
      )}

      {/* 6. Enlist Soldier Intake Modal */}
      <EnlistSoldierModal
        isOpen={isEnlistModalOpen}
        onClose={() => setIsEnlistModalOpen(false)}
        onEnlist={handleEnlistSoldier}
      />
    </div>
  );
}
