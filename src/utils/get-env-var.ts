export const getEnvVar = (name: string, fallback: string | null = null): string => {
  const value = process.env[name]?.trim();
  if (typeof value !== 'string' || value.length === 0) {
    if (fallback !== null) {
      return fallback;
    }
    throw new Error(`Missing ${name} environment variable`);
  }
  return value;
};
