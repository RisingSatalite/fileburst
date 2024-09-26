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

    // root.value gives you the sum of the entire hierarchy (i.e., the root parent value)
    const rootValue = root.value;  // This is the value of the root (the topmost parent)

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
      .on("mouseover", function (event, d) {
        // Change the fill color of the path
        d3.select(this).style("fill", "#ffcc00");

        // Change the font size of the corresponding text element
        g.selectAll("text").filter(textD => textD === d)  // Find corresponding text
          .style("font-size", "12px");  // Larger font size on hover
      })
      .on("mouseout", function (event, d) {
        d3.select(this).style("fill", d => {
          const scale = d3.scaleOrdinal(d3.schemeCategory10);
          return scale((d.children ? d : d.parent).data.name);
        });

        // Reset the font size of the corresponding text element
        g.selectAll("text").filter(textD => textD === d)
          .style("font-size", d => {
            // Check if the text should be hidden based on the value
            if (d.value < 0.005 * rootValue) {
              return "0px";  // Hide text if small compared to root
            } else if (d.parent && d.value < 0.1 * d.parent.value) {
              //return "0px";  // Hide text if small compared to parent
            }
            return "10px";  // Default font size for larger nodes
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
        const flip = 0;  // Flip condition can be added here
        const rotate = angle - 90 + flip;
        return `rotate(${rotate}) translate(${radius},0) rotate(${flip})`;
      })
      .attr("dx", "-35")
      .attr("dy", "0.35em")
      .style("text-anchor", "start")
      .text(d => d.data.name)
      .style("font-size", d => {
        if (d.value < 0.005 * rootValue) {
          return "0px";  // Hide text based on root comparison
        } else if (d.parent && d.value < 0.1 * d.parent.value) {
          //return "0px";  // Hide smaller text
        }
        return "10px";  // Default font size for visible nodes
      })
      .style("fill", "#fff");

  }, [data]);

  return (
    <div>
      <svg id="d3chart" ref={svgRef}></svg>
    </div>
  );
};

export default D3Chart;
