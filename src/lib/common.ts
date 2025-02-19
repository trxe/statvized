import { parseTime } from "@internationalized/date";

export const PERIOD_LENGTH_S = 20 * 60;
export const INTERMISSION_LENGTH_S = 20 * 60;

export function seconds_from_mmss(timestr?: string | null): number {
    if (!timestr) return 0;
    const time = parseTime(`00:${timestr}`);
    return time.second + time.minute * 60;
}
export function mmss_from_seconds(seconds?: number | null): string {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function seconds_since_start(timestr: string | null, period: number, period_length_s: number = PERIOD_LENGTH_S) {
    return (period - 1) * period_length_s + seconds_from_mmss(timestr);
}
export function to_fixed(input: number | string, sf: number = 2): number {
    if (typeof input === 'string') return NaN;
    return ((input * Math.pow(10, sf)) | 0) / Math.pow(10, sf);
}