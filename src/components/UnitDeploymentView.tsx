import React, { useState, useMemo } from 'react';
import { Soldier, MilitaryRank } from '../types/military';
import { InsigniaIcon } from './InsigniaIcon';
import { playTacticalClick } from '../utils/soundEffects';
import { 
  Building2, Users, Shield, Compass, ChevronRight, 
  BarChart3, PieChart, Activity, Award, ChevronUp, 
  Search, ArrowRightLeft, Radio, AlertCircle
} from 'lucide-react';

interface UnitDeploymentViewProps {
  soldiers: Soldier[];
  ranksMap: Record<string, MilitaryRank>;
  onSelectSoldier: (soldier: Soldier) => void;
  onPromoteSoldier: (soldier: Soldier) => void;
}

const STATUS_COLORS: Record<Soldier['deploymentStatus'], { bg: string; text: string; border: string; bar: string }> = {
  'Active Duty': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', bar: '#10b981' },
  'Deployed': { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30', bar: '#0284c7' },
  'Special Operations': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', bar: '#a855f7' },
  'Garrison': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', bar: '#f59e0b' },
  'Reserve': { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', bar: '#64748b' }
};

export const UnitDeploymentView: React.FC<UnitDeploymentViewProps> = ({
  soldiers,
  ranksMap,
  onSelectSoldier,
  onPromoteSoldier
}) => {
  const [selectedUnit, setSelectedUnit] = useState<string>('All');
  const [chartViewMode, setChartViewMode] = useState<'unit' | 'squad' | 'status'>('unit');
  const [searchFilter, setSearchFilter] = useState('');

  // 1. Group Soldiers by Unit
  const unitStats = useMemo(() => {
    const map: Record<string, {
      unitName: string;
      soldiers: Soldier[];
      squads: Record<string, Soldier[]>;
      statusCounts: Record<Soldier['deploymentStatus'], number>;
      officerCount: number;
      ncoCount: number;
      enlistedCount: number;
      warrantCount: number;
      totalPoints: number;
      promotableCount: number;
    }> = {};

    soldiers.forEach((soldier) => {
      const u = soldier.unit || 'Unassigned / Depot';
      if (!map[u]) {
        map[u] = {
          unitName: u,
          soldiers: [],
          squads: {},
          statusCounts: {
            'Active Duty': 0,
            'Deployed': 0,
            'Special Operations': 0,
            'Garrison': 0,
            'Reserve': 0
          },
          officerCount: 0,
          ncoCount: 0,
          enlistedCount: 0,
          warrantCount: 0,
          totalPoints: 0,
          promotableCount: 0
        };
      }

      map[u].soldiers.push(soldier);
      map[u].totalPoints += soldier.promotionPoints;

      // Squad group
      const sq = soldier.squad || 'HQ Detachment';
      if (!map[u].squads[sq]) map[u].squads[sq] = [];
      map[u].squads[sq].push(soldier);

      // Status
      map[u].statusCounts[soldier.deploymentStatus] = (map[u].statusCounts[soldier.deploymentStatus] || 0) + 1;

      // Rank category breakdown
      const rank = ranksMap[soldier.rankId];
      if (rank) {
        if (rank.category.includes('Officer')) map[u].officerCount++;
        else if (rank.category === 'NCO') map[u].ncoCount++;
        else if (rank.category === 'Warrant') map[u].warrantCount++;
        else map[u].enlistedCount++;

        // Promotable check (level < 24)
        if (soldier.promotionPoints >= rank.requiredPoints && rank.level < 24) {
          map[u].promotableCount++;
        }
      }
    });

    return Object.values(map).sort((a, b) => b.soldiers.length - a.soldiers.length);
  }, [soldiers, ranksMap]);

  // 2. Global Deployment Status Distribution
  const globalStatusDistribution = useMemo(() => {
    const counts: Record<Soldier['deploymentStatus'], number> = {
      'Active Duty': 0,
      'Deployed': 0,
      'Special Operations': 0,
      'Garrison': 0,
      'Reserve': 0
    };

    soldiers.forEach((s) => {
      counts[s.deploymentStatus] = (counts[s.deploymentStatus] || 0) + 1;
    });

    return Object.entries(counts).map(([status, count]) => ({
      status: status as Soldier['deploymentStatus'],
      count,
      pct: soldiers.length > 0 ? Math.round((count / soldiers.length) * 100) : 0
    }));
  }, [soldiers]);

  // 3. Filtered list for detailed soldier roster
  const displayedSoldiers = useMemo(() => {
    return soldiers.filter((s) => {
      if (selectedUnit !== 'All' && s.unit !== selectedUnit) return false;
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        const matchName = `${s.firstName} ${s.lastName} ${s.callSign}`.toLowerCase().includes(q);
        const matchSquad = s.squad.toLowerCase().includes(q);
        const matchUnit = s.unit.toLowerCase().includes(q);
        const matchMos = s.specialtyMOS.toLowerCase().includes(q);
        if (!matchName && !matchSquad && !matchUnit && !matchMos) return false;
      }
      return true;
    });
  }, [soldiers, selectedUnit, searchFilter]);

  // Max count for scaling chart bars
  const maxUnitCount = Math.max(...unitStats.map((u) => u.soldiers.length), 1);

  // Squad list for selected unit or all units
  const squadStats = useMemo(() => {
    const list: { unit: string; squad: string; count: number; soldiers: Soldier[] }[] = [];
    unitStats.forEach((u) => {
      if (selectedUnit !== 'All' && u.unitName !== selectedUnit) return;
      Object.entries(u.squads).forEach(([squadName, sList]) => {
        list.push({
          unit: u.unitName,
          squad: squadName,
          count: sList.length,
          soldiers: sList
        });
      });
    });
    return list.sort((a, b) => b.count - a.count);
  }, [unitStats, selectedUnit]);

  const maxSquadCount = Math.max(...squadStats.map((s) => s.count), 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Tactical Briefing Header */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-military font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              FORCE DISPOSITION
            </span>
            <span className="text-xs text-slate-400 font-mono-military">ORDER OF BATTLE (ORBAT)</span>
          </div>
          <h2 className="text-xl font-bold text-white font-military flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            Unit & Squad Deployment Matrix
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Real-time visual distribution of personnel strength, squad assignments, and operational readiness across all commands.
          </p>
        </div>

        {/* Global Force Deployment Ratio Pill Bar */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          {globalStatusDistribution.map((item) => (
            <div
              key={item.status}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono-military flex items-center gap-2 ${
                STATUS_COLORS[item.status].bg
              } ${STATUS_COLORS[item.status].text} ${STATUS_COLORS[item.status].border}`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.status].bar }} />
              <span>{item.status}:</span>
              <span className="font-bold">{item.count}</span>
              <span className="text-[10px] opacity-75">({item.pct}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* View Selector Controls & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        {/* Chart View Toggle Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => {
              playTacticalClick();
              setChartViewMode('unit');
            }}
            className={`px-3 py-1.5 rounded text-xs font-bold font-military tracking-wide transition flex items-center gap-1.5 ${
              chartViewMode === 'unit'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Unit Distribution Chart
          </button>

          <button
            onClick={() => {
              playTacticalClick();
              setChartViewMode('squad');
            }}
            className={`px-3 py-1.5 rounded text-xs font-bold font-military tracking-wide transition flex items-center gap-1.5 ${
              chartViewMode === 'squad'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Squad Breakdown Chart
          </button>

          <button
            onClick={() => {
              playTacticalClick();
              setChartViewMode('status');
            }}
            className={`px-3 py-1.5 rounded text-xs font-bold font-military tracking-wide transition flex items-center gap-1.5 ${
              chartViewMode === 'status'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            Readiness & Status
          </button>
        </div>

        {/* Unit Selector Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-400 font-mono-military whitespace-nowrap">Filter Unit:</span>
          <select
            value={selectedUnit}
            onChange={(e) => {
              playTacticalClick();
              setSelectedUnit(e.target.value);
            }}
            className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Units ({soldiers.length} Soldiers)</option>
            {unitStats.map((u) => (
              <option key={u.unitName} value={u.unitName}>
                {u.unitName} ({u.soldiers.length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CHART SECTION: UNIT DISTRIBUTION */}
      {chartViewMode === 'unit' && (
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-xl space-y-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs uppercase font-mono-military font-bold text-sky-300 tracking-wider">
                Soldier Distribution by Military Unit
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono-military">
              CLICK UNIT TO INSPECT SQUAD SUBUNITS
            </span>
          </div>

          <div className="space-y-4">
            {unitStats.map((unit) => {
              const percentage = Math.round((unit.soldiers.length / soldiers.length) * 100);
              const barWidth = Math.max(12, Math.round((unit.soldiers.length / maxUnitCount) * 100));
              const isSelected = selectedUnit === unit.unitName;

              return (
                <div
                  key={unit.unitName}
                  onClick={() => {
                    playTacticalClick();
                    setSelectedUnit(selectedUnit === unit.unitName ? 'All' : unit.unitName);
                  }}
                  className={`p-3.5 rounded-lg border transition cursor-pointer group ${
                    isSelected
                      ? 'bg-sky-950/40 border-sky-500/60 shadow-md shadow-sky-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-sky-300 transition flex items-center gap-2 font-military">
                          {unit.unitName}
                          {isSelected && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500 text-slate-950 font-mono-military font-bold">
                              SELECTED
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span>{Object.keys(unit.squads).length} Subunits / Squads</span>
                          <span>•</span>
                          <span>{unit.officerCount} Officers, {unit.ncoCount} NCOs, {unit.enlistedCount} Enlisted</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto font-mono-military text-xs">
                      <div className="text-right">
                        <div className="font-bold text-sky-400">{unit.soldiers.length} Soldiers</div>
                        <div className="text-[10px] text-slate-400">{percentage}% of Total Force</div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isSelected ? 'rotate-90 text-sky-400' : 'group-hover:translate-x-1'}`} />
                    </div>
                  </div>

                  {/* Animated Proportional Bar */}
                  <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 flex">
                    <div
                      className="bg-gradient-to-r from-sky-600 via-sky-500 to-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>

                  {/* Operational readiness tags */}
                  <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[10px] font-mono-military">
                    {Object.entries(unit.statusCounts).map(([status, cnt]) => {
                      if (cnt === 0) return null;
                      return (
                        <span
                          key={status}
                          className={`px-2 py-0.5 rounded border ${STATUS_COLORS[status as Soldier['deploymentStatus']].bg} ${STATUS_COLORS[status as Soldier['deploymentStatus']].text} ${STATUS_COLORS[status as Soldier['deploymentStatus']].border}`}
                        >
                          {status}: {cnt}
                        </span>
                      );
                    })}

                    {unit.promotableCount > 0 && (
                      <span className="px-2 py-0.5 rounded border bg-emerald-500/20 text-emerald-300 border-emerald-500/30 flex items-center gap-1 font-bold">
                        <ChevronUp className="w-3 h-3" />
                        {unit.promotableCount} Ready for Promotion
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CHART SECTION: SQUAD & SUBUNIT BREAKDOWN */}
      {chartViewMode === 'squad' && (
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-xl space-y-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs uppercase font-mono-military font-bold text-sky-300 tracking-wider">
                Squad, Section & Platoon Breakdown {selectedUnit !== 'All' ? `(${selectedUnit})` : ''}
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono-military">
              {squadStats.length} DISTINCT DETACHMENTS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {squadStats.map((sq) => {
              const barWidth = Math.max(15, Math.round((sq.count / maxSquadCount) * 100));

              return (
                <div
                  key={`${sq.unit}-${sq.squad}`}
                  className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-3 hover:border-sky-500/40 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white font-military">{sq.squad}</h4>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-sky-400" />
                        <span>{sq.unit}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono-military font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {sq.count} {sq.count === 1 ? 'Troop' : 'Troops'}
                    </span>
                  </div>

                  {/* Distribution Bar */}
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>

                  {/* Assigned Soldier Avatars in Squad */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
                    {sq.soldiers.map((soldier) => {
                      const rank = ranksMap[soldier.rankId];
                      return (
                        <button
                          key={soldier.id}
                          onClick={() => {
                            playTacticalClick();
                            onSelectSoldier(soldier);
                          }}
                          className="flex items-center gap-1.5 p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 transition group"
                          title={`${rank?.abbreviation || ''} ${soldier.lastName} - Click for Dossier`}
                        >
                          <img
                            src={soldier.avatarUrl}
                            alt={soldier.lastName}
                            className="w-5 h-5 rounded-full object-cover border border-slate-700"
                          />
                          <span className="text-[10px] font-mono-military text-slate-300 group-hover:text-amber-300">
                            {rank?.abbreviation} {soldier.lastName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CHART SECTION: READINESS & STATUS DISTRIBUTION */}
      {chartViewMode === 'status' && (
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-xl space-y-6 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs uppercase font-mono-military font-bold text-emerald-300 tracking-wider">
                Operational Status & Deployment Distribution
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono-military">DEFENSE READINESS CONDITION</span>
          </div>

          {/* Stacked Proportional Bar of Global Force */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex justify-between">
              <span>Force Allocation Proportions</span>
              <span className="font-mono-military text-slate-400">100% Total Roster</span>
            </div>
            <div className="w-full h-6 rounded-lg overflow-hidden flex border border-slate-800 shadow">
              {globalStatusDistribution.map((item) => {
                if (item.count === 0) return null;
                return (
                  <div
                    key={item.status}
                    style={{ width: `${item.pct}%`, backgroundColor: STATUS_COLORS[item.status].bar }}
                    className="h-full flex items-center justify-center text-[10px] font-bold font-mono-military text-white transition-all hover:brightness-110"
                    title={`${item.status}: ${item.count} (${item.pct}%)`}
                  >
                    {item.pct > 8 ? `${item.pct}%` : ''}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Cards for Each Status Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {globalStatusDistribution.map((item) => {
              const statusSoldiers = soldiers.filter((s) => s.deploymentStatus === item.status);

              return (
                <div
                  key={item.status}
                  className={`p-4 rounded-xl border space-y-3 ${STATUS_COLORS[item.status].bg} ${STATUS_COLORS[item.status].border}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold font-military ${STATUS_COLORS[item.status].text}`}>
                      {item.status}
                    </span>
                    <span className={`text-xl font-bold font-mono-military ${STATUS_COLORS[item.status].text}`}>
                      {item.count}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {item.pct}% of active command currently assigned to {item.status.toLowerCase()} theater.
                  </p>

                  {/* List of troops in this status */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    {statusSoldiers.slice(0, 4).map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          playTacticalClick();
                          onSelectSoldier(s);
                        }}
                        className="flex items-center justify-between text-[11px] p-1.5 rounded bg-slate-950/60 hover:bg-slate-900 border border-slate-800 cursor-pointer group"
                      >
                        <span className="text-white group-hover:text-amber-400 font-semibold truncate">
                          {s.firstName} {s.lastName}
                        </span>
                        <span className="text-[10px] font-mono-military text-slate-400 truncate max-w-[120px]">
                          {s.unit.split(',')[0]}
                        </span>
                      </div>
                    ))}
                    {statusSoldiers.length > 4 && (
                      <div className="text-[10px] text-center text-slate-500 font-mono-military pt-1">
                        +{statusSoldiers.length - 4} more personnel
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAILED SOLDIER ROSTER BY UNIT */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-military">
              Stationed Personnel Roster
              {selectedUnit !== 'All' ? ` — ${selectedUnit}` : ' (All Commands)'}
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-military bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {displayedSoldiers.length} Soldiers
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search station troops..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {displayedSoldiers.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
            No soldiers found matching the selected unit or search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayedSoldiers.map((soldier) => {
              const currentRank = ranksMap[soldier.rankId];
              const isEligible = currentRank && soldier.promotionPoints >= currentRank.requiredPoints && currentRank.level < 24;

              return (
                <div
                  key={soldier.id}
                  className="p-3.5 bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl space-y-3 shadow-md flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={soldier.avatarUrl}
                        alt={soldier.lastName}
                        className="w-12 h-12 rounded-lg object-cover border border-amber-500/40"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-slate-900 p-0.5 rounded-full border border-slate-700">
                        <InsigniaIcon type={currentRank?.insigniaType || 'chevron-1'} size="sm" />
                      </span>
                    </div>

                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono-military font-bold bg-amber-500/20 text-amber-300">
                          {currentRank?.abbreviation}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-medium border ${STATUS_COLORS[soldier.deploymentStatus].bg} ${STATUS_COLORS[soldier.deploymentStatus].text} ${STATUS_COLORS[soldier.deploymentStatus].border}`}>
                          {soldier.deploymentStatus}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white truncate">
                        {soldier.firstName} "{soldier.callSign}" {soldier.lastName}
                      </h4>

                      <div className="text-[10px] text-slate-400 truncate">
                        {soldier.unit}
                      </div>
                      <div className="text-[10px] text-sky-300/90 font-mono-military truncate">
                        {soldier.squad}
                      </div>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                    <div className="font-mono-military text-[10px] text-slate-400">
                      <strong className="text-amber-400">{soldier.promotionPoints}</strong> pts
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isEligible && (
                        <button
                          onClick={() => {
                            playTacticalClick();
                            onPromoteSoldier(soldier);
                          }}
                          className="px-2 py-1 rounded text-[10px] font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1 shadow transition"
                        >
                          <ChevronUp className="w-3 h-3" />
                          Promote
                        </button>
                      )}

                      <button
                        onClick={() => {
                          playTacticalClick();
                          onSelectSoldier(soldier);
                        }}
                        className="px-2.5 py-1 rounded text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                      >
                        Dossier
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
