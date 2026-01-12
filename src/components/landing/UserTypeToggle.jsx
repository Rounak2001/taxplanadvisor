import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, User, Briefcase } from 'lucide-react';

export function UserTypeToggle({ value, onChange }) {
  const options = [
    { id: 'professional', label: 'Tax Professional', icon: Building2 },
    { id: 'taxpayer', label: 'File My Taxes', icon: User },
  ];

  return (
    <div className="inline-flex p-1.5 rounded-2xl bg-muted/80 border border-border/50">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = value === option.id;
        
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-colors ${
              isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeToggle"
                className="absolute inset-0 bg-primary rounded-xl"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10 hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
