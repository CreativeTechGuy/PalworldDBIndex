export function arrayIncludes<Value>(array: readonly Value[], value: unknown): value is Value {
    return array.includes(value as Value);
}
