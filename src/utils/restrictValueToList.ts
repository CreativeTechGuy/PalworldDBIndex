import { arrayIncludes } from "./arrayIncludes";

export function restrictValueToList<Value>(value: unknown, list: Value[], defaultValue: Value): Value {
    if (arrayIncludes(list, value)) {
        return value;
    }
    return defaultValue;
}
