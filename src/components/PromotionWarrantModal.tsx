import React from 'react';
import { Soldier, MilitaryRank } from '../types/military';
import { InsigniaIcon } from './InsigniaIcon';
import { Printer, X, Shield, Award } from 'lucide-react';
import { playTacticalClick } from '../utils/soundEffects';

interface PromotionWarrantModalProps {
  soldier: Soldier;
  rank: MilitaryRank;
  isOpen: boolean;
  onClose: () => void;
  orderNumber?: string;
  authorizingOfficer?: string;
  citation?: string;
}

export const PromotionWarrantModal: React.FC<PromotionWarrantModalProps> = ({
  soldier,
  rank,
  isOpen,
  onClose,
  orderNumber = 'HQDA-WARRANT-2026-0814',
  authorizingOfficer = 'General Marcus Vance, Commanding Officer',
  citation = 'For exceptional fidelity, valor, and demonstrated capacity for military command.'
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    playTacticalClick();
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-amber-600/50 rounded-xl shadow-2xl overflow-hidden print:p-0 print:border-none print:bg-white print:text-black">
        {/* Top Control Bar - Hidden on print */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-950 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono-military text-amber-400">
            <Award className="w-4 h-4" />
            <span>OFFICIAL MILITARY PROMOTION WARRANT</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded border border-slate-600 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Warrant
            </button>
            <button
              onClick={() => {
                playTacticalClick();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Formal Certificate Body */}
        <div className="p-8 sm:p-12 bg-gradient-to-b from-[#fbf8f1] to-[#f4ede0] text-slate-900 border-8 border-double border-[#855e2d] relative shadow-inner">
          {/* Subtle Watermark Badge */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <Shield className="w-96 h-96 text-[#855e2d]" />
          </div>

          <div className="relative z-10 text-center space-y-4">
            {/* Header Eagle / Star Seal */}
            <div className="flex justify-center items-center gap-3">
              <div className="w-12 h-1 bg-[#855e2d]" />
              <div className="p-2 border-2 border-[#855e2d] rounded-full">
                <Shield className="w-8 h-8 text-[#855e2d]" />
              </div>
              <div className="w-12 h-1 bg-[#855e2d]" />
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase tracking-[0.3em] font-serif font-bold text-[#634825]">
                Headquarters Department of Defense
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black uppercase tracking-wider text-[#2d1f10]">
                Promotion Warrant & Certificate
              </h1>
              <div className="text-xs italic text-[#785b34] font-serif">
                Order Reference: {orderNumber} • Effective Date: {currentDate}
              </div>
            </div>

            <div className="my-6 border-t border-b border-[#c2a77a] py-3 text-sm italic font-serif leading-relaxed text-[#3e2c18] max-w-xl mx-auto">
              Know ye, that reposing special trust and confidence in the patriotism, valor, fidelity, and professional abilities of:
            </div>

            {/* Soldier Full Identification */}
            <div className="py-2 space-y-1">
              <div className="text-2xl sm:text-4xl font-serif font-black text-[#1e1308] tracking-wide uppercase">
                {soldier.firstName} {soldier.lastName}
              </div>
              <div className="text-xs font-mono font-bold tracking-widest text-[#664b28]">
                SERVICE NO: {soldier.serviceNumber} • MOS: {soldier.specialtyMOS}
              </div>
              <div className="text-xs text-[#523d24] font-serif">
                UNIT: {soldier.unit} ({soldier.squad})
              </div>
            </div>

            {/* Rank Insignia & Promotion Statement */}
            <div className="my-4 flex flex-col items-center justify-center">
              <div className="p-3 bg-amber-100/60 rounded-full border-2 border-[#855e2d]/40 mb-2">
                <InsigniaIcon type={rank.insigniaType} size="xl" />
              </div>
              <p className="text-sm font-serif text-[#3e2c18]">
                I do hereby appoint and promote this soldier to the rank of:
              </p>
              <div className="text-2xl sm:text-3xl font-serif font-black text-[#854d0e] tracking-wider uppercase mt-1">
                {rank.title}
              </div>
              <div className="text-xs font-mono font-bold text-[#5c3e17] mt-0.5">
                PAY GRADE {rank.grade} • NATO {rank.natoCode}
              </div>
            </div>

            {/* Citation Statement */}
            <div className="p-3 bg-[#ede2ce]/60 rounded border border-[#c5ad83] text-xs font-serif italic text-[#3c2a17] max-w-lg mx-auto">
              "{citation}"
            </div>

            <p className="text-[11px] font-serif text-[#4a3620] max-w-md mx-auto leading-normal">
              He or she is therefore carefully and diligently to discharge the duties of the office to which appointed by doing and performing all manner of things thereunto belonging.
            </p>

            {/* Signatures */}
            <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs font-serif text-[#2e1d0d]">
              <div className="border-t border-[#7a572a] pt-2">
                <div className="font-bold">{authorizingOfficer}</div>
                <div className="text-[10px] text-[#715024] uppercase">Appointing Authority</div>
              </div>
              <div className="border-t border-[#7a572a] pt-2">
                <div className="font-bold">Official Seal of Command</div>
                <div className="text-[10px] text-[#715024] uppercase">Recorded in Military Registry</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
