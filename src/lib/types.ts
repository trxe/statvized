

type OptStr = string | null;

export type NHLShift = {
    id: number;
    detailCode: number;
    startTime: OptStr;
    endTime: OptStr;
    eventDescription: OptStr;
    eventDetails: OptStr;
    eventNumber: number;
    firstName: OptStr;
    lastName: OptStr;
    gameId: number;
    playerId: number;
    teamAbbrev: OptStr;
    hexValue: OptStr;
    typeCode: number;
    duration: OptStr;
    period: number;
};

export type Shift = {
    id: number;
    period: number;
    startTimeS: number,
    endTimeS: number;
    durationS: number;
    eventNumber: number;
    playerId: number;
    playerName: string;
    teamAbbrev: OptStr;
    color: string;
};