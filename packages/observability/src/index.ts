export function createLogger(name: string) {
  return {
    info: (message: string, data?: Record<string, unknown>) => console.info(`[${name}] ${message}`, data ?? {}),
    warn: (message: string, data?: Record<string, unknown>) => console.warn(`[${name}] ${message}`, data ?? {}),
    error: (message: string, data?: Record<string, unknown>) => console.error(`[${name}] ${message}`, data ?? {}),
  };
}
