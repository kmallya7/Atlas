export function createId(prefix = 'item') {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 10000)}`;
}
