// Track indices: 0=kick 1=snare 2=hhclose 3=hhopen 4=clap 5=tomlo 6=tomhi
//               7=rim 8=cowbell 9=crash 10=ride 11=shaker 12=congahi 13=congalo 14=clave 15=woodblk

function makeBundle(steps, swing, fillFn, activeIndices) {
  const pattern = Array(16).fill(null).map(() => Array(32).fill(false));
  fillFn(pattern);
  return {
    stepCount: steps,
    swing,
    pattern,
    velocities: Array(16).fill(null).map(() => Array(32).fill(0.8)),
    activeTrackIndices: activeIndices,
    tracks: Array(16).fill(null).map(() => ({ muted: false, solo: false, volume: 1.0, fxSend: 0.0 })),
  };
}

export const SONG_PRESETS = [
  {
    name: 'House',
    description: '4-on-the-floor kick with steady 8th hi-hats',
    bpm: 128,
    activePatternId: 'A',
    songChain: ['A'],
    patterns: {
      A: makeBundle(16, 0, p => {
        [0,4,8,12].forEach(s => { p[0][s] = true; });
        [4,12].forEach(s => { p[1][s] = true; });
        [0,2,4,6,8,10,12,14].forEach(s => { p[2][s] = true; });
      }, [0,1,2]),
    },
  },
  {
    name: 'Boom Bap',
    description: 'Hip-hop swing with syncopated kick',
    bpm: 88,
    activePatternId: 'A',
    songChain: ['A'],
    patterns: {
      A: makeBundle(16, 20, p => {
        [0,6,8,14].forEach(s => { p[0][s] = true; });
        [4,12].forEach(s => { p[1][s] = true; });
        [0,2,4,6,8,10,12].forEach(s => { p[2][s] = true; });
      }, [0,1,2]),
    },
  },
  {
    name: 'Funk',
    description: 'Syncopated 16th-note groove with open hi-hat',
    bpm: 105,
    activePatternId: 'A',
    songChain: ['A'],
    patterns: {
      A: makeBundle(16, 8, p => {
        [0,3,8,11].forEach(s => { p[0][s] = true; });
        [4,12].forEach(s => { p[1][s] = true; });
        [0,2,4,5,6,8,10,11,12,14].forEach(s => { p[2][s] = true; });
        [6].forEach(s => { p[3][s] = true; });
      }, [0,1,2,3]),
    },
  },
  {
    name: 'Reggae',
    description: 'One-drop feel with offbeat hi-hats',
    bpm: 78,
    activePatternId: 'A',
    songChain: ['A'],
    patterns: {
      A: makeBundle(16, 0, p => {
        [8].forEach(s => { p[0][s] = true; });
        [8].forEach(s => { p[1][s] = true; });
        [2,6,10,14].forEach(s => { p[2][s] = true; });
        [0,4,8,12].forEach(s => { p[7][s] = true; });
      }, [0,1,2,7]),
    },
  },
  {
    name: 'Afrobeat',
    description: 'Polyrhythmic kick, shaker pulse, son clave',
    bpm: 112,
    activePatternId: 'A',
    songChain: ['A'],
    patterns: {
      A: makeBundle(16, 0, p => {
        [0,3,6,9,12].forEach(s => { p[0][s] = true; });
        [4,10].forEach(s => { p[1][s] = true; });
        Array.from({length:16},(_,i)=>i).forEach(s => { p[11][s] = true; });
        [0,3,6,10,12].forEach(s => { p[14][s] = true; });
      }, [0,1,11,14]),
    },
  },
  {
    name: 'Breakbeat',
    description: 'Classic broken groove with off-beat snare hits',
    bpm: 140,
    activePatternId: 'A',
    songChain: ['A'],
    patterns: {
      A: makeBundle(16, 0, p => {
        [0,10].forEach(s => { p[0][s] = true; });
        [4,6,12,14].forEach(s => { p[1][s] = true; });
        [0,2,3,4,6,7,8,10,11,12,14,15].forEach(s => { p[2][s] = true; });
      }, [0,1,2]),
    },
  },
  {
    name: 'Latin',
    description: 'Son clave, congas, and shaker groove',
    bpm: 120,
    activePatternId: 'A',
    songChain: ['A'],
    patterns: {
      A: makeBundle(16, 0, p => {
        [0,8].forEach(s => { p[0][s] = true; });
        [4,12].forEach(s => { p[4][s] = true; });
        [0,2,4,6,8,10,12,14].forEach(s => { p[11][s] = true; });
        [2,6,10,14].forEach(s => { p[12][s] = true; });
        [0,8].forEach(s => { p[13][s] = true; });
        [0,3,6,10,12].forEach(s => { p[14][s] = true; });
      }, [0,4,11,12,13,14]),
    },
  },
  {
    name: 'Minimal Techno',
    description: 'Sparse kick, rim on 2 and 4, offbeat ride',
    bpm: 135,
    activePatternId: 'A',
    songChain: ['A'],
    patterns: {
      A: makeBundle(16, 0, p => {
        [0,8].forEach(s => { p[0][s] = true; });
        [0,2,4,6,8,10,12,14].forEach(s => { p[2][s] = true; });
        [4,12].forEach(s => { p[7][s] = true; });
        [2,6,10,14].forEach(s => { p[10][s] = true; });
      }, [0,2,7,10]),
    },
  },
];
