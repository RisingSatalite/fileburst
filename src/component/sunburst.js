import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3Chart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr("width", 400)
      .attr("height", 200);

    // Remove previous circles to prevent duplicates
    svg.selectAll("circle").remove();

    // Add circles based on data
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => i * 60 + 50)
      .attr("cy", 100)
      .attr("r", d => d)
      .attr("fill", "blue");

  }, [data]); // re-run when data changes

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default D3Chart;
