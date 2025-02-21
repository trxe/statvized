<script lang="ts">
  import {
    PERIOD_LENGTH_S,
    mmss_from_seconds,
    scale_secs_to_width,
    seconds_from_mmss,
    seconds_since_start,
  } from '$lib/common.js';
  import { parse_shift } from '$lib/parser';
  import type { NHLPlay, NHLPlayer, NHLShift } from '$lib/types/nhl.js';
  import type { PlayerPlay, Shift } from '$lib/types/cs.js';
  import * as d3 from 'd3';
  import { add_plays_to_shift } from '$lib/calculators/mapper.js';
  let { data } = $props();
  let players: Map<number, NHLPlayer> = $derived(
    new Map(data.roster.map((x: NHLPlayer) => [x.playerId, x]))
  );
  let players_sorted: string[] = $derived(
    players
      .values()
      .toArray()
      .toSorted((x, y) => x.teamId - y.teamId)
      .map((sh) => `${sh?.firstName?.default} ${sh?.lastName?.default}`)
  );

  // set the dimensions and margins of the graph
  let margin = { top: 20, right: 30, bottom: 20, left: 100 },
    width = 1200 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;
  let y = $derived(
    d3
      .scaleBand()
      .domain(players_sorted)
      .range([margin.top, height - margin.bottom])
      .padding(0.2)
  );
  let timescale = [0, 3 * PERIOD_LENGTH_S];
  let x = $derived(d3.scaleLinear(timescale, [margin.left, width - margin.right]));
  let gx, gy, svg;
  let sel_play: PlayerPlay | undefined = $state();

  function zoom(svg) {
    const extent = [
      [margin.left, margin.top],
      [width - margin.right, height - margin.top],
    ];

    svg.call(
      d3.zoom().scaleExtent([1, 8]).translateExtent(extent).extent(extent).on('zoom', zoomed)
    );

    function zoomed(event) {
      // Update x axis
      x.range([margin.left, width - margin.right].map((d) => event.transform.applyX(d)));
      const { k, x: dx, y: dy } = event.transform;
      // console.log(k, dx, dy, dx / dy);
      d3.select(gx).transition().call(d3.axisBottom(x));
      d3.selectAll('.shift-box rect').attr('transform', `translate(${dx}, 0) scale(${k}, 1)`);
      // TODO: Figure out how to scale this without changing the width of the circle
      d3.selectAll('.shift-box circle').attr('transform', ` translate(${dx}, 0) scale(${k}, 1)`);
      d3.selectAll('.plays-bg circle').attr('transform', ` translate(${dx}, 0) scale(${k}, 1)`);
    }
  }

  $effect(() => {
    let shifts_plays: {
      shifts: Shift[];
      unplotted_plays: PlayerPlay[];
    } = add_plays_to_shift(data.plays, data.shifts.map(parse_shift));
    let { shifts, unplotted_plays } = shifts_plays;
    d3.select(gy).call(d3.axisLeft(y));
    d3.select(gx)
      .call(d3.axisBottom(x).ticks(20).tickFormat(mmss_from_seconds))
      .append('text')
      .attr('x', width - margin.right + 5)
      .attr('y', 5)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'start')
      .text('sec');

    d3.select(svg)
      .attr('viewBox', [0, 0, width, height])
      .attr('width', width)
      .attr('height', height)
      .attr('style', 'max-width: 100%; height: auto;')
      .call(zoom);

    d3.select(svg)
      .join('g')
      .attr('class', 'plays-bg')
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('opacity', 0.1)
      .attr('fill', 'transparent');

    d3.select(svg)
      .selectAll()
      .data(shifts)
      .join('g')
      .attr('class', (shift: Shift) => `shift-box p-${shift.playerId} s-${shift.id}`)
      .style('opacity', 0.5)
      .on('mouseover', (el, shift) => {
        d3.select(`.s-${shift.id}`).style('opacity', 1.0);
        d3.selectAll(`.shift-box:not(.p-${shift.playerId})`)
          .transition()
          .duration(300)
          .style('opacity', 0.3);
      })
      .on('mouseleave', () => {
        d3.selectAll('.shift-box').transition().duration(200).style('opacity', 0.5);
      })
      .append('rect')
      .attr(
        'x',
        (shift: Shift) => scale_secs_to_width(shift.startTimeS, width, margin) + margin.left
      )
      .attr('y', (shift: Shift) => y(shift.playerName))
      .attr('height', y.bandwidth())
      .attr('width', (shift: Shift) => scale_secs_to_width(shift.durationS, width, margin))
      .attr('fill', (shift: Shift) => shift.color);

    shifts.forEach((shift) => {
      d3.select(`.s-${shift.id}`)
        .append('g')
        .selectAll()
        .data(shift.plays)
        .join('circle')
        .attr(
          'class',
          (play: PlayerPlay) =>
            `play-item pp-${shift.playerId} ps-${shift.id} pl-${play.play.eventId}`
        )
        .attr(
          'cx',
          (play: PlayerPlay) => scale_secs_to_width(play.secSinceStart, width, margin) + margin.left
        )
        .attr('cy', (play: PlayerPlay) => {
          const player = players.get(play.playerId);
          return (
            y(`${player?.firstName?.default} ${player?.lastName?.default}` ?? '') +
            y.bandwidth() / 2
          );
        })
        .attr('r', '3px')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
        .attr('fill', 'yellow')
        .style('opacity', 1.0)
        .on('mouseover', (el, play: PlayerPlay) => {
          sel_play = play;
        });
    });

    d3.select('.plays-bg')
      .append('g')
      .selectAll()
      .data(unplotted_plays)
      .join('circle')
      .attr(
        'class',
        (play: PlayerPlay) => `unplot play-item pp-${play.playerId} pl-${play.play.eventId}`
      )
      .attr(
        'cx',
        (play: PlayerPlay) => scale_secs_to_width(play.secSinceStart, width, margin) + margin.left
      )
      .attr('cy', (play: PlayerPlay) => {
        const player = players.get(play.playerId);
        return (
          y(`${player?.firstName?.default} ${player?.lastName?.default}` ?? '') + y.bandwidth() / 2
        );
      })
      .attr('r', '3px')
      // .attr('fill', (play: PlayerPlay) =>
      //   sel_play?.play.eventId == play.play.eventId ? 'red' : 'orange'
      // )
      .attr('fill', 'orange')
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5)
      .style('opacity', 1.0)
      .on('mouseover', (el, play: PlayerPlay) => {
        sel_play = play;
      });
  });

  function get_player() {
    return players.get(sel_play?.playerId ?? 0);
  }
</script>

{#snippet selected_play()}
  {@const player = get_player()}
  <div>
    Play:
    <p>id: {sel_play?.playerId}</p>
    <p>{player?.firstName?.default}</p>
    <p>{player?.lastName?.default}</p>
    <p>{sel_play?.play?.typeDescKey}</p>
    <p>{sel_play?.role}</p>
  </div>
{/snippet}

<div class="flex h-full w-full flex-col lg:flex-row lg:items-center lg:justify-center">
  <div class="mx-5 overflow-scroll shadow-lg shadow-black">
    <div class="chart h-fit bg-muted">
      <svg {width} {height}>
        <g bind:this={gx} transform="translate(0,{height - margin.bottom})" />
        <g bind:this={gy} transform="translate({margin.left},0)" />
        <g bind:this={svg} />
      </svg>
    </div>
  </div>
  <div class="h-[500px] w-[300px] rounded-xl bg-slate-200 p-2">{@render selected_play()}</div>
</div>
