/**
 * Therapist Profile Enrichment Config
 *
 * The backend /therapists endpoint returns only {id, name, email}.
 * UI-specific profile fields (specialization, bio, avatar, rating, experienceYears)
 * are supplemented here until a full therapist-profile table is added to the backend.
 *
 * Keys are matched against the therapist's name string returned by the backend.
 * Any therapist not in this map will receive DEFAULT_PROFILE values.
 */

import type { TherapistProfile } from '../types/appointments.types';

export const PROFILE_ENRICHMENT: Record<string, Partial<TherapistProfile>> = {
  'Dr. Sarah Connor': {
    specialization: 'Cognitive Behavioral Therapy (CBT)',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDTf1ffvDkCcFUrkgufSLU5b5rl5E0xYYSfZ1ssnFH-TctvnOzXWey_6Qe-Jd0Ck0b-TsXxVTNdCdKqehwfBNnpFxLAC2kV-n-dDwfE-qpzhT52oWqYgoHZ3Il6FYHeKtIj4tO2VotciFst6JlxEgBpJW6y8iAjgR88DEy4PsgRctla5fSXqPlmJ6I0vwJyDBAh9b-QxBdI49Y3kt96Tg_DyJ4j_4QZuJ8M0LDAxnKZmF1BbLT63qCe',
    bio: 'Specialist in anxiety disorders, depression, and stress management with 8+ years clinical experience.',
    experienceYears: 8,
    rating: 4.9,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
  'Dr. Marcus Vance': {
    specialization: 'Mindfulness & Mood Care',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCqZmuUQmcTVzJTMOdgIeA6noCDs1eRLKlJaPfthz5mrVwLWqmpQX2h-Doj7HkphDsRhTwWR388HV8Hrrz9suhMoYYMDkWXLiAgbTYOL0hELQT9g5a_EJfzin8N9hNg8CVb1HR30zxjKcwjQAh0h9ts8RZRI0TqzbeAW8kIeGapeVzZt8r9M2NCNPrC_Z0bYcHB7K4DxyFUO9DCA4_lQIjEWxDwQFQHMd00m7bm8aa1f3eNhpVD9AMA',
    bio: 'Focused on mindfulness-based stress reduction (MBSR) and personal wellness coaching.',
    experienceYears: 6,
    rating: 4.8,
    availableDays: ['Mon', 'Wed', 'Fri'],
  },
  'Dr. Elena Rostova': {
    specialization: 'Trauma & Resilience Therapy',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDllZUXRO5e7rF6Up-dc4pvNDJ0qWv7OphWn2vlLZcPEn3gJis9Q7DOo0DilkDLApu90FgIYAkRaz6PoaBtXIdwAKFLCg9BuwN4-IrK4xmi4NwRId8AiVCXUdfMbvWkwvXO3_591mt9jq8yU818JRbO8uNorJahJ37S2IGe_wRKmqy4ECkBTkkg0fARTOXTKWrQ8RtKeK8_tdah2K5_EyvC1HYbsRa1hRoGa6vQBOitJ0QrtVfJxECd',
    bio: 'Expert in trauma-informed care, relationship counseling, and resilience building.',
    experienceYears: 10,
    rating: 5.0,
    availableDays: ['Tue', 'Thu', 'Sat'],
  },
};

export const DEFAULT_PROFILE: Omit<TherapistProfile, 'id' | 'name'> = {
  specialization: 'General Counseling',
  bio: 'Licensed clinical therapist providing evidence-based care.',
  experienceYears: 5,
  rating: 4.5,
  availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
};
