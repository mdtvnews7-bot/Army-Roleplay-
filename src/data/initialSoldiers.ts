import { Soldier } from '../types/military';

export const INITIAL_SOLDIERS: Soldier[] = [
  {
    id: 'sld-101',
    firstName: 'Marcus',
    lastName: 'Vance',
    callSign: 'Ironclad',
    serviceNumber: 'RA-784-9921',
    branch: 'Army',
    rankId: 'e4-spc',
    specialtyMOS: '11B - Infantryman',
    unit: '1st Infantry Division "Big Red One"',
    squad: 'Alpha Squad, 2nd Platoon',
    deploymentStatus: 'Active Duty',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    gender: 'M',
    promotionPoints: 495, // Eligible for E-5 SGT (requires 480)!
    timeInGradeMonths: 26,
    timeInServiceMonths: 38,
    fitnessScore: 575,
    marksmanship: 'Expert',
    conductRecord: 'Exemplary',
    bloodType: 'O+',
    biography: 'Distinguished squad rifleman and designated marksman. Led defensive suppression during Operation Granite Shield. Ready for non-commissioned officer team leadership.',
    awards: [
      {
        id: 'awd-1',
        name: 'Army Commendation Medal',
        ribbonColor: ['#15803d', '#ffffff', '#15803d'],
        description: 'Heroism during tactical evacuation under mortar fire.',
        points: 60,
        dateAwarded: '2025-11-14',
        citation: 'For meritorious tactical conduct and directing squad security during ambush retreat.'
      },
      {
        id: 'awd-2',
        name: 'Combat Action Badge',
        ribbonColor: ['#334155', '#94a3b8', '#334155'],
        description: 'Direct engagement during combat patrol.',
        points: 75,
        dateAwarded: '2025-08-22',
        citation: 'Engaged hostile combatants with precision carbine fire, neutralizing threat vectors.'
      }
    ],
    promotionHistory: [
      {
        id: 'prom-1',
        fromRankId: 'e1-pv1',
        fromRankTitle: 'Private',
        toRankId: 'e2-pv2',
        toRankTitle: 'Private Second Class',
        date: '2023-04-10',
        orderNumber: 'AG-2023-0881',
        authorizingOfficer: 'Capt. D. Miller',
        citation: 'Completion of Basic Combat Training with academic honors.'
      },
      {
        id: 'prom-2',
        fromRankId: 'e2-pv2',
        fromRankTitle: 'Private Second Class',
        toRankId: 'e3-pfc',
        toRankTitle: 'Private First Class',
        date: '2023-11-15',
        orderNumber: 'AG-2023-1492',
        authorizingOfficer: 'Capt. D. Miller',
        citation: 'Time in grade standard and qualification on squad automatic weapons.'
      },
      {
        id: 'prom-3',
        fromRankId: 'e3-pfc',
        fromRankTitle: 'Private First Class',
        toRankId: 'e4-spc',
        toRankTitle: 'Specialist',
        date: '2024-07-20',
        orderNumber: 'AG-2024-2104',
        authorizingOfficer: 'Maj. R. Hawkins',
        citation: 'Exceptional technical precision and battlefield radio maintenance.'
      }
    ],
    unitHistory: [
      {
        id: 'ut-101-1',
        fromUnit: '101st Airborne Division (Air Assault)',
        fromSquad: 'Charlie Team, 3rd BCT',
        toUnit: '1st Infantry Division "Big Red One"',
        toSquad: 'Alpha Squad, 2nd Platoon',
        date: '2024-06-12',
        orderNumber: 'PCS-2024-771',
        authorizingOfficer: 'Lt. Col. T. Jenkins',
        reason: 'Permanent Change of Station (PCS) for rotational frontline readiness deployment.'
      },
      {
        id: 'ut-101-2',
        fromUnit: 'US Army Infantry Training Brigade, Fort Moore',
        fromSquad: 'Echo Company, 1-19th Infantry',
        toUnit: '101st Airborne Division (Air Assault)',
        toSquad: 'Charlie Team, 3rd BCT',
        date: '2023-05-01',
        orderNumber: 'ASG-2023-102',
        authorizingOfficer: 'Col. K. Ramsey',
        reason: 'Initial active duty operational stationing upon completion of Infantry OSUT.'
      }
    ]
  },
  {
    id: 'sld-102',
    firstName: 'Sarah',
    lastName: 'Chen',
    callSign: 'Valkyrie',
    serviceNumber: 'RA-839-4412',
    branch: 'Army',
    rankId: 'e5-sgt',
    specialtyMOS: '68W - Combat Medic Specialist',
    unit: '82nd Airborne Division, 504th PIR',
    squad: 'Charlie Med-Evac Section',
    deploymentStatus: 'Deployed',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
    gender: 'F',
    promotionPoints: 620, // Eligible for E-6 SSG (requires 600)!
    timeInGradeMonths: 32,
    timeInServiceMonths: 54,
    fitnessScore: 590,
    marksmanship: 'Expert',
    conductRecord: 'Exemplary',
    bloodType: 'A+',
    biography: 'Airborne qualified frontline trauma specialist. Stabilized 14 wounded personnel across three high-intensity counter-offensive operations.',
    awards: [
      {
        id: 'awd-3',
        name: 'Bronze Star with "V" Device',
        ribbonColor: ['#ef4444', '#1e3a8a', '#ffffff', '#1e3a8a', '#ef4444'],
        description: 'Direct medical triage under active hostile sniper fire.',
        points: 150,
        dateAwarded: '2025-06-03',
        citation: 'Braving hostile sniper fire to render life-saving arterial tourniquet application to fallen team lead.'
      },
      {
        id: 'awd-4',
        name: 'Parachutist Jump Wings',
        ribbonColor: ['#1e293b', '#e2e8f0', '#1e293b'],
        description: 'Night tactical drop certification.',
        points: 50,
        dateAwarded: '2024-03-12',
        citation: 'Completed airborne tactical egress during night mass drop.'
      }
    ],
    promotionHistory: [
      {
        id: 'prom-10',
        fromRankId: 'e4-spc',
        fromRankTitle: 'Specialist',
        toRankId: 'e5-sgt',
        toRankTitle: 'Sergeant',
        date: '2024-01-18',
        orderNumber: 'HQ-82AB-2024-012',
        authorizingOfficer: 'Lt. Col. E. Sterling',
        citation: 'Demonstrated tactical leadership in triage logistics and squad welfare.'
      }
    ],
    unitHistory: [
      {
        id: 'ut-102-1',
        fromUnit: 'Brooke Army Medical Center, Fort Sam Houston',
        fromSquad: 'Trauma Readiness Detachment',
        toUnit: '82nd Airborne Division, 504th PIR',
        toSquad: 'Charlie Med-Evac Section',
        date: '2023-02-14',
        orderNumber: 'MED-TO-2023-88',
        authorizingOfficer: 'Col. R. Bradley',
        reason: 'Selected for Airborne Medical Evacuation detachment after completing jump qualification.'
      }
    ]
  },
  {
    id: 'sld-103',
    firstName: 'Jackson',
    lastName: 'Cross',
    callSign: 'Ghost',
    serviceNumber: 'RA-912-3004',
    branch: 'Army',
    rankId: 'e6-ssg',
    specialtyMOS: '18B - Special Forces Weapons Sergeant',
    unit: '1st Special Forces Command (Green Berets)',
    squad: 'ODA 1214 "Reapers"',
    deploymentStatus: 'Special Operations',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    gender: 'M',
    promotionPoints: 790, // Eligible for E-7 SFC (requires 750)
    timeInGradeMonths: 38,
    timeInServiceMonths: 88,
    fitnessScore: 600,
    marksmanship: 'Expert',
    conductRecord: 'Exemplary',
    bloodType: 'B-',
    biography: 'Expert weapon tactician in unconventional warfare and direct assault. Fluent in three languages. Ranger and Airborne tabbed.',
    awards: [
      {
        id: 'awd-5',
        name: 'Silver Star',
        ribbonColor: ['#3b82f6', '#f8fafc', '#ef4444', '#f8fafc', '#3b82f6'],
        description: 'Gallantry in hostage extraction behind enemy fortified perimeter.',
        points: 220,
        dateAwarded: '2025-02-18',
        citation: 'Exemplified raw courage, clearing 3 hostile bunkers single-handedly to save surrounded patrol.'
      },
      {
        id: 'awd-6',
        name: 'Ranger Tab',
        ribbonColor: ['#0f172a', '#eab308', '#0f172a'],
        description: 'Ranger School Distinguished Honor Graduate.',
        points: 100,
        dateAwarded: '2022-09-01',
        citation: 'Mastery of dismounted combat operations, mountain navigation, and swamp warfare.'
      }
    ],
    promotionHistory: [
      {
        id: 'prom-15',
        fromRankId: 'e5-sgt',
        fromRankTitle: 'Sergeant',
        toRankId: 'e6-ssg',
        toRankTitle: 'Staff Sergeant',
        date: '2023-08-14',
        orderNumber: 'SOCOM-2023-909',
        authorizingOfficer: 'Col. K. Prescott',
        citation: 'Elevated for tactical poise and command of frontline reconnaissance team.'
      }
    ],
    unitHistory: [
      {
        id: 'ut-103-1',
        fromUnit: '75th Ranger Regiment, 3rd Battalion',
        fromSquad: 'Alpha Company Assault Element',
        toUnit: '1st Special Forces Command (Green Berets)',
        toSquad: 'ODA 1214 "Reapers"',
        date: '2023-06-01',
        orderNumber: 'USASOC-2023-419',
        authorizingOfficer: 'Maj. Gen. C. Higgins',
        reason: 'Graduation from Special Forces Qualification Course (Q Course) and assignment to Operational Detachment Alpha.'
      },
      {
        id: 'ut-103-2',
        fromUnit: '82nd Airborne Division, 505th PIR',
        fromSquad: '1st Platoon Scout Section',
        toUnit: '75th Ranger Regiment, 3rd Battalion',
        toSquad: 'Alpha Company Assault Element',
        date: '2021-10-15',
        orderNumber: 'RGR-RASP-2021-04',
        authorizingOfficer: 'Col. J. Strickland',
        reason: 'Selected via Ranger Assessment and Selection Program (RASP 1).'
      }
    ]
  },
  {
    id: 'sld-104',
    firstName: 'Elena',
    lastName: 'Rostova',
    callSign: 'Cipher',
    serviceNumber: 'RA-650-1849',
    branch: 'Army',
    rankId: 'o2-1lt',
    specialtyMOS: '35F - Intelligence Officer',
    unit: '10th Mountain Division, G-2 Section',
    squad: 'Tactical Recon Analysis Cell',
    deploymentStatus: 'Active Duty',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face',
    gender: 'F',
    promotionPoints: 1060, // Eligible for O-3 CPT (requires 1050)!
    timeInGradeMonths: 36,
    timeInServiceMonths: 62,
    fitnessScore: 560,
    marksmanship: 'Sharpshooter',
    conductRecord: 'Exemplary',
    bloodType: 'AB+',
    biography: 'Orchestrated SIGINT and tactical drone intercepts predicting enemy artillery positions. Recommended for company command.',
    awards: [
      {
        id: 'awd-7',
        name: 'Meritorious Service Medal',
        ribbonColor: ['#b91c1c', '#ffffff', '#b91c1c'],
        description: 'Groundbreaking tactical electronic warfare synthesis.',
        points: 90,
        dateAwarded: '2025-10-09',
        citation: 'Identified enemy command post emitter arrays allowing surgical strike package delivery.'
      }
    ],
    promotionHistory: [
      {
        id: 'prom-20',
        fromRankId: 'o1-2lt',
        fromRankTitle: 'Second Lieutenant',
        toRankId: 'o2-1lt',
        toRankTitle: 'First Lieutenant',
        date: '2023-10-01',
        orderNumber: 'DA-O-2023-441',
        authorizingOfficer: 'Brig. Gen. T. Ward',
        citation: 'Regular promotion upon completion of 18 months probationary commissioning.'
      }
    ],
    unitHistory: [
      {
        id: 'ut-104-1',
        fromUnit: 'US Army Intelligence Center of Excellence, Fort Huachuca',
        fromSquad: '304th Military Intelligence Battalion',
        toUnit: '10th Mountain Division, G-2 Section',
        toSquad: 'Tactical Recon Analysis Cell',
        date: '2023-04-18',
        orderNumber: 'INTEL-PCS-2023-92',
        authorizingOfficer: 'Col. M. Davenport',
        reason: 'Operational assignment as Division G-2 intelligence analysis lead.'
      }
    ]
  },
  {
    id: 'sld-105',
    firstName: 'Devon',
    lastName: 'Kowalski',
    callSign: 'Apex',
    serviceNumber: 'RA-442-8811',
    branch: 'Army',
    rankId: 'o4-maj',
    specialtyMOS: '19A - Armor Operations Officer',
    unit: '3rd Armored Brigade Combat Team, 4th ID',
    squad: 'Battalion Tactical Operations Center',
    deploymentStatus: 'Active Duty',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face',
    gender: 'M',
    promotionPoints: 1420,
    timeInGradeMonths: 38,
    timeInServiceMonths: 144,
    fitnessScore: 545,
    marksmanship: 'Expert',
    conductRecord: 'Exemplary',
    bloodType: 'O-',
    biography: 'Battalion Executive Officer. Coordinated 54 M1A2 Abrams main battle tanks and mechanized infantry across multi-brigade maneuvers.',
    awards: [
      {
        id: 'awd-8',
        name: 'Meritorious Service Medal',
        ribbonColor: ['#b91c1c', '#ffffff', '#b91c1c'],
        description: 'Excellence in armor logistics and strategic depot mobilization.',
        points: 90,
        dateAwarded: '2024-11-20',
        citation: 'Flawlessly positioned division heavy assets with zero operational downtime.'
      }
    ],
    promotionHistory: [
      {
        id: 'prom-25',
        fromRankId: 'o3-cpt',
        fromRankTitle: 'Captain',
        toRankId: 'o4-maj',
        toRankTitle: 'Major',
        date: '2023-06-12',
        orderNumber: 'HQDA-B-2023-991',
        authorizingOfficer: 'Maj. Gen. G. Thorne',
        citation: 'Board approved for field grade officer appointment.'
      }
    ],
    unitHistory: [
      {
        id: 'ut-105-1',
        fromUnit: '1st Cavalry Division "First Team"',
        fromSquad: '2nd Armored Brigade Combat Team',
        toUnit: '3rd Armored Brigade Combat Team, 4th ID',
        toSquad: 'Battalion Tactical Operations Center',
        date: '2022-08-01',
        orderNumber: 'ARM-HQ-2022-311',
        authorizingOfficer: 'Maj. Gen. P. Vance',
        reason: 'Assigned as Battalion Executive Officer for heavy armor modernization initiative.'
      }
    ]
  },
  {
    id: 'sld-106',
    firstName: 'Tariq',
    lastName: 'Hassan',
    callSign: 'Falcon',
    serviceNumber: 'RA-511-9233',
    branch: 'Army',
    rankId: 'w1-wo1',
    specialtyMOS: '153A - Rotary Wing Aviator',
    unit: '160th Special Operations Aviation Regiment (Night Stalkers)',
    squad: 'Flight Section 3 "Dusk Riders"',
    deploymentStatus: 'Deployed',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face',
    gender: 'M',
    promotionPoints: 1180, // Eligible for CW3!
    timeInGradeMonths: 38,
    timeInServiceMonths: 96,
    fitnessScore: 570,
    marksmanship: 'Expert',
    conductRecord: 'Exemplary',
    bloodType: 'A-',
    biography: 'Piloted MH-60 Black Hawk under extreme zero-illumination low altitude conditions during tactical special operations insertion.',
    awards: [
      {
        id: 'awd-9',
        name: 'Distinguished Service Cross',
        ribbonColor: ['#1d4ed8', '#ef4444', '#ffffff', '#ef4444', '#1d4ed8'],
        description: 'Extraordinary airmanship extracting downed crew in heavy hostile fire.',
        points: 300,
        dateAwarded: '2025-05-19',
        citation: 'Executed brownout hover maneuver while under RPG fire to extract 8 soldiers.'
      }
    ],
    promotionHistory: [
      {
        id: 'prom-30',
        fromRankId: 'e6-ssg',
        fromRankTitle: 'Staff Sergeant',
        toRankId: 'w1-wo1',
        toRankTitle: 'Warrant Officer 1',
        date: '2023-05-01',
        orderNumber: 'WO-COMM-2023-11',
        authorizingOfficer: 'Secretary of the Army',
        citation: 'Graduation from Warrant Officer Flight Candidate School with aeronautical honors.'
      }
    ],
    unitHistory: [
      {
        id: 'ut-106-1',
        fromUnit: '1st Aviation Brigade, Fort Novosel',
        fromSquad: 'Advanced Flight Training Element',
        toUnit: '160th Special Operations Aviation Regiment (Night Stalkers)',
        toSquad: 'Flight Section 3 "Dusk Riders"',
        date: '2023-07-20',
        orderNumber: 'AV-SOAR-2023-108',
        authorizingOfficer: 'Col. W. Sterling',
        reason: 'Completed Green Platoon special operations flight assessment; attached to 160th SOAR.'
      }
    ]
  },
  {
    id: 'sld-107',
    firstName: 'Jordan',
    lastName: 'Bishop',
    callSign: 'Rook',
    serviceNumber: 'RA-109-7734',
    branch: 'Army',
    rankId: 'e1-pv1',
    specialtyMOS: '12B - Combat Engineer',
    unit: '1st Armored Division, 40th BEB',
    squad: 'Sapper Fireteam 1',
    deploymentStatus: 'Garrison',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&crop=face',
    gender: 'M',
    promotionPoints: 140, // Eligible for E-2 PV2 (requires 100)!
    timeInGradeMonths: 7,
    timeInServiceMonths: 7,
    fitnessScore: 530,
    marksmanship: 'Sharpshooter',
    conductRecord: 'Good Conduct',
    bloodType: 'B+',
    biography: 'Promising combat engineer recruit, mastering mine clearance, bridge construction, and obstacle breaching.',
    awards: [],
    promotionHistory: [],
    unitHistory: [
      {
        id: 'ut-107-1',
        fromUnit: 'US Army Engineer School, Fort Leonard Wood',
        fromSquad: 'Alpha Company, 1st Engineer Training Battalion',
        toUnit: '1st Armored Division, 40th BEB',
        toSquad: 'Sapper Fireteam 1',
        date: '2026-02-14',
        orderNumber: 'ASG-EN-2026-042',
        authorizingOfficer: 'Lt. Col. N. Brooks',
        reason: 'First duty station assignment upon graduating Combat Sapper AIT.'
      }
    ]
  },
  {
    id: 'sld-108',
    firstName: 'Claire',
    lastName: 'Montgomery',
    callSign: 'Sentinel',
    serviceNumber: 'RA-302-6190',
    branch: 'Army',
    rankId: 'o6-col',
    specialtyMOS: '02A - Combat Arms Executive',
    unit: '75th Ranger Regiment Headquarters',
    squad: 'Command Element',
    deploymentStatus: 'Active Duty',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
    gender: 'F',
    promotionPoints: 2600, // Eligible for O-7 BG (requires 2500)!
    timeInGradeMonths: 74,
    timeInServiceMonths: 240,
    fitnessScore: 590,
    marksmanship: 'Expert',
    conductRecord: 'Exemplary',
    bloodType: 'O+',
    biography: 'Decorated regimental commander with 20 years of combat leadership. Nominated by Department of Defense for Brigadier General flag rank.',
    awards: [
      {
        id: 'awd-10',
        name: 'Medal of Honor',
        ribbonColor: ['#1e40af', '#ffffff', '#1e40af'],
        description: 'Supreme valor defending allied forward base against overwhelming adversary assault.',
        points: 400,
        dateAwarded: '2023-11-10',
        citation: 'For conspicuous gallantry and intrepidity at the risk of her life above and beyond the call of duty.'
      },
      {
        id: 'awd-11',
        name: 'Purple Heart',
        ribbonColor: ['#7e22ce', '#ffffff', '#7e22ce'],
        description: 'Wounded in action during defense of Outpost Echo.',
        points: 120,
        dateAwarded: '2023-10-14',
        citation: 'Received shrapnel wounds while directing perimeter fire.'
      }
    ],
    promotionHistory: [
      {
        id: 'prom-40',
        fromRankId: 'o5-ltc',
        fromRankTitle: 'Lieutenant Colonel',
        toRankId: 'o6-col',
        toRankTitle: 'Colonel',
        date: '2020-04-15',
        orderNumber: 'HQDA-COL-2020-08',
        authorizingOfficer: 'Gen. M. Milley',
        citation: 'Commissioned full Colonel and assigned to Regimental Command.'
      }
    ],
    unitHistory: [
      {
        id: 'ut-108-1',
        fromUnit: '82nd Airborne Division Headquarters',
        fromSquad: 'Operations Directorate G-3',
        toUnit: '75th Ranger Regiment Headquarters',
        toSquad: 'Command Element',
        date: '2020-05-01',
        orderNumber: 'DOD-FLAG-2020-99',
        authorizingOfficer: 'Gen. M. Milley',
        reason: 'Assigned as Regimental Commander, 75th Ranger Regiment.'
      },
      {
        id: 'ut-108-2',
        fromUnit: '10th Mountain Division, 1st BCT',
        fromSquad: 'Battalion Command Element',
        toUnit: '82nd Airborne Division Headquarters',
        toSquad: 'Operations Directorate G-3',
        date: '2017-09-12',
        orderNumber: 'DA-CMD-2017-410',
        authorizingOfficer: 'Lt. Gen. H. Masterson',
        reason: 'Elevation to Division Operations Directorate.'
      }
    ]
  }
];
