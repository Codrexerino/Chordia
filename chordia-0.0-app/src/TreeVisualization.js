import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3';
import './TreeVisualization.css';
import { TreeData_H, TreeData_C } from './TreeData.js';


function TreeVisualization() {
  const svgRef = useRef(null);
  const [selectedNodeKey, setSelectedNodeKey] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [isInFocus, setIsInFocus] = useState(false);
  const [imageSource, setImageSource] = useState('');
  const [nodePositions, setNodePositions] = useState({});


  const triangles = {
    "Pitch": { center: { x: 1/3 * dimensions.width, y: 1/3 * dimensions.height }, color: "#a2cc8d" },
    "Timbre": { center: { x: 2/3 * dimensions.width, y: 1/3 * dimensions.height }, color: "#845422" },
    "Rhythm": { center: { x: dimensions.width / 2, y: 2/3 * dimensions.height }, color: "#466648" }
};


  const drawTree = () => {
        //fjerner alle tidligere elementer  
        d3.select(svgRef.current).selectAll('*').remove();

     
        // Now append the svg element to the ref and set up the viewBox
        const svg = d3.select(svgRef.current)
        .attr('viewBox', `0, 0, ${dimensions.width},${dimensions.height}`)
        .append('g');

       
        //radius og diameter på noder basert på viewport?
        const radius = (dimensions.width + dimensions.height)*0.01;
        const nodeDiameter = radius * 2;
       
        const root = d3.hierarchy(TreeData_H, d => d.children);
        root.each(node => {
            node.data.id =(node.data.name); // Bruk normalizeId her
            if (node.parent) {
                node.data.parentId = node.parent.data.id;
            } else {
                node.data.parentId = 'root';
            }
        });


        const nodes = root.descendants();
        const links = root.links();


        



        const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(root.links())
          .id(d => d.id)
          .distance(50)
          .strength(link => link.source.data.parentId === link.target.data.parentId ? 0.9 : 0.1))
        .force("charge", d3.forceManyBody().strength(d => customCharge(d)))
        .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
        .force("collide", d3.forceCollide((d) => 10 + 5 * d.depth))
        .force("placement", forcePlacement())
        .on("tick", ticked);
    

        function customCharge(d) {
          return d.data.parentId === 'root' ? -500 : -100;
        }


      function forcePlacement() {
        return function(alpha) {
            nodes.forEach(node => {
                const category = node.data.category; // This is set during the hierarchy creation
                if (triangles[category]) {
                    const target = triangles[category];
                    node.x += (target.center.x - node.x) * 0.5 * alpha; // Adjusting the strength as needed
                    node.y += (target.center.y - node.y) * 0.5 * alpha;
                }
            });
        };
      }



      // Definerer oppdateringsfunksjonen for simuleringen
      function ticked() {
          // Oppdater linker

          linkPaths.attr("d", d => {
          const dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy) * 2;  // Multiplier to exaggerate the curve
          return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
          });


          // Oppdater noder
          nodeGroups.attr("transform", d => `translate(${d.x}, ${d.y})`);

          // Oppdater tekst
          nodeGroups.select("text")
            .attr("y", d => nodeDiameter / 2);  // Juster vertikal posisjon for lesbarhet
        }

      

        // Tegn noder
        const nodeGroups = svg.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("id", d => `node-${d.data.name}`) 
            .classed("hidden", d => !isInitiallyVisible(d))
            .on("mouseover", function(event, d) {
              highlightNode(d3.select(this), true); // Highlight node på mouseover
          })
          .on("mouseout", function(event, d) {
              highlightNode(d3.select(this), false); // Fjern highlight på mouseout
          })
          .on("click", function(event, d) {
              toggleVisibility(d); // Kall toggleVisibility når en node klikkes
          });
       

            
            function highlightNode(nodeSelection, d) {
                // Fjerner highlight fra alle noder først
                d3.selectAll('.node').classed('highlighted', false);
                // Setter 'highlighted' klassen på den valgte noden
                nodeSelection.classed('highlighted', true);
            }


    


        // Tegn linker
        const linkPaths = svg.selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .attr("id", d => `link-${d.source.data.name}-to-${d.target.data.name}`); // Legger til unik ID
            //.classed("hidden", d => !isInitiallyVisible(d.source) || !isInitiallyVisible(d.target));  // Skjuler linker basert på nodenes synlighet    
            




              function isInitiallyVisible(d) {
                return d.depth <= 1; // Returnerer true for noder med dybde 0 eller 1
              }

            

              function toggleVisibility(d) {
                // Finn og toggle synlighet for alle direkte barn
                const children = d3.selectAll('.node')
                    .filter(node => node.parent === d)
                    .classed('hidden', function() {
                        return !d3.select(this).classed('hidden');
                    });
            }




        // tegner sirkler?  
         nodeGroups.append("circle")
         .attr("r", nodeDiameter / 2)
   


     

       




        // tekst splitting til noder
        // Funksjon for å dele tekst inn i flere linjer
        function splitText(text, maxLines, maxChars) {
          const words = text.split(/\s+/);
          if (words.length === 1) return [text]; // Ingen behov for å dele hvis det kun er ett ord

          const lines = [];
          let currentLine = words[0];

          for (let i = 1; i < words.length; i++) {
            if (currentLine.length + words[i].length + 1 <= maxChars && lines.length < maxLines - 1) { // Sjekk maks linjebredde og begrens linjer
              currentLine += " " + words[i];
            } else {
              lines.push(currentLine);
              currentLine = words[i];
            }
          }
          lines.push(currentLine); // Legg til siste linje
          return lines.slice(0, maxLines); // Sikrer at kun opp til maxLines returneres
        }

        // Funksjon for å dynamisk justere skriftstørrelsen for å passe inni noden
        function adjustFontSize(node, radius) {
          let fontSize = parseFloat(node.style("font-size"));
          let bbox = node.node().getBBox();

          while ((bbox.width > radius * 2 || bbox.height > radius * 2) && fontSize > 12) { // Reduser skriftstørrelse hvis for stor
            fontSize -= 1;
            node.style("font-size", `${fontSize}px`);
            bbox = node.node().getBBox();
          }
          while ((bbox.width < radius * 2 - 10 && bbox.height < radius * 2 - 10) && fontSize < 20) { // Øk skriftstørrelse hvis for liten
            fontSize += 1;
            node.style("font-size", `${fontSize}px`);
            bbox = node.node().getBBox();
          }
        }

        nodeGroups.each(function(d) {
          const node = d3.select(this);
          const lines = splitText(d.data.name, 3, 10);  // Tillater opp til 3 linjer, maks 10 tegn per linje
          const text = node.append("text")
            .attr("dy", "-0.3em")
            .style("text-anchor", "middle")
            .attr("class", "node-text")
          text.selectAll("tspan")
            .data(lines)
            .enter().append("tspan")
            .attr("x", 0)
            .attr("dy", (d, i) => `${i * 1.5}em`)  // Juster linjehøyden
            .text(d => d);

          adjustFontSize(text, nodeDiameter / 2);  
      });

    
     
      

       // Start simulation
        simulation.nodes(nodes);
        simulation.force("link").links(links);
            
      };  
  /*
        const treeLayout = d3.cluster()
          .size([360, radius - 50])
          .nodeSize([nodeDiameter, nodeDiameter]);  // Specifies the fixed size of each node
          //.separation((a, b) => a.parent == b.parent ? 2 : 2);
       
        treeLayout(root);

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        root.each(node => {
          minX = Math.min(minX, node.x);
          maxX = Math.max(maxX, node.x);
          minY = Math.min(minY, node.y);
          maxY = Math.max(maxY, node.y);
        });
        
        


        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const translateX = (dimensions.width/2) - centerX;
        const translateY = (dimensions.height/2)  - centerY;
        
        svg.attr('transform', `translate(${translateX}, ${translateY})`);




        const project = (x, y) => {
          const angle = (x - 90) / 180 * Math.PI;
          const radius = y;
          return [
              radius * Math.cos(angle),
              radius * Math.sin(angle)
          ];
      };
      
    
    
        // Manuell justering av x og y verdier for Pitch, Timbre, og Rhythm
        const keyNodes = ["Pitch", "Timbre", "Rhythm"];
        const angles = [90, 210, 330];  // Deler sirkelen i tre like deler
        root.descendants().forEach((d, i) => {
            if (keyNodes.includes(d.data.name)) {
                d.x = angles[keyNodes.indexOf(d.data.name)];
                d.y = radius / 2; // Plasserer disse nodene i samme radius
            }
        });
*/


     /* 

        // Definerer linker basert på hierakial verdier
    
        const linksGenerator = d3.linkRadial()
        .angle(d => d.x * Math.PI / 180)
        .radius(d => d.y);
        
    
         
        // tegner linker
        svg.selectAll(".link")
          .data(root.links())
          .enter().append("path")
        .attr("class", "link")
        .attr('d', linksGenerator);
  
          
 
  

        // lager et kartover hvor nodene er lagd over er
        const nodesMap = new Map();
        root.descendants().forEach(d => {
          nodesMap.set(d.data.name, { x: d.x, y: d.y });
        });
       


    
        const nodeGroups = svg.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${project(d.x, d.y)})`)
        .on("click", (event, d) => {
            handleNodeClick(d3.select(event.currentTarget), d, nodesMap);
        });

    

        // id for noder???
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

        // Reduserer radius basert på dybde
        const nodeRadius = d => 5 + (30 - d.depth * 2);  

        // tegner sirkler rundt nodene?  
        nodeGroups.append("circle")
        .attr("r", nodeRadius)// Set the radius as needed
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
  

  };
*/      

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


/*

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
    
}




// Legg til event handlers
d3.selectAll('.node-circle').on('click', function(event, d) {
  const d3Node = d3.select(this);  // Klart definert D3 seleksjon
  handleNodeClick(d3Node);
});


*/










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
    <svg ref={svgRef} className={"tree-container"}></svg>
    <img src={imageSource} alt="chosen picture" className={`dropdown-picture ${isInFocus ? 'visible' : 'hidden'}`} />
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