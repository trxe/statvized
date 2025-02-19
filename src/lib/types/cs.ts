import type { NHLPlay } from "./nhl";

export type Shift = {
    id: NId;
    period: number;
    startTimeS: number,
    endTimeS: number;
    durationS: number;
    shiftNumber: number;
    eventNumber: number;
    playerId: NId;
    playerName: string;
    teamAbbrev: OptStr;
    color: string;
    plays: PlayerPlay[];
};

export type PlayerPlay = {
    playerId: NId;
    typeDescKey: string;
    role: string;
    play: NHLPlay;
    secSinceStart: number;
}