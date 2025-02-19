import * as shiftcharts from '$lib/data/shiftcharts-2024020861.json'
import * as play_by_play from '$lib/data/play_by_play-2024020861.json'
export const load = async ({ fetch }) => {
    // const shiftcharts_url = new URL("rest/en/shiftcharts", "https://api.nhle.com/stats/")
    // shiftcharts_url.searchParams.append("cayenneExp", "gameId=2024020861");
    // shiftcharts_url.searchParams.append("limit", "50");
    // const shiftcharts_res = await fetch(shiftcharts_url);
    // const shiftcharts = await shiftcharts_res.json();
    // console.log()
    const { id, plays, rosterSpots, ...game } = play_by_play;
    return {
        shifts: shiftcharts.data,
        plays: plays,
        roster: rosterSpots,
        game: game,
        id: id,
    }
}