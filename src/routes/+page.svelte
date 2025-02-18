<script lang="ts">
  import { parse_mmss_seconds } from '$lib/common.js';
  import { parseTime } from '@internationalized/date';
  import * as d3 from 'd3';
  let { data } = $props();
  let shifts = $state(data.shifts);
  let shifts_sorted = $derived(
    shifts.reduce((map, row) => {
      if (!map.get(row.playerId)) {
        map.set(row.playerId, []);
      }
      map.get(row.playerId).push(row);
      return map;
    }, new Map<number, Array<any>>())
  );
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 20, left: 50 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
  let frame;
  let svg = $derived(
    d3
      .select(frame)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  );
  $effect(() => {
    var groups = shifts_sorted.keys().toArray();
    var endpts: number[] = Object.entries(shifts[0]).map((x) => parse_mmss_seconds(x[0].endTime));
    var maxh = Math.max(...endpts);
    var x = d3
      .scaleLinear()
      .domain([0, maxh / 2])
      .range([0, width]);
    svg.append('g').call(d3.axisBottom(x));

    var y = d3.scaleBand().domain(groups).range([height, 0]).padding([0.2]);
    svg
      .append('g')
      .attr('transform', 'translate(' + height + ',0)')
      .call(d3.axisLeft(y).tickSizeOuter(0));
    // console.log(groups, subgroups);
    var color = d3.scaleLog().domain([0, maxh]).range(d3.schemeSet2);

    svg
      .append('g')
      .selectAll('g')
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .enter()
      .append('g')
      .attr('fill', function (d) {
        return color(d.key);
      })
      .attr('class', function (d) {
        return 'myRect ' + d.key;
      }) // Add a class to each subgroup: their name
      .selectAll('rect')
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function (d) {
        return d;
      })
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return x(d.data.group);
      })
      .attr('y', function (d) {
        return y(d[1]);
      })
      .attr('height', function (d) {
        return y(d[0]) - y(d[1]);
      })
      .attr('width', x.bandwidth())
      .attr('stroke', 'grey');
  });
</script>

<div class="flex h-full w-full flex-row items-center justify-center">
  <div bind:this={frame} class="chart h-1/2 w-1/2 bg-muted"></div>
</div>
