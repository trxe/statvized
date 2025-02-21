import { seconds_from_mmss, seconds_since_start } from "$lib/common";
import type { PlayerPlay, Shift } from "$lib/types/cs";
import type { NHLPlay, NHLShift } from "$lib/types/nhl";

export function map_plays_to_player(plays: NHLPlay[]): Map<NId, PlayerPlay[]> {
    const player_plays = new Map<NId, PlayerPlay[]>();
    plays.forEach((play) => {
        const time_s = seconds_since_start(play.timeInPeriod, play.periodDescriptor.number);
        Object.entries(play.details ?? {})
            .forEach(([key, playerId]) => {
                if (typeof playerId != 'number' || !key.toLocaleLowerCase().includes('playerid')) return;
                if (!player_plays.has(playerId)) {
                    player_plays.set(playerId, []);
                }
                player_plays.get(playerId)?.push({
                    playerId,
                    play,
                    role: key.replaceAll('playerId', '').replaceAll('playerId', ''),
                    typeDescKey: play.typeDescKey,
                    secSinceStart: time_s
                });
            });
    });
    return player_plays;
}

function find_shift_in_sorted_list(shift_list: Shift[], time_s: number): Shift | null {
    let start = 0, end = shift_list.length;
    while (start < end) {
        let mid = Math.floor((end - start) / 2 + start);
        const shift = shift_list[mid];
        if (time_s < shift.startTimeS) {
            end = mid;
        } else if (shift.endTimeS < time_s) {
            start = mid + 1;
        } else {
            return shift_list[mid];
        }
    }
    return null;
}

export function add_plays_to_shift(plays: NHLPlay[], shifts: Shift[]): {
    'shifts': Shift[],
    'unplotted_plays': PlayerPlay[]
} {
    let count = 0;
    let unplotted_plays: PlayerPlay[] = [];
    const player_shifts = new Map<NId, Shift[]>();
    shifts.forEach((shift) => {
        if (!player_shifts.has(shift.playerId)) {
            player_shifts.set(shift.playerId, []);
        }
        player_shifts.get(shift.playerId)?.push(shift);
    });
    player_shifts.forEach((shift_list) => {
        shift_list.sort((x: Shift, y: Shift) => x.shiftNumber - y.shiftNumber);
    });
    plays.forEach((play) => {
        const time_s = seconds_since_start(play.timeInPeriod, play.periodDescriptor.number);
        Object.entries(play.details ?? {})
            .forEach(([key, playerId]) => {
                if (typeof playerId != 'number' || !key.toLowerCase().includes('playerid')) return;
                const playerplay = {
                    playerId,
                    play,
                    role: key.replaceAll('playerId', '').replaceAll('playerId', ''),
                    typeDescKey: play.typeDescKey,
                    secSinceStart: time_s
                }
                const shift_list = player_shifts.get(playerId);
                if (!shift_list?.length) return;
                const shift = find_shift_in_sorted_list(shift_list, time_s);
                if (!shift) {
                    // console.warn("no shift?", time_s, shift_list)
                    unplotted_plays.push(playerplay);
                } else {
                    shift.plays.push(playerplay);

                }
            });
    });
    return { shifts, unplotted_plays };
}