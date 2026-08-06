import { z } from 'zod';

/**
 * Environment Variables Schema Validation
 * Validates process / import.meta environment variables at runtime to fail fast on invalid configuration.
 */
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('https://api.wysacare.example.com/v1'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
});

const _env = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
});

if (!_env.success) {
  console.error('❌ Invalid environment variables configuration:', _env.error.format());
  throw new Error('Invalid environment variables configuration');
}

export const env = _env.data;
