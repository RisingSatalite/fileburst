import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3Chart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;  // Wait until data is available

    const width = 800;
    const radius = width / 2;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", width)
      .style("font", "10px sans-serif");

    // Clear any previous chart elements
    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${radius},${radius})`);

    // Create the partition layout
    const partition = d3.partition()
      .size([2 * Math.PI, radius]);

    // Create a root node from the data and sum the values
    const root = d3.hierarchy(data)
      .sum(d => d.size);

    // Calculate the position of each segment
    partition(root);

    const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1);

    // Draw the arcs for each node
    g.selectAll("path")
      .data(root.descendants())
      .enter()
      .append("path")
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", d => {
        const scale = d3.scaleOrdinal(d3.schemeCategory10);
        return scale((d.children ? d : d.parent).data.name);
      })
      .on("mouseover", function () {
        d3.select(this).style("fill", "#ffcc00");
      })
      .on("mouseout", function () {
        d3.select(this).style("fill", d => {
          const scale = d3.scaleOrdinal(d3.schemeCategory10);
          return scale((d.children ? d : d.parent).data.name);
        });
      });

    // Add text labels
    g.selectAll("text")
  .data(root.descendants())
  .enter()
  .append("text")
  .attr("transform", d => {
    const angle = (d.x0 + d.x1) / 2 * 180 / Math.PI;  // Midpoint angle
    const rotate = angle < 180 ? angle - 90 : angle + 90;  // Rotate text accordingly
    const radius = (d.y0 + d.y1) / 2;  // Midpoint of the inner and outer radii
    return `rotate(${rotate}) translate(${radius},0) rotate(${angle < 180 ? 0 : 180})`;  // Flip text on the left side
  })
  .attr("dx", "6")  // Move text slightly outwards
  .attr("dy", "0.35em")  // Vertically center the text
  .text(d => d.data.name)
  .style("text-anchor", d => (d.x0 + d.x1) / 2 < Math.PI ? "start" : "end")  // Align text based on the side of the circle
  .style("font-size", "10px");


  }, [data]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default D3Chart;
