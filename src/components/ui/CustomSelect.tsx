import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  id?: string;
  label?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  required = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      className={cn('relative w-full text-left', isOpen ? 'z-50' : 'z-10', className)}
      ref={containerRef}
    >
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-[#191c1e] mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Select Trigger Box */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'w-full bg-[#f8f9fb] border rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#191c1e] flex items-center justify-between transition-all cursor-pointer outline-none shadow-2xs',
          isOpen
            ? 'border-[#0052cc] ring-2 ring-[#0052cc]/20 bg-white'
            : 'border-[#c3c6d6]/60 hover:border-[#0052cc]/50 hover:bg-white',
        )}
      >
        <span className={cn('truncate', !selectedOption && 'text-[#505f76]')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-[#505f76] transition-transform duration-200 shrink-0 ml-2',
            isOpen && 'transform rotate-180 text-[#0052cc]',
          )}
        />
      </button>

      {/* Floating Custom Options Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 bg-white border border-[#c3c6d6]/40 rounded-xl shadow-xl py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'w-full px-3.5 py-2 text-xs font-semibold text-[#191c1e] text-left flex items-center justify-between transition-colors cursor-pointer',
                  isSelected
                    ? 'bg-[#e6f0ff] text-[#0052cc] font-bold'
                    : 'text-[#191c1e] hover:bg-[#0052cc]/[0.08] hover:text-[#0052cc]',
                )}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#0052cc] shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
