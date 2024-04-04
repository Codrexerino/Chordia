//Data over all of hierachical nodes
export const TreeData_H = {
    name: "Harmony",
    children: [
      { 
        name: "Scales", 
        children: [
          { name: "Major scale" }
        ] 
      },
      { 
        name: "Intervals", 
        children: [
          { name: "Perfect Intervals" },
          { name: "Major and Minor Intervals" }
        ]
      },
      { 
        name: "Chords", 
        children: [
          { name: "Major Chords" },
          { name: "Minor Chords" }
        ] 
      }
    ]
   
  };
  

//Cross-hierarchical linker

export const TreeData_C = [
    { source: "Scales", target: "Intervals" },
    { source: "Intervals", target: "Chords" },
    { source: "Chords", target: "Scales" },
    { source: "Scales", target: "Chords" }
    
  ];
  