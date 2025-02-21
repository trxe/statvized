// import * as shiftcharts from '$lib/data/shiftcharts-2024020861.json'
// import * as play_by_play from '$lib/data/play_by_play-2024020861.json'
export const load = async ({ url, fetch, params }) => {
    const game_id = params.game ?? '2024200007';
    const shiftcharts_url = new URL("rest/en/shiftcharts", "https://api.nhle.com/stats/")
    shiftcharts_url.searchParams.append("cayenneExp", `gameId=${game_id}`);
    const headers = {
        "credentials": "omit",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site"
        },
        "method": "GET",
        "mode": "cors"
    };
    const shiftcharts_res = await fetch(shiftcharts_url, headers);
    const shiftcharts = await shiftcharts_res.json();
    const pbp_url = `https://api-web.nhle.com/v1/gamecenter/${game_id}/play-by-play`
    const play_by_play_res = await fetch(pbp_url, headers);
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