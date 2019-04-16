import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dashboard';

  ngOnInit() {
    const margin = {top: 20, right: 20, bottom: 70, left: 40};
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const	parseDate = d3.timeFormat('%Y-%m').parse;

    const x = d3.scaleBand().rangeRound([0, width], .05);

    const y = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom(x)
        .tickFormat(d3.timeFormat('%Y-%m'));

    const yAxis = d3.axisLeft(y)
        .ticks(10);

    const svg = d3.select('#bar').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform',
              'translate(' + margin.left + ',' + margin.top + ')');

    d3.csv('/assets/data.csv', (error, data) => {

      data.forEach((d) => {
          d.date = parseDate(d.date);
          d.value = +d.value;
      });

      x.domain(data.map((d) => d.date));
      y.domain([0, d3.max(data, (d) => d.value )]);

      svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis)
        .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-.8em')
          .attr('dy', '-.55em')
          .attr('transform', 'rotate(-90)' );

      svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis)
        .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('Value ($)');

      svg.selectAll('bar')
          .data(data)
        .enter().append('rect')
          .style('fill', 'steelblue')
          .attr('x', (d) => x(d.date) )
          .attr('width', x.rangeBand())
          .attr('y', (d) => y(d.value) )
          .attr('height', (d) => height - y(d.value));

    });

  }
}
