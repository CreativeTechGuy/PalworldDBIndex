const keyCache = new Map<Record<string, unknown>, Record<string, string>>();

export function getObjectByCaseInsensitiveKey<Value>(obj: Record<string, Value>, key: string): Value | undefined {
    const currentCache = keyCache.get(obj) ?? {};
    if (key in currentCache) {
        return obj[currentCache[key]];
    }
    const lowercaseKey = key.toLowerCase();
    const entries = Object.entries(obj);
    keyCache.set(obj, currentCache);
    for (const [entryKey, value] of entries) {
        if (entryKey.toLowerCase() === lowercaseKey) {
            keyCache.get(obj)![key] = entryKey;
            return value;
        }
    }
    return undefined;
}
