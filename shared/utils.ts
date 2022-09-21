import { Debug } from "./config";

export const joaat = (key: string): number => {
    const keyLowered = key.toLowerCase();
    const length = keyLowered.length;

    let hash, i;

    for (hash = i = 0; i < length; i++) {
        hash += keyLowered.charCodeAt(i);
        hash += hash << 10;
        hash ^= hash >>> 6;
    }

    hash += hash << 3;
    hash ^= hash >>> 11;
    hash += hash << 15;

    return Math.floor(hash << 0);
};

export const debugLog = (msg: string): void => {
    if (!Debug) return;
    console.log(msg);
}