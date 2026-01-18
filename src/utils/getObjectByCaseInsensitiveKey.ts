export function getObjectByCaseInsensitiveKey<Value>(obj: Record<string, Value>, key: string): Value | undefined {
    const lowercaseKey = key.toLowerCase();
    const entries = Object.entries(obj);
    for (const [entryKey, value] of entries) {
        if (entryKey.toLowerCase() === lowercaseKey) {
            return value;
        }
    }
    return undefined;
}
