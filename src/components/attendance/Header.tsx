import { GraduationCap, User } from 'lucide-react';

export const Header = () => {
  return (
    <header className="header-gradient text-primary-foreground py-6 px-8 shadow-elevated print-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
            <GraduationCap className="w-8 h-8 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              PRINCETON
            </h1>
            <p className="text-primary-foreground/80 text-sm md:text-base font-medium">
              Course Attendance System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-primary-foreground/10 px-4 py-2 rounded-xl backdrop-blur-sm">
          <User className="w-5 h-5" />
          <div className="text-right">
            <p className="text-sm font-semibold">Aziz Ahmad</p>
            <p className="text-xs text-primary-foreground/70">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};
