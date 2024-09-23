import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3Chart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return; // Wait until data is available

    // Set up the dimensions
    const width = 800;
    const height = 600;
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Clear any previous chart elements
    svg.selectAll("*").remove();

    // Create a D3 hierarchy from the data
    const root = d3.hierarchy(data);

    // Create a tree layout
    const treeLayout = d3.tree().size([width, height - 200]);
    treeLayout(root);

    // Add links (lines between nodes)
    svg.selectAll('line')
      .data(root.links())
      .enter()
      .append('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', 'black');

    // Add nodes (circles for each node)
    svg.selectAll('circle')
      .data(root.descendants())
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 5)
      .attr('fill', 'blue');

    // Add labels (node names)
    svg.selectAll('text')
      .data(root.descendants())
      .enter()
      .append('text')
      .attr('x', d => d.x + 10)
      .attr('y', d => d.y)
      .text(d => d.data.name);

  }, [data]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default D3Chart;
