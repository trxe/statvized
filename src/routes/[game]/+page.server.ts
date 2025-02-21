// import * as shiftcharts from '$lib/data/shiftcharts-2024020861.json'
// import * as play_by_play from '$lib/data/play_by_play-2024020861.json'
export const load = async ({ url, fetch, params }) => {
    const game_id = params.game ?? '2024200007';
    const shiftcharts_url = new URL("rest/en/shiftcharts", "https://api.nhle.com/stats/")
    shiftcharts_url.searchParams.append("cayenneExp", `gameId=${game_id}`);
    const shiftcharts_res = await fetch(shiftcharts_url);
    const shiftcharts = await shiftcharts_res.json();
    const pbp_url = `https://api-web.nhle.com/v1/gamecenter/${game_id}/play-by-play`
    const play_by_play_res = await fetch(pbp_url);
    const play_by_play = await play_by_play_res.json();
    const { id, plays, rosterSpots, ...game } = play_by_play;
    return {
        shifts: shiftcharts.data,
        plays: plays,
        roster: rosterSpots,
        game: game,
        id: id,
    }
}