import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './TreeVisualization.css';

function TreeVisualization() {
  const svgRef = useRef();

  useEffect(() => {
    // Størrelsen på nettverksdiagrammet
    const width = 960;
    const height = 600;

    // Fjern eksisterende graf (hvis den finnes)
    d3.select(svgRef.current).selectAll("*").remove();

    // Opprett SVG-elementet
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g") // Gruppe for å holde alle elementer
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Data for nodene og linkene
    const graph = {
      "nodes": [
        {"id": "Harmony", "group": 1},
        {"id": "Scales", "group": 2},
        {"id": "Intervals", "group": 2},
        {"id": "Chords", "group": 2},
        {"id": "Major scale", "group": 3},
        {"id": "Perfect Intervals", "group": 3},
        {"id": "Major and Minor Intervals", "group": 3},
        {"id": "Major Chords", "group": 3},
        {"id": "Minor Chords", "group": 3}
      ],
      "links": [
        {"source": "Major scale", "target": "Scales"},
        {"source": "Perfect Intervals", "target": "Intervals"},
        {"source": "Major and Minor Intervals", "target": "Intervals"},
        {"source": "Major Chords", "target": "Chords"},
        {"source": "Minor Chords", "target": "Chords"},
        {"source": "Scales", "target": "Harmony"},
        {"source": "Intervals", "target": "Harmony"},
        {"source": "Chords", "target": "Harmony"}
      ]
    };

    // Opprett en forceSimulation for å håndtere layout av nodene og linkene
    const simulation = d3.forceSimulation(graph.nodes)
      .force("link", d3.forceLink(graph.links).id(d => d.id))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter());

    // Tegn linkene mellom nodene
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke-width", 2)
      .style("stroke", "#999");

    // Opprett grupper for nodene som vil holde både sirkler og tekst
    const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g.node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node");

    // Tegn sirkler for hver node inne i gruppen
    node.append("circle")
    .attr("r", 15)
    .attr("fill", "green");

    // Tegn tekst for hver node inne i gruppen
    node.append("text")
      .text(d => d.id)
      .attr("x", 0) // Sentrer tekst horisontalt
      .attr("y", 0) // Start ved midten av sirkelen vertikalt
      .attr("dy", ".35em") // Justering for å vertikalt sentrere basert på fontens høyde
      .style("font-size", "5px")
      .style("fill", "#fff")
      .style("text-anchor", "middle"); // Sentrerer teksten basert på dens bredde

      

    simulation.on("tick", () => {
      // Oppdater posisjoner for linkene
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
    
      // Oppdater posisjonen til nodene (gruppene som inneholder både sirkler og tekst)
      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });
    

  }, []);

  return <svg ref={svgRef} className="tree-container"></svg>;
}

export default TreeVisualization;
