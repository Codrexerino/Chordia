//Data over all of hierachical nodes
export const TreeData_H = {
  name: "Tone",
  description: "Tones are the smallest component of music. It happens when we play one key on the piano, one string on the guitar, or sing etc. A tone has pitch, rythm and timbre.",
  children: [
    {
      name: "Pitch",
      description: "Music works on 3 different axis, pitch, time and timbre. Pitch is how high or low a given tone is. A fire alarm has a higher pitch, while a washing machine has a lower pitch",
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
                  children: [
                    {
                        name: "Lydian",
                        description: "",
                        children: []
                      },
                      {
                        name: "Ionian",
                        description: "",
                        children: []
                      },
                      {
                        name: "Mixolydian",
                        description: "",
                        children: []
                      },
                      {
                        name: "Dorian",
                        description: "",
                        children: []
                      },
                      {
                        name: "Aeolian",
                        description: "",
                        children: []
                      },
                      {
                        name: "Phrygian",
                        description: "",
                        children: []
                      },
                      {
                        name: "Locrian",
                        description: "",
                        children: []
                      }
                  ]
                },
                {
                  name: "Major Pentatonic",
                  description: "Description",
                  children: []
                }
              ]
            },
            {
              name: "Minor scale",
              description: "Description",
              children: [
                {
                  name: "Modal Scales",
                  description: "Description",
                  children: []
                },
                {
                  name: "Minor Pentatonic",
                  description: "Description",
                  children: []
                }
              ]
            },
            {
              name: "Melody",
              description: "Description",
              children: [
                {
                  name: "Phrasing",
                  description: "Description",
                  children: []
                }
              ]
            }
          ]
        },
        {
          name: "Intervals",
          description: "Intervals are the distance between two notes. From C to G on the piano is a fifth for example.",
          children: [
            {
              name: "Perfect Intervals",
              description: "Description",
              children: [
                {
                  name: "Augmented/Diminished Intervals",
                  description: "Description",
                  children: []
                }
              ]
            },
            {
              name: "Major/Minor Intervals",
              description: "Description",
              children: []
            }
          ]
        },
        {
          name: "Chords",
          description: "Chords happen when we play multiple notes at the same time, usually 3 or more. This means that we can have intervals inside of our chords, but not the other way around.",
          children: [
            {
              name: "Major Chords",
              description: "Description",
              children: [
                {
                  name: "Augmented/Diminished Chords",
                  description: "Description",
                  children: [
                    {
                      name: "Suspended Augmented/Diminished Chords",
                      description: "Description",
                      children: []
                    }
                  ]
                },
                {
                  name: "Seventh Chords",
                  description: "Description",
                  children: [
                    {
                      name: "Ninth Chords",
                      description: "Description",
                      children: []
                    }
                  ]
                },
                {
                  name: "Suspended Chords",
                  description: "Description",
                  children: []
                },
                {
                  name: "Add Chords",
                  description: "Description",
                  children: []
                }
              ]
            },
            {
              name: "Minor Chords",
              description: "Description",
              children: [
                {
                  name: "Seventh Chords",
                  description: "Description",
                  children: [
                    {
                      name: "Ninth Chords",
                      description: "Description",
                      children: []
                    }
                  ]
                },
                {
                  name: "Suspended Chords",
                  description: "Description",
                  children: []
                },
                {
                  name: "Add Chords",
                  description: "Description",
                  children: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Rythm",
      description: "Description",
      children: [
        {
          name: "Pulse",
          description: "",
          children: [
            {
              name: "Subdivisions",
              description: "",
              children: [
                {
                  name: "Meter",
                  description: "",
                  children: [
                    {
                      name: "Duple Meter",
                      description: "",
                      children: [
                        {
                          name: "Odd Meter",
                          description: "",
                          children: [
                            {
                              name: "Irrational Meter",
                              description: "",
                              children: []
                            },
                            {
                              name: "Polymeter",
                              description: "",
                              children: [
                                {
                                  name: "Metric Modulation",
                                  description: "",
                                  children: []
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      name: "Triple Meter",
                      description: "",
                      children: []
                    }
                  ]
                },
                {
                  name: "Duple Subdivisions",
                  description: "",
                  children: [
                    {
                      name: "Odd Subdivisions",
                      description: "",
                      children: [
                        {
                          name: "Polyrhythm",
                          description: "",
                          children: []
                        }
                      ]
                    }
                  ]
                },
                {
                  name: "Triple Subdivisions",
                  description: "",
                  children: []
                }
              ]
            },
            {
              name: "Felt Pulse",
              description: "",
              children: [
                {
                  name: "Metronome",
                  description: "",
                  children: []
                },
                {
                  name: "Feel",
                  description: "",
                  children: [
                    {
                      name: "MicroRythms",
                      description: "",
                      children: []
                    }
                  ]
                }
              ]
            },
            {
              name: "Responding Pulse",
              description: "",
              children: [
                {
                  name: "Conductor",
                  description: "",
                  children: []
                },
                {
                  name: "Lead Singer",
                  description: "",
                  children: []
                }
              ]
            },
            {
              name: "Pulse Changes",
              description: "",
              children: [
                {
                  name: "Rational Changes",
                  description: "",
                  children: [
                    {
                      name: "HalfTime",
                      description: "",
                      children: []
                    },
                    {
                      name: "DoubleTime",
                      description: "",
                      children: []
                    }
                  ]
                },
                {
                  name: "Irrational Changes",
                  description: "",
                  children: [
                    {
                      name: "Ritardando",
                      description: "",
                      children: []
                    },
                    {
                      name: "Accelerando",
                      description: "",
                      children: []
                    },
                    {
                      name: "Time Shift",
                      description: "",
                      children: []
                    }
                  ]
                }
              ]  
            }
          ]
        }
      ]
    },
    {
      name: "Timbre",
      description: "Description",
      children: [
        {
            name: "Sound Generation",
            description: "",
            children: [
                {
                    name: "Chordophones",
                    description: "",
                    children: [
                      {
                        name: "Plucked",
                        description: "",
                        children: [
                          {
                            name: "Guitar",
                            description: "",
                            children: [
                              {
                                name: "Electric Guitar",
                                description: "",
                                children: []
                              }
                            ]
                          },
                          {
                            name: "Bass Guitar",
                            description: "",
                            children: [
                              {
                                name: "Electric Bass Guitar",
                                description: "",
                                children: []
                              }
                            ]
                          },
                          {
                            name: "Banjo",
                            description: "",
                            children: []
                          },
                          {
                            name: "Mandolin",
                            description: "",
                            children: []
                          },
                          {
                            name: "Ukulele",
                            description: "",
                            children: []
                          },
                          {
                            name: "Lute",
                            description: "",
                            children: []
                          },
                          {
                            name: "Sitar",
                            description: "",
                            children: []
                          },
                          {
                            name: "Harp",
                            description: "",
                            children: []
                          }
                        ]
                      },
                      {
                        name: "Bowed",
                        description: "",
                        children: [
                          {
                            name: "Violin Family",
                            description: "",
                            children: [
                              {
                                name: "Violin",
                                description: "",
                                children: [
                                  {
                                    name: "Electric Violin",
                                    description: "",
                                    children: []
                                  }
                                ]
                              },
                              {
                                name: "Viola",
                                description: "",
                                children: []
                              },
                              {
                                name: "Cello",
                                description: "",
                                children: []
                              },
                              {
                                name: "Double Bass",
                                description: "",
                                children: []
                              }
                            ]
                          },
                          {
                            name: "Huqin Family",
                            description: "",
                            children: [
                              {
                                name: "Jinghu",
                                description: "",
                                children: []
                              },
                              {
                                name: "Gaohu",
                                description: "",
                                children: []
                              },
                              {
                                name: "Erhu",
                                description: "",
                                children: []
                              },
                              {
                                name: "Zhonghu",
                                description: "",
                                children: []
                              }
                            ]
                          }
                        ]
                      },
                      {
                        name: "Strucked",
                        description: "",
                        children: [
                          {
                            name: "Piano",
                            description: "",
                            children: []
                          },
                          {
                            name: "Dulcimer",
                            description: "",
                            children: []
                          }
                        ]
                      }
                    ]
                },
                {
                    name: "Membranophones",
                    description: "",
                    children: [
                      {
                        name: "Djembe",
                        description: "",
                        children: []
                      },
                      {
                        name: "Tabla",
                        description: "",
                        children: []
                      },
                      {
                        name: "Snare Drum",
                        description: "",
                        children: []
                      },
                      {
                        name: "Congas",
                        description: "",
                        children: []
                      },
                      {
                        name: "Bass Drum",
                        description: "",
                        children: [
                          {
                            name: "Drumset",
                            description: "",
                            children: []
                          }
                        ]
                      }
                    ]
                },
                {
                    name: "Idoiophones",
                    description: "",
                    children: [
                      {
                        name: "Cymbals",
                        description: "",
                        children: []
                      },
                      {
                        name: "Marimba",
                        description: "",
                        children: []
                      },
                      {
                        name: "Glockenspiel",
                        description: "",
                        children: []
                      }
                    ]
                },
                {
                    name: "Aerophones",
                    description: "",
                    children: [
                      {
                        name: "Woodwinds",
                        description: "",
                        children: [
                          {
                            name: "Saxophone",
                            description: "",
                            children: []
                          },
                          {
                            name: "Oboe",
                            description: "",
                            children: []
                          },
                          {
                            name: "Flute",
                            description: "",
                            children: []
                          },
                          {
                            name: "Shakuhachi",
                            description: "",
                            children: []
                          }
                        ]
                      },
                      {
                        name: "Brass",
                        description: "",
                        children: [
                          {
                            name: "Tuba",
                            description: "",
                            children: []
                          },
                          {
                            name: "Trumpet",
                            description: "",
                            children: []
                          },
                          {
                            name: "Trombone",
                            description: "",
                            children: []
                          }
                        ]
                      },
                      {
                        name: "Free",
                        description: "",
                        children: [
                          {
                            name: "Harmonica",
                            description: "",
                            children: []
                          },
                          {
                            name: "Accordion",
                            description: "",
                            children: []
                          }
                        ]
                      },
                      {
                        name: "Voice",
                        description: "",
                        children: []
                      }
                    ]
                },
                {
                    name: "Electrophones",
                    description: "",
                    children: [
                      {
                        name: "Electroacoustic",
                        description: "",
                        children: []
                      },
                      {
                        name: "Digital",
                        description: "",
                        children: [
                          {
                            name: "Synthesizer",
                            description: "",
                            children: [
                              {
                                name: "Subtractive",
                                description: "",
                                children: []
                              },
                              {
                                name: "Additive",
                                description: "",
                                children: []
                              },
                              {
                                name: "FM",
                                description: "",
                                children: []
                              },
                              {
                                name: "Physical Modeling",
                                description: "",
                                children: []
                              }
                            ]
                          },
                          {
                            name: "Software",
                            description: "",
                            children: [
                              {
                                name: "VST plugins",
                                description: "",
                                children: []
                              }
                            ]
                          }
                        ]
                      }
                    ]
                }
            ]
          },
          {
            name: "Sound Manipulation",
            description: "",
            children: [
              {
                name: "Analog",
                description: "",
                children: [
                  {
                    name: "Guitar Pedals",
                    description: "",
                    children: [
                      {
                        name: "Reverb",
                        description: "",
                        children: []
                      },
                      {
                        name: "EQ",
                        description: "",
                        children: []
                      },
                      {
                        name: "Delay",
                        description: "",
                        children: []
                      },
                      {
                        name: "Compressor",
                        description: "",
                        children: []
                      },
                      {
                        name: "Distortion",
                        description: "",
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                name: "Digital",
                description: "",
                children: [
                  {
                    name: "DAW",
                    description: "",
                    children: []
                  }
                ]
              },
              {
                name: "Physical Space",
                description: "",
                children: []
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

