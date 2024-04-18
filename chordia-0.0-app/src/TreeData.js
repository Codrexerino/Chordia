//Data over all of hierachical nodes
export const TreeData_H = {
    name: "Harmony",
    description: "Music works on 3 different axis, pitch, time and timbre. Harmony is the part that covers pitch, and is further divided into smaller parts",
    children: [
      {
        name: "Notes",
        description: "Notes are the smallest component of harmony. It happens when we play one key on the piano, one string on the guitar, or sing etc. The relationship of notes can be understood with Scales, Intervals and Chords",
        children: [
          { 
            name: "Scales", 
            description: "Scales are a collection of notes which are arranged in a particular order.",
            children: [
              {
                name: "Major scale",
                description: "Description",
                children: [
                  {
                    name: "Modal Scales",
                    description: "Description",
                  }
                ]
            }
            ] 
          },
          { 
            name: "Intervals", 
            description: "Intervals are the distance between two notes. From C to G on the piano is a fifth for example.",
            children: [
              { name: "Perfect Intervals",
                description: "Description",
              },
              { name: "Major and Minor Intervals",
                description: "Description", 
            }
            ]
          },
          { 
            name: "Chords",
            description: "Chords happen when we play multiple notes at the same time, usally 3 or more. This means that we can have intervals inside of our chords, but not the other way around.", 
            children: [
              { name: "Major Chords",
                description: "Description"
            },
              { name: "Minor Chords",
                description: "Description"
            }
            ] 
          }
        ]
      }
    ]
    
    
   
  };
  

//Cross-hierarchical linker

export const TreeData_C = [
    { source: "Scales", target: "Intervals" },
    { source: "Intervals", target: "Chords", description: "There are intervals inside of chords, a C major chord forexample has a majorthird interval and a perfect 5 interval" },
    { source: "Chords", target: "Scales" },

    
  ];
  