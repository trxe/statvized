<script lang="ts">
  import {
    PERIOD_LENGTH_S,
    mmss_from_seconds,
    scale_secs_to_width,
    seconds_from_mmss,
    seconds_since_start,
  } from '$lib/common.js';
  import { parse_shift } from '$lib/parser';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import type { NHLPlay, NHLShift } from '$lib/types/nhl.js';
  import type { PlayerPlay, Shift } from '$lib/types/cs.js';
  import * as d3 from 'd3';
  import BaseDropdown from '$lib/components/csui/dropdowns/base_dropdown.svelte';
  import { add_plays_to_shift } from '$lib/calculators/mapper.js';
  let { data } = $props();
  let plays: NHLPlay[] = $state(data.plays ?? []);
  let raw_shifts: NHLShift[] = $state(data.shifts ?? []);

  // let shifts: Shift[] = $derived(raw_shifts.map(parse_shift));
  let shifts: Shift[] = $derived(add_plays_to_shift(plays, raw_shifts.map(parse_shift)));
  let players: Map<number, string> = $derived(
    shifts.reduce((map, row) => {
      if (!row.playerId) return map;
      map.set(row.playerId, row.playerName);
      return map;
    }, new Map<number, string>())
  );
  let players_sorted: string[] = $derived(
    shifts
      .toSorted((x, y) => x.teamAbbrev?.localeCompare(y.teamAbbrev ?? '') ?? 0)
      .map((sh) => sh.playerName)
  );
  // set the dimensions and margins of the graph
  let margin = { top: 10, right: 30, bottom: 20, left: 100 },
    width = 1200 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;
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
      console.log(k, dx, dy);
      d3.select(gx).transition().call(d3.axisBottom(x));
      d3.selectAll('.shift-box rect').attr('transform', `translate(${dx}, 0) scale(${k}, 1)`);
      // d3.selectAll('.shift-box circle').attr('transform', `scale(${k}, 1)`);
      d3.selectAll('.shift-box circle').attr('transform', ` translate(${dx}, 0) scale(${k}, 1)`);
    }
  }

  $effect(() => {
    d3.select(gy).call(d3.axisLeft(y));
    d3.select(gx)
      .call(d3.axisBottom(x).ticks(12).tickFormat(mmss_from_seconds))
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
    // .style('opacity', 0.5)
    // .call(zoom);

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
        .attr('cy', (play: PlayerPlay) => y(players.get(play.playerId) ?? '') + y.bandwidth() / 2)
        .attr('r', '3px')
        .attr('fill', 'blue')
        .style('opacity', 1.0);
    });
  });
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
  <div class="mx-5 overflow-scroll shadow-lg shadow-black">
    <div class="chart h-fit bg-muted">
      <svg {width} {height}>
        <g bind:this={gx} transform="translate(0,{height - margin.bottom})" />
        <g bind:this={gy} transform="translate({margin.left},0)" />
        <g bind:this={svg} />
      </svg>
    </div>
  </div>
</div>
