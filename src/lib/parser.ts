import { seconds_from_mmss, seconds_since_start } from "./common";
import type { Shift } from "./types/cs";
import type { NHLShift } from "./types/nhl";

export function parse_shift(raw: NHLShift): Shift {
    return {
        durationS: seconds_from_mmss(raw.duration),
        startTimeS: seconds_since_start(raw.startTime, raw.period),
        endTimeS: seconds_since_start(raw.endTime, raw.period),
        period: raw.period,
        eventNumber: raw.eventNumber,
        shiftNumber: raw.shiftNumber,
        id: raw.id,
        playerId: raw.playerId,
        playerName: `${raw.firstName} ${raw.lastName}`.trim(),
        teamAbbrev: raw.teamAbbrev,
        color: raw.hexValue ?? 'black',
        plays: []
    }
}
