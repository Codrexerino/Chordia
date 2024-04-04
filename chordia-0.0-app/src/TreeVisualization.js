import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './TreeVisualization.css';
import { TreeData_H, TreeData_C } from './TreeData.js';

function TreeVisualization() {
  const svgRef = useRef();

  useEffect(() => {

    // definer margins
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };

    // Calculer width og høyde basert på SVG containern sine dimensjoner
    const { clientWidth, clientHeight } = svgRef.current.getBoundingClientRect();
    const width = clientWidth - margin.left - margin.right;
    const height = clientHeight - margin.top - margin.bottom;



    // Fjern eksisterende graf (hvis den finnes)
    d3.select(svgRef.current).selectAll("*").remove();


    // Create SVG element
    const svg = d3.select(svgRef.current)
    .attr("width", "100%") // setter bredden av SVG container til 100% av containeren
    .attr("height", "100%") // gjør det samme for høyden
    // legger til viewBox for responsivitet funksjonalitet
    .attr("viewBox", `0 0 ${width} ${height}`) // justerer viewBox for å plass til treeLayot
    .call(d3.zoom().on("zoom", (event) => {
      g.attr("transform", event.transform);
    })) 
    .append(`g`);


    const g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // Definer grafen/hieraki
    const hierarchyRoot = d3.hierarchy(TreeData_H);

    // definer tree layout
    const treeLayout = d3.tree()
      .size([width, height]);
    treeLayout(hierarchyRoot);

    hierarchyRoot.descendants().forEach(node => {
      node.y = height - node.y - margin.bottom; // This will flip the tree

    });

    // Definerer linker basert på hierakial verdier

    const linksGenerator = d3.linkVertical()
      .x(d => d.x)
      .y(d => d.y);
    
    // tegner linker
    svg.selectAll(".link")
      .data(hierarchyRoot.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("d", linksGenerator);


    // tegner noder
    const nodeGroups = svg.selectAll(".node")
      .data(hierarchyRoot.descendants())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);
    
    // tegner sirkler rundt nodene?  
    nodeGroups.append("circle")
      .attr("r", 10); // Set the radius as needed
    
    // tegner tekst i nodene
    nodeGroups.append("text")
      .attr("dy", "0.35em")
      .attr("x", d => d.children ? -15 : 15) // Position text left of parent nodes, right of leaf nodes
      .style("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name);


    // lager et kartover hvor nodene er lagd over er
    const nodesMap = new Map();
    hierarchyRoot.descendants().forEach(d => {
      nodesMap.set(d.data.name, d);
    });

    // Konverterer source og target til D3 nodene ifølge kartet
    const crossLinks = TreeData_C.map(link => ({
      source: nodesMap.get(link.source),
      target: nodesMap.get(link.target),
    }));
    

    // tegner linkene fra TreeData_C
    svg.selectAll(".cross-link")
    .data(crossLinks)
    .enter().append("path")
    .attr("class", "cross-link")
    .attr("d", d3.linkVertical()
      .x(d => d.x)
      .y(d => d.y))
    .attr("fill", "none")
    .attr("stroke", "grey") // Example: Red color for distinction
    .attr("stroke-dasharray", "2,2")
    .attr("stroke-width", "2px"); // Example: Dashed line for visual differentiation

    // After the tree layout is computed
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    hierarchyRoot.each(node => {
      if (node.x < minX) minX = node.x;
      if (node.x > maxX) maxX = node.x;
      if (node.y < minY) minY = node.y;
      if (node.y > maxY) maxY = node.y;
    });

    // Define the zoom behavior
    const zoom = d3.zoom()
    .scaleExtent([0.1, 3]) // Example scale extent, can be adjusted
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

    // Now apply the initial zoom based on the extents
    const initialScale = Math.min(width / (maxX - minX), height / (maxY - minY));
    const initialX = -minX * initialScale + (width - (maxX - minX) * initialScale) / 2;
    const initialY = -minY * initialScale + (height - (maxY - minY) * initialScale) / 2;

    svg.call(zoom.transform, d3.zoomIdentity.translate(initialX, initialY).scale(initialScale));



    }, []);

  return <svg ref={svgRef} className="tree-container"></svg>;
}

export default TreeVisualization;
