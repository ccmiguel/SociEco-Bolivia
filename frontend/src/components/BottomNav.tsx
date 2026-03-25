import React from 'react';
import Link from 'next/link';
import { Home, Map, ScanLine, PlayCircle, BookOpen } from 'lucide-react';

export const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 bg-white rounded-t-[32px] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-6 py-2 flex justify-between items-center z-50">
      <NavItem href="/" icon={<Home size={24} />} label="Inicio" />
      <NavItem href="/market" icon={<Map size={24} />} label="Mercado" />
      
      {/* FAB Central Prominente for Scanner */}
      <div className="relative -top-7">
        <Link href="/scanner">
          <button className="bg-socieco-primary p-4 rounded-full shadow-lg border-[6px] border-socieco-bg text-socieco-dark hover:scale-105 active:scale-95 transition-transform flex items-center justify-center">
            <ScanLine size={32} />
          </button>
        </Link>
      </div>
      
      <NavItem href="/lakaplay" icon={<PlayCircle size={24} />} label="LakaPlay" />
      <NavItem href="/#" icon={<BookOpen size={24} />} label="Misiones" />
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, href }) => (
  <Link href={href} className="flex flex-col items-center p-2 transition-colors text-gray-400 hover:text-socieco-dark focus:text-socieco-dark focus:font-bold">
    <div className="mb-1">{icon}</div>
    <span className="text-[11px] tracking-wide">{label}</span>
  </Link>
);
