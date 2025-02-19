<script lang="ts">
  import {
    seconds_from_mmss,
    PERIOD_LENGTH_S,
    seconds_since_start,
    mmss_from_seconds,
  } from '$lib/common.js';
  import { parse_shift } from '$lib/parser';
  import type { NHLShift, Shift } from '$lib/types.js';
  import * as d3 from 'd3';
  let { data } = $props();
  let raw_shifts: NHLShift[] = $state(data.shifts ?? []);
  let shifts: Shift[] = $derived(raw_shifts.map(parse_shift));
  let players: Map<number, string> = $derived(
    shifts.reduce((map, row) => {
      if (!row.playerId) return map;
      map.set(row.playerId, row.playerName);
      return map;
    }, new Map<number, string>())
  );
  let players_sorted: string[] = $derived(
    shifts.toSorted((x, y) => x.teamAbbrev?.localeCompare(y.teamAbbrev)).map((sh) => sh.playerName)
  );
  // set the dimensions and margins of the graph
  let margin = { top: 10, right: 30, bottom: 20, left: 100 },
    width = 1200 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;
  let y = $derived(
    // d3.scaleLinear([0, shifts_sorted.size - 1], [margin.left, width - margin.right])
    d3
      .scaleBand()
      .domain(players_sorted)
      .range([margin.top, height - margin.bottom])
      .padding(0.2)
  );
  let timescale = [0, 3 * PERIOD_LENGTH_S];
  let x = $derived(d3.scaleLinear(timescale, [margin.left, width - margin.right]));
  let gx, gy, svg;

  $effect(() => {
    d3.select(gy).call(d3.axisLeft(y));
    d3.select(gx)
      .call(d3.axisBottom(x).ticks(12).tickFormat(mmss_from_seconds))
      .call((g) =>
        g
          .append('text')
          .attr('x', width - margin.right + 5)
          .attr('y', 5)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text('sec')
      );
    d3.select(svg)
      .append('g')
      .selectAll()
      .data(shifts)
      .join('rect')
      .attr(
        'x',
        (shift: Shift) =>
          (shift.startTimeS / timescale[1]) * (width - margin.left - margin.right) + margin.left
      )
      .attr('y', (shift: Shift) => y(shift.playerName))
      .attr('height', y.bandwidth())
      .attr(
        'width',
        (shift: Shift) => (shift.durationS / timescale[1]) * (width - margin.left - margin.right)
      )
      .attr('fill', (shift: Shift) => shift.color)
      .style('opacity', 0.7)
      .style('outline-style', 'inset')
      .style('outline', 'thin solid blue')
      .on('mouseover', (el, shift) => {
        console.log(
          mmss_from_seconds(shift.startTimeS),
          mmss_from_seconds(shift.endTimeS),
          shift.durationS / 4
        );
      });
  });
</script>

<div class="flex h-full w-full flex-row items-center justify-center">
  <div class="chart h-fit bg-muted">
    <svg {width} {height}>
      <g bind:this={gx} transform="translate(0,{height - margin.bottom})" />
      <g bind:this={gy} transform="translate({margin.left},0)" />
      <g bind:this={svg} />
      <!-- <path fill="none" stroke="currentColor" stroke-width="1.5" d={line(data)} />
  <g fill="white" stroke="currentColor" stroke-width="1.5">
    {#each data as d, i}
      <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
    {/each}
  </g> -->
    </svg>
  </div>
</div>
