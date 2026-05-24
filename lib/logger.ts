type Meta = Record<string, unknown>;

const dev = typeof __DEV__ !== 'undefined' && __DEV__;

export const logger = {
  info: (message: string, meta?: Meta): void => {
    if (dev) console.log(`[INFO] ${message}`, ...(meta !== undefined ? [meta] : []));
  },
  warn: (message: string, meta?: Meta): void => {
    if (dev) console.warn(`[WARN] ${message}`, ...(meta !== undefined ? [meta] : []));
  },
  error: (message: string, meta?: Meta): void => {
    console.error(`[ERROR] ${message}`, ...(meta !== undefined ? [meta] : []));
  },
};
