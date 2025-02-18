import { parseTime } from "@internationalized/date";

export function parse_mmss_seconds(timestr?: string): number {
    if (!timestr) return 0;
    const time = parseTime(`00:${timestr}`);
    return time.second + time.minute * 60;
}