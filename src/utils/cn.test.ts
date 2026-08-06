import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    const result = cn('px-2 py-1', 'bg-red-500');
    expect(result).toBe('px-2 py-1 bg-red-500');
  });

  it('resolves tailwind class conflicts correctly', () => {
    const result = cn('px-2 px-4', 'bg-red-500 bg-blue-500');
    expect(result).toBe('px-4 bg-blue-500');
  });

  it('handles conditional class names cleanly', () => {
    const isTrue = true;
    const isFalse = false;
    const result = cn('base', isTrue && 'active', isFalse && 'hidden');
    expect(result).toBe('base active');
  });
});
