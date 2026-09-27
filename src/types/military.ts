export type MilitaryBranch = 'Army' | 'Marines' | 'Navy' | 'Air Force' | 'Space Force';

export type RankCategory = 'Enlisted' | 'NCO' | 'Warrant' | 'Company Officer' | 'Field Officer' | 'General Officer';

export interface MilitaryRank {
  id: string;
  grade: string; // e.g., 'E-1', 'E-5', 'W-2', 'O-3', 'O-7'
  natoCode: string; // e.g. 'OR-1', 'OR-5', 'OF-3'
  title: string; // e.g., 'Sergeant'
  abbreviation: string; // e.g., 'SGT'
  category: RankCategory;
  branch: MilitaryBranch;
  level: number; // 1 to 24 progression index
  requiredPoints: number;
  minTimeInGradeMonths: number;
  insigniaType: string;
  responsibilities: string;
  typicalCommand: string;
  description: string;
}

export interface MedalAward {
  id: string;
  name: string;
  ribbonColor: string[];
  description: string;
  points: number;
  dateAwarded: string;
  citation: string;
}

export interface PromotionRecord {
  id: string;
  fromRankId: string;
  fromRankTitle: string;
  toRankId: string;
  toRankTitle: string;
  date: string;
  orderNumber: string;
  authorizingOfficer: string;
  citation: string;
  isFieldPromotion?: boolean;
}

export interface UnitTransferRecord {
  id: string;
  fromUnit: string;
  fromSquad?: string;
  toUnit: string;
  toSquad?: string;
  date: string;
  orderNumber: string;
  authorizingOfficer: string;
  reason?: string;
}

export interface Soldier {
  id: string;
  firstName: string;
  lastName: string;
  callSign: string;
  serviceNumber: string;
  branch: MilitaryBranch;
  rankId: string;
  specialtyMOS: string; // e.g. "11B - Infantryman"
  unit: string; // e.g. "1st Infantry Div, 2nd BCT"
  squad: string; // e.g. "Bravo Squad"
  deploymentStatus: 'Active Duty' | 'Deployed' | 'Garrison' | 'Special Operations' | 'Reserve';
  avatarUrl: string;
  gender: 'M' | 'F';
  promotionPoints: number;
  timeInGradeMonths: number;
  timeInServiceMonths: number;
  fitnessScore: number; // 0 - 600 ACFT
  marksmanship: 'Marksman' | 'Sharpshooter' | 'Expert';
  awards: MedalAward[];
  promotionHistory: PromotionRecord[];
  unitHistory?: UnitTransferRecord[];
  conductRecord: 'Exemplary' | 'Good Conduct' | 'Under Review';
  biography: string;
  bloodType: string;
}

export interface AvailableMedal {
  id: string;
  name: string;
  colors: string[];
  points: number;
  category: 'Valor' | 'Merit' | 'Campaign' | 'Skill';
  description: string;
}
