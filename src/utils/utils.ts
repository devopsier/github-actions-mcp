export function ensureString(value: string | string[]): string {
    return Array.isArray(value) ? value[0] : value;
}