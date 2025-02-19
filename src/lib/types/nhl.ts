export type NHLShift = {
    id: NId;
    detailCode: number;
    duration: OptStr;
    startTime: OptStr;
    endTime: OptStr;
    eventDescription: OptStr;
    eventDetails: OptStr;
    eventNumber: number;
    firstName: OptStr;
    lastName: OptStr;
    gameId: number;
    playerId: NId;
    shiftNumber: number;
    teamAbbrev: OptStr;
    teamId: NId;
    hexValue: OptStr;
    typeCode: number;
    period: number;
};


export type NHLClock = {
    timeRemaining: string;
    secondsRemaining: number;
    running: string;
    inIntermission: boolean;
}

export type NHLMultilingual = {
    default: string;
    fr?: string;
    cs?: string;
    fi?: string;
    sk?: string;
    de?: string;
    es?: string;
}

export type NHLPlayer = {
    playerId: number;
    firstName: NHLMultilingual;
    lastName: NHLMultilingual;
    name: NHLMultilingual;
    assistsToDate: number;
    sweaterNumber: number;
}

export type NHLTeam = {
    id: number,
    commonName?: NHLMultilingual,
    name?: NHLMultilingual,
    abbrev: string,
    placeName: NHLMultilingual,
    placeNameWithPreposition: NHLMultilingual,
    score: number;
    sog: number;
    logo: string;
    darkLogo?: string;
    record?: string;
}

export type NHLShootout = {
    sequence: number;
    playerId: number;
    teamAbbrev: string;
    firstName: string;
    lastName: string;
    shotType: string;
    result: string;
    headshot: string;
    gameWinner: boolean;
}

export type NHLGoal = {
    situationCode: string;
    eventId: number;
    strength: string;
    playerId: number;
    firstName: NHLMultilingual;
    lastName: NHLMultilingual;
    name: NHLMultilingual;
    sweaterNumber?: number;
    goalsToDate: number;
    teamAbbrev: NHLMultilingual;
    headshot: string;
    highlightClipSharingUrl: string;
    highlightClipSharingUrlFr: string;
    highlightClip: number;
    highlightClipFr: number;
    discreteClip: number;
    discreteClipFr: number;
    awayScore: number;
    homeScore: number;
    timeInPeriod: string;
    shotType: string;
    goalModifier: string;
    assists: NHLPlayer[];
    pptReplayUrl: string;
    homeTeamDefendingSide: string; // "left" | "right"
    isHome: boolean;
}

export type NHLKeyframe = {
    id: number;
    playerId: number;
    sweaterNumber: number;
    teamAbbrev: string;
    teamId: number;
    x: number;
    y: number;
}

export type NHLTimestampKeyframe = {
    timestamp: number;
    onIce: NHLKeyframe[];
}

export type NHLStar = {
    star: number,
    playerId: number,
    teamAbbrev: string,
    headshot: string,
    name: NHLMultilingual,
    sweaterNo: number,
    position: string,
    goalsAgainstAverage?: number,
    savePctg?: number;
    goals?: number;
    assists?: number;
    points?: number;
}

export type NHLPeriodDescriptor = {
    number: number;
    periodType: string; // 'REG' | 'OT' | 'SO'
    maxRegulationPeriods: number;
}

export type NHLPeriodSummary = {
    periodDescriptor: NHLPeriodDescriptor;
    goals: NHLGoal[];
    penalties: NHLPenalty[];
}

export type NHLPlay = {
    eventId: number;
    periodDescriptor: NHLPeriodDescriptor;
    timeInPeriod: string; // MM:SS
    timeRemaining: string; // MM:SS
    situationCode: string; // HomeG HomeS AwayG AwayS
    homeTeamDefendingSide: string;// "left" | "right";
    typeCode: number;
    typeDescKey: string;
    sortOrder: number;
    details?: {
        descKey?: number;
        assist2PlayerTotal?: number;
        homeSOG?: number;
        playerId?: NId;
        highlightClipSharingUrl?: string;
        assist1PlayerTotal?: number;
        shootingPlayerId?: NId;
        shotType?: string;
        highlightClipFr?: number;
        discreteClip?: number;
        committedByPlayerId?: number;
        highlightClip?: number;
        hitteePlayerId?: NId;
        eventOwnerTeamId?: number;
        awaySOG?: number;
        secondaryReason?: number;
        yCoord?: number;
        assist2PlayerId?: NId;
        xCoord?: number;
        reason?: number;
        scoringPlayerId?: NId;
        blockingPlayerId?: NId;
        hittingPlayerId?: NId;
        zoneCode?: string;
        losingPlayerId?: NId;
        typeCode?: number;
        scoringPlayerTotal?: number;
        homeScore?: number;
        discreteClipFr?: number;
        awayScore?: number;
        duration?: number;
        winningPlayerId?: NId;
        goalieInNetId?: NId;
        assist1PlayerId?: NId;
        highlightClipSharingUrlFr?: string;
        drawnByPlayerId?: NId;
    }
};

export type NHLGameSummary = {
    scoring: NHLPeriodSummary[];
    penalties: NHLPeriodSummary[];
    shootout: NHLShootout[];
}

export type NHLPenalty = {
    timeInPeriod: string;
    type: string,
    duration: 2,
    committedByPlayer: string, // name
    teamAbbrev: {
        default: string
    },
    drawnBy: string, // name
    descKey: string// name
}

export type NHLGame = {
    id: number;
    season: number;
    gameType: number;
    limitedScoring: boolean;
    gameDate: string;
    venue: NHLMultilingual;
    venueLocation: NHLMultilingual;
    startTimeUTC: string;
    easternUTCOffset: string;
    venueUTCOffset: string;
    venueTimezone: string;
    periodDescriptor: NHLPeriodDescriptor;
    gameState: string;
    gameScheduleState: string;
    awayTeam: NHLTeam;
    homeTeam: NHLTeam;
    summary?: NHLGameSummary;
    goals?: NHLGoal[];
    gameCenterLink: string;
    gameOutcome?: {
        lastPeriodType: string
    }
}