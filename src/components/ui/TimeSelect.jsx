import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Generate 30-minute intervals for the entire day
const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const h = hour.toString().padStart(2, '0');
            const m = minute.toString().padStart(2, '0');
            const time24 = `${h}:${m}`;

            // Convert to 12-hour format for display
            let displayHour = hour % 12;
            if (displayHour === 0) displayHour = 12;
            const period = hour < 12 ? 'am' : 'pm';
            const displayTime = `${displayHour}:${m}${period}`;

            slots.push({ value: time24, label: displayTime });
        }
    }
    return slots;
};

const TIME_SLOTS = generateTimeSlots();

export default function TimeSelect({ value, onChange, className }) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedSlot = TIME_SLOTS.find(slot => slot.value === value);
    const displayValue = selectedSlot?.label || value;

    const handleSelect = (timeValue) => {
        onChange(timeValue);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-between w-full px-3 h-9 rounded-lg",
                    "bg-white/5 border border-white/10 text-xs",
                    "hover:border-white/20 transition-colors",
                    "focus:outline-none focus:border-primary",
                    className
                )}
            >
                <span>{displayValue}</span>
                <ChevronDown size={14} className="text-muted-foreground" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className={cn(
                        "absolute z-50 mt-1 w-full max-h-60 overflow-y-auto",
                        "bg-background border border-white/10 rounded-lg shadow-lg",
                        "scrollbar-thin scrollbar-thumb-white/10"
                    )}>
                        {TIME_SLOTS.map((slot) => (
                            <button
                                key={slot.value}
                                type="button"
                                onClick={() => handleSelect(slot.value)}
                                className={cn(
                                    "w-full px-3 py-2 text-left text-xs hover:bg-white/5 transition-colors",
                                    slot.value === value && "bg-primary/10 text-primary font-medium"
                                )}
                            >
                                {slot.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
