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
    const radius = (d.y0 + d.y1) / 2;  // Midpoint of radius
    // Flip the text only if it's on the left side (>180 degrees), so it's upright
    const flip = 0;//angle > 180 ? 180 : 0;
    const rotate = angle - 90 + flip;
    return `rotate(${rotate}) translate(${radius},0) rotate(${flip})`;
  })
  .attr("dx", "5")  // Adjust this to move text closer to the start of the arc
  .attr("dy", "0.35em")  // Vertically center the text
  .style("text-anchor", "start")  // Align text at the start of its block
  .text(d => d.data.name)
  .style("font-size", "10px")
  .style("fill", "#fff");  // Set the text color to white for contrast


  }, [data]);

  return (
    <div>
      <svg id="d3chart" ref={svgRef}></svg>
    </div>
  );
};

export default D3Chart;
