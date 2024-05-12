import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './TreeVisualization.css';
import { TreeData_H, TreeData_C } from './TreeData.js';

function TreeVisualization() {
  const svgRef = useRef(null);
  const [selectedNodeKey, setSelectedNodeKey] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [isTreeVisible, setIsTreeVisible] = useState(false);
  const [isInFocus, setIsInFocus] = useState(false);
  const [imageSource, setImageSource] = useState('');
  const [nodePositions, setNodePositions] = useState({});



  

  const drawTree = () => {
        //fjerner alle tidligere elementer  
        d3.select(svgRef.current).selectAll('*').remove();

        // Define the margins inside the useEffect hook
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;
    
        // Now append the svg element to the ref and set up the viewBox
        const svg = d3.select(svgRef.current)
        .attr('viewBox', `0, 0, ${dimensions.width},${dimensions.height}`)
        //.attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g');
        
    
        const radius = (dimensions.width + dimensions.height)*0.01;
        const nodeDiameter = radius * 2;
    
        // Definer grafen/hieraki
        const hierarchyRoot = d3.hierarchy(TreeData_H);
    
        // definer tree layout
        const treeLayout = d3.tree()
          .size([width, height])
          .nodeSize([nodeDiameter, nodeDiameter*2.3])  // Specifies the fixed size of each node
          .separation((a, b) => a.parent == b.parent ? 2 : 3.5);
       
          treeLayout(hierarchyRoot);
    
        // Calculate the vertical offset based on the 'Tone' node
          const toneNode = hierarchyRoot.descendants().find(d => d.data.name === "Tone");
          const yOffset = height / 2 - toneNode.y;  // Center vertically around 'Tone'
          const xOffset = width / 2 - toneNode.x;  // Center horizontally

        // Apply transformation to center the tree
        const group = svg.append('g')
        .attr('transform', `translate(${xOffset},${yOffset})`);  

        hierarchyRoot.descendants().forEach(node => {
          node.y = height - node.y - margin.bottom; // This will flip the tree
    
          // Update the x and y attributes of the nodes and links
          node.x += margin.left;
          node.y += margin.top;

          setNodePositions(prevPositions => ({
            ...prevPositions,
            [node.data.name]: { x: node.x, y: node.y }
        }));

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
          .attr('d', d => linksGenerator({ source: d.source, target: { x: d.source.x, y: d.source.y }})) // Start link at source node
          .attr("d", linksGenerator); // Update the d attribute here
          
 
  

        // lager et kartover hvor nodene er lagd over er
        const nodesMap = new Map();
        hierarchyRoot.descendants().forEach(d => {
          nodesMap.set(d.data.name, { x: d.x, y: d.y });
        });
       

        const nodeGroups = svg.selectAll(".node")
        .data(hierarchyRoot.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .on("click", (event, d) => {
            handleNodeClick(d3.select(event.currentTarget), d, nodesMap);
        });

    

        // Under tegning av noder
        nodeGroups.each(function(d) {
          const node = d3.select(this);
          node.attr('id', d.data.name); // Sett en ID for enklere seleksjon

          if (d.depth > 12) {
            node.classed('hidden', true);
            // Skjul linker til denne noden siden den er skjult
            d3.selectAll('.link').filter(link => {
              return (link.source === d || link.target === d);
            }).classed('hidden', true);
          }
        });



        // tegner sirkler rundt nodene?  
        nodeGroups.append("circle")
        .attr("r", radius)// Set the radius as needed
        .attr("class", "node-circle")
                

        
        // Function to split text into multiple lines
        function splitText(text, maxLines, maxChars) {
          const words = text.split(/\s+/);
          if (words.length === 1) return [text]; // No need to split if only one word

          const lines = [];
          let currentLine = words[0];

          for (let i = 1; i < words.length; i++) {
            if (currentLine.length + words[i].length + 1 <= maxChars && lines.length < maxLines - 1) { // Check max line width and limit lines
              currentLine += " " + words[i];
            } else {
              lines.push(currentLine);
              currentLine = words[i];
            }
          }
          lines.push(currentLine); // Push the last line
          return lines.slice(0, maxLines); // Ensure only up to maxLines are returned
        }

        // Function to dynamically adjust font size to fit inside the node
        function adjustFontSize(node, radius) {
          let fontSize = parseFloat(node.style("font-size"));
          let bbox = node.node().getBBox();

          while ((bbox.width > radius * 2 || bbox.height > radius * 2) && fontSize > 12) { // Reduce font size if too large
            fontSize -= 1;
            node.style("font-size", `${fontSize}px`);
            bbox = node.node().getBBox();
          }
          while ((bbox.width < radius * 2 - 10 && bbox.height < radius * 2 - 10) && fontSize < 20) { // Increase font size if too small
            fontSize += 1;
            node.style("font-size", `${fontSize}px`);
            bbox = node.node().getBBox();
          }
        }







        // Tegner tekst i nodene med dynamisk sizing and multi-line handling
        nodeGroups.each(function(d) {
          const node = d3.select(this);
          const lines = splitText(d.data.name, 3, 10); // Allow up to 3 lines, max 10 characters per line
          const text = node.append("text")
            .attr("dy", "-0.5em")
            .style("text-anchor", "middle");

          text.selectAll("tspan")
            .data(lines)
            .enter().append("tspan")
            .attr("x", 0)
            .attr("dy", (d, i) => `${i * 0.9}em`) // Adjust line height
            .text(d => d);

          adjustFontSize(text, radius); // Start with a reasonable default font size
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
          .on("mouseover", function(event, d) {
    
        // Vis informasjonsboks med informasjon fra linken
        d3.select("#link-info")
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY + 10) + "px")
              .select("#link-text")
              .text(d.description); // Anta at hver link har en 'description' eiendom
        
            d3.select("#link-info").classed("hidden", false);
          })
          .on("mouseout", function() {
            // Skjul informasjonsboksen
            d3.select("#link-info").classed("hidden", true);  
          });    
    
    
      
    
        // After the tree layout is computed
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
        hierarchyRoot.each(node => {
          if (node.x < minX) minX = node.x;
          if (node.x > maxX) maxX = node.x;
          if (node.y < minY) minY = node.y;
          if (node.y > maxY) maxY = node.y;
        });
        
    
        setTimeout(() => {
          setIsTreeVisible(true);
        }, 50);
  };

  // useEffect for å sette initielle dimensjoner og tegne treet ved oppstart
  useEffect(() => {
    const updateDimensions = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        if (!dimensions) { // Sett dimensjoner kun en gang ved initialisering
            setDimensions({ width, height });
        }
    };

    updateDimensions(); // Sett dimensjoner ved oppstart
    // Ikke legg til lytter her for vindusendring
}, []); // Tom avhengighetsliste for å kjøre kun ved første render


  useEffect(() => {
      drawTree();
  },[dimensions]);


  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom()
        .scaleExtent([0.1, 2.3])
        .on('zoom', (event) => {
            svg.select('g').attr('transform', event.transform);
        });

    svg.call(zoom);  // Aktiver zoom og pan før treet tegnes

    drawTree();  // Deretter tegn treet
}, [dimensions]);  // Avhenger av endringer i dimensjoner


  const handleResize = () => {
    // Hent nåværende dimensjoner fra viewport eller container
    const { width, height } = svgRef.current.getBoundingClientRect();
    setDimensions({ width, height });  // Oppdater dimensjonsstaten
};






function updateNodeVisibility(node, shouldShowChildren) {
  if (shouldShowChildren) {
    // Sjekker om barn eksisterer før forsøk på å vise dem
    node.data().children?.forEach(child => {
      d3.select(`[id='${child.data.name}']`).classed('hidden', false);
    });
  } else {
    // Skjul alle noder, men vis toppnivå nodene
    d3.selectAll('.node').classed('hidden', true);
    d3.selectAll('[id]').classed('hidden', false); // Anta at dette er toppnivå nodene
  }
}


// Håndter klikk på node
function handleNodeClick(node, d, nodesMap) {
 
  const nodeName = d.data.name;
    // Sjekk om noden allerede er lagret
    if (!nodePositions[nodeName]) {
        // Lagre den originale posisjonen hvis den ikke allerede er lagret
        setNodePositions(prev => ({
            ...prev,
            [nodeName]: { x: node.x, y: node.y }
        }));
    }

  const isHighlighted = node.classed('highlighted');
  const isFocused = node.classed('inFocus');

  if (!isHighlighted && !isFocused) {
    // Clicked on a visible node, highlight it
    highlightNode(node, d, nodesMap);
  } else if (isHighlighted && !isFocused) {
    // Clicked on a highlighted node, focus it and remove highlight
    focusNode(node, d, nodesMap);
  } else if (isFocused) {
    // Clicked on a node in focus, highlight it and remove focus
    highlightNode(node, d, nodesMap);
  }

  // Update other nodes to ensure only one node is highlighted or in focus
  d3.selectAll('.node').each(function() {
    const currentNode = d3.select(this);
    if (currentNode.node() !== node.node()) {
      currentNode.classed('highlighted', false).classed('inFocus', false);
    }
  });
 }



//Highligher node
function highlightNode(node, d, nodesMap) {
console.log("nodesMap in highlightNode",nodesMap);
  // Move the node to its original position from nodesMap
  const nodeName = d.data.name;
  const originalPosition = nodePositions[nodeName];

  if (originalPosition) {
      node.attr('transform', `translate(${originalPosition.x}, ${originalPosition.y})`);
  }
  
  // Update the node's class
  node.classed('highlighted', true).classed('inFocus', false);

  // Make the node's children visible
  node.selectAll('circle').each(function() {
    d3.select(this).classed('hidden', false);
  });
}


//Fokuserer node
function focusNode(node, d, nodesMap) {
  console.log("focusNode", node, d, nodesMap);  
  // Move the node to (100, 100)
  node.attr('transform', `translate(100, 100)`);

  // Update the node's class
  node.classed('highlighted', false).classed('inFocus', true);

  // Make the node's children invisible
  node.selectAll('circle').each(function() {
    d3.select(this).classed('hidden', true);
  });
  /*
  const infoContainer = d3.select('#node-info-container').html('')
    .append('div').attr('class', 'node-info visible')
    .html(`<strong>Name:</strong> ${nodeData.name}<br><strong>Description:</strong> ${nodeData.description}`);
    */
}




// Legg til event handlers
d3.selectAll('.node-circle').on('click', function(event, d) {
  const d3Node = d3.select(this);  // Klart definert D3 seleksjon
  handleNodeClick(d3Node);
});













// Function to handle dropdown change
const handleDropdownChange = (event) => {
  const selectedOption = event.target.value;
  let newImageSource = '';

  switch (selectedOption) {
    case 'option1':
      newImageSource = '/C_Major_Scale_Sheet.png';
      break;
    case 'option2':
      newImageSource = '/C_Major_Scale_Tab.png';
      break;
    // Add more cases for other options
    default:
      break;
  }

  setImageSource(newImageSource);
};



  return (
  <div>
    <img src={imageSource} alt="chosen picture" className={`dropdown-picture ${isInFocus ? 'visible' : 'hidden'}`} />
    <svg ref={svgRef} className={`tree-container ${isTreeVisible ? 'visible' : ''}`} width={dimensions.width} height={dimensions.height}></svg>
    <div id="node-info-container"></div>
    <select className={`dropdown-menu ${isInFocus ? 'visible' : 'hidden'}`} onChange={handleDropdownChange}>
      <option value="option1">Noter</option>
      <option value="option2">Tabs</option>
      {/* Add more options as needed */}
    </select>
    <audio controls src='/c-major-scale.mp3'className={`audio ${isInFocus ? 'visible' : 'hidden'}`}>Your browser does not support the audio element.</audio>
    {/*<button className="back-button" onClick={handleBackClick}>Back</button>*/}
    <button className="rescale-button" onClick={handleResize}>Rescale Tree</button>
  <div id="link-info" className="hidden">
      <p id="link-text"></p>
    </div>
  </div>
  );
}

export default TreeVisualization