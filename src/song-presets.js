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

function on(p, track, steps) { steps.forEach(s => { p[track][s] = true; }); }
function all16(p, track)      { for (let s = 0; s < 16; s++) p[track][s] = true; }

export const SONG_PRESET_CATEGORIES = [
  {
    name: 'House',
    presets: [
      {
        name: 'Classic House',
        description: '4-on-the-floor kick with steady 8th hi-hats',
        bpm: 128,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); on(p, 1, [4,12]); on(p, 2, [0,2,4,6,8,10,12,14]);
        }, [0,1,2]) },
      },
      {
        name: 'Deep House',
        description: 'Swingy groove with open hi-hat lift before the snare',
        bpm: 122,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); on(p, 1, [4,12]);
          on(p, 2, [0,2,4,6,8,10,12,14]); on(p, 3, [10]);
        }, [0,1,2,3]) },
      },
      {
        name: 'Tech House',
        description: 'Dense 16th hi-hat drive with gaps for tension',
        bpm: 130,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); on(p, 1, [4,12]);
          on(p, 2, [0,2,3,4,6,7,8,10,11,12,14,15]);
        }, [0,1,2]) },
      },
      {
        name: 'Chicago House',
        description: 'Classic 4/4 with clap layered on top of the snare',
        bpm: 126,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); on(p, 1, [4,12]);
          on(p, 2, [0,2,4,6,8,10,12,14]); on(p, 4, [4,12]);
        }, [0,1,2,4]) },
      },
      {
        name: 'Progressive',
        description: 'Open hi-hat lift on every "and of 2" for build',
        bpm: 132,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); on(p, 1, [4,12]);
          on(p, 2, [0,2,4,6,8,10,12,14]); on(p, 3, [6,14]);
        }, [0,1,2,3]) },
      },
      {
        name: 'Lo-Fi House',
        description: 'Shuffled triplet hi-hats with a warm vintage feel',
        bpm: 118,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 6, p => {
          on(p, 0, [0,4,8,12]); on(p, 1, [4,12]);
          on(p, 2, [0,3,6,9,12,15]);
        }, [0,1,2]) },
      },
      {
        name: 'French House',
        description: 'Disco-filtered groove with rim punching the offbeats',
        bpm: 124,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); on(p, 1, [4,12]);
          on(p, 2, [0,2,4,6,8,10,12,14]); on(p, 7, [2,6,10,14]);
        }, [0,1,2,7]) },
      },
      {
        name: 'Acid House',
        description: 'Double kick hits for relentless acid energy',
        bpm: 126,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,3,4,8,11,12]); on(p, 1, [4,12]);
          on(p, 2, [0,2,4,6,8,10,12,14]);
        }, [0,1,2]) },
      },
    ],
  },
  {
    name: 'Boom Bap',
    presets: [
      {
        name: 'Classic',
        description: 'Swinging kick with straight-back snare',
        bpm: 88,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 20, p => {
          on(p, 0, [0,6,8,14]); on(p, 1, [4,12]); on(p, 2, [0,2,4,6,8,10,12]);
        }, [0,1,2]) },
      },
      {
        name: 'MPC Style',
        description: 'Heavy swing with open hat accent on the "and" of 3',
        bpm: 90,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 25, p => {
          on(p, 0, [0,6,8]); on(p, 1, [4,12]);
          on(p, 2, [0,2,4,6,8,10,12,14]); on(p, 3, [10]);
        }, [0,1,2,3]) },
      },
      {
        name: 'Golden Era',
        description: 'Mid-90s loose-feel kick placement, light swing',
        bpm: 85,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 15, p => {
          on(p, 0, [0,5,8,13]); on(p, 1, [4,12]); on(p, 2, [0,2,4,5,6,8,10,12,14]);
        }, [0,1,2]) },
      },
      {
        name: 'Grimy',
        description: 'Extra snare ghost note with chopped hi-hats',
        bpm: 92,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 18, p => {
          on(p, 0, [0,6,10]); on(p, 1, [4,9,12]); on(p, 2, [0,2,3,4,6,8,10,11,12,14]);
        }, [0,1,2]) },
      },
      {
        name: 'Dusty Vinyl',
        description: 'Chopped loop feel with open hat landing on beat 3',
        bpm: 84,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 22, p => {
          on(p, 0, [0,8,10]); on(p, 1, [4,12]);
          on(p, 2, [0,2,4,6,10,12,14]); on(p, 3, [8]);
        }, [0,1,2,3]) },
      },
      {
        name: 'East Coast',
        description: 'Straight NYC feel, kick locked on the one and three',
        bpm: 94,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 16, p => {
          on(p, 0, [0,6,8,12]); on(p, 1, [4,12]); on(p, 2, [0,2,4,6,8,10,12,14]);
        }, [0,1,2]) },
      },
      {
        name: 'West Coast',
        description: 'Laid-back G-funk kick with 16th hi-hat runs',
        bpm: 88,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 12, p => {
          on(p, 0, [0,4,10]); on(p, 1, [4,12]); on(p, 2, [0,2,4,5,6,8,10,12,13,14]);
        }, [0,1,2]) },
      },
      {
        name: 'Trap Meets Bap',
        description: 'Trap 16th hi-hat rolls dropped into a boom bap tempo',
        bpm: 82,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 20, p => {
          on(p, 0, [0,8,10,14]); on(p, 1, [4,12]);
          on(p, 2, [0,1,2,3,4,8,9,10,12,13,14]);
        }, [0,1,2]) },
      },
    ],
  },
  {
    name: 'Funk',
    presets: [
      {
        name: 'Classic Funk',
        description: 'Syncopated kick with open hat on the "and" of 2',
        bpm: 105,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 8, p => {
          on(p, 0, [0,3,8,11]); on(p, 1, [4,12]);
          on(p, 2, [0,2,4,5,6,8,10,11,12,14]); on(p, 3, [6]);
        }, [0,1,2,3]) },
      },
      {
        name: 'JB Style',
        description: 'Relentless 16ths with a polyrhythmic kick line',
        bpm: 108,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 10, p => {
          on(p, 0, [0,3,6,9,12]); on(p, 1, [4,10]); all16(p, 2);
        }, [0,1,2]) },
      },
      {
        name: 'P-Funk',
        description: 'Parliament groove with cowbell riding the downbeats',
        bpm: 102,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 12, p => {
          on(p, 0, [0,4,6,12]); on(p, 1, [4,12]);
          on(p, 2, [0,2,4,6,8,10,12,14]); on(p, 8, [0,4,8,12]);
        }, [0,1,2,8]) },
      },
      {
        name: 'Slap Funk',
        description: 'Tight 16th grid, clap doubles the snare',
        bpm: 110,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 6, p => {
          on(p, 0, [0,2,8,10]); on(p, 1, [4,12]); all16(p, 2); on(p, 4, [4,12]);
        }, [0,1,2,4]) },
      },
      {
        name: 'New Jack Swing',
        description: 'Late-80s swing feel with clap locking on the backbeat',
        bpm: 100,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 15, p => {
          on(p, 0, [0,4,8,12]); on(p, 1, [4,12]);
          on(p, 2, [0,2,3,4,6,8,9,10,12,14,15]); on(p, 4, [4,12]);
        }, [0,1,2,4]) },
      },
      {
        name: 'Memphis Funk',
        description: 'Deep Southern groove with displaced snare hit',
        bpm: 98,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 8, p => {
          on(p, 0, [0,3,6,12]); on(p, 1, [4,10]);
          on(p, 2, [0,2,4,6,8,10,12,14]); on(p, 7, [8]);
        }, [0,1,2,7]) },
      },
      {
        name: 'Breakbeat Funk',
        description: 'Funk meets breakbeat with extra snare on the e-of-4',
        bpm: 112,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,6,10]); on(p, 1, [4,12,14]);
          on(p, 2, [0,2,3,4,6,7,8,10,11,12,14]);
        }, [0,1,2]) },
      },
      {
        name: 'Soul Pocket',
        description: 'Shaker on every 16th upbeat for deep pocket feel',
        bpm: 96,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 10, p => {
          on(p, 0, [0,4,8,12]); on(p, 1, [4,12]);
          on(p, 2, [0,2,4,6,8,10,12,14]); on(p, 11, [1,3,5,7,9,11,13,15]);
        }, [0,1,2,11]) },
      },
    ],
  },
  {
    name: 'Reggae',
    presets: [
      {
        name: 'One Drop',
        description: 'Kick and snare together on beat 3, offbeat hi-hats',
        bpm: 78,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [8]); on(p, 1, [8]);
          on(p, 2, [2,6,10,14]); on(p, 7, [0,4,8,12]);
        }, [0,1,2,7]) },
      },
      {
        name: 'Steppers',
        description: 'Kick on every beat with snare accent on 3',
        bpm: 80,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); on(p, 1, [8]); on(p, 2, [2,6,10,14]);
        }, [0,1,2]) },
      },
      {
        name: 'Rockers',
        description: 'Driving kick and rim combination with snare accents',
        bpm: 76,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); on(p, 1, [4,8,12]);
          on(p, 2, [2,6,10,14]); on(p, 7, [0,4,8,12]);
        }, [0,1,2,7]) },
      },
      {
        name: 'Dub',
        description: 'Sparse and spacious with echo-feel offbeat rim',
        bpm: 72,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,12]); on(p, 1, [8]);
          on(p, 2, [0,4,8,12]); on(p, 7, [2,6,10,14]);
        }, [0,1,2,7]) },
      },
      {
        name: 'Nyahbinghi',
        description: 'Ceremonial Rastafari drum feel with tom pulse',
        bpm: 74,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,6,10]); on(p, 1, [4,12]);
          on(p, 2, [0,4,8,12]); on(p, 5, [2,6,10,14]);
        }, [0,1,2,5]) },
      },
      {
        name: 'Ska',
        description: 'Fast-tempo upstroke emphasis with offbeat accent',
        bpm: 160,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,8]); on(p, 1, [4,12]); on(p, 2, [2,6,10,14]);
        }, [0,1,2]) },
      },
      {
        name: 'Dancehall',
        description: 'Digital riddim with a busy syncopated kick line',
        bpm: 85,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,10,12]); on(p, 1, [4,12]);
          on(p, 2, [0,2,4,6,8,10,12,14]);
        }, [0,1,2]) },
      },
      {
        name: 'Roots',
        description: 'Roots reggae with tom accents dropping on the 3-and',
        bpm: 76,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,8]); on(p, 1, [4,12]);
          on(p, 2, [0,4,8,12]); on(p, 5, [6,14]); on(p, 7, [2,6,10,14]);
        }, [0,1,2,5,7]) },
      },
    ],
  },
  {
    name: 'Afrobeat',
    presets: [
      {
        name: 'Classic Afrobeat',
        description: '5-beat kick cycle running over a son clave pattern',
        bpm: 112,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,3,6,9,12]); on(p, 1, [4,10]);
          all16(p, 11); on(p, 14, [0,3,6,10,12]);
        }, [0,1,11,14]) },
      },
      {
        name: 'Highlife',
        description: 'Steady groove with conga accents on the offbeats',
        bpm: 118,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); on(p, 1, [4,12]);
          on(p, 11, [0,2,4,6,8,10,12,14]); on(p, 12, [2,6,10,14]);
        }, [0,1,11,12]) },
      },
      {
        name: 'Afro House',
        description: 'House pulse fused with clave rhythm and shaker',
        bpm: 124,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); on(p, 1, [4,12]);
          all16(p, 11); on(p, 14, [0,3,6,10,12]);
        }, [0,1,11,14]) },
      },
      {
        name: 'Lagos Groove',
        description: 'Dense polyrhythmic conga conversation over the pulse',
        bpm: 110,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,2,8,10]); on(p, 1, [4,12]);
          all16(p, 11); on(p, 12, [0,3,6,10,13]); on(p, 13, [2,8]);
        }, [0,1,11,12,13]) },
      },
      {
        name: 'Afropop',
        description: 'Pop-friendly groove with syncopated conga upbeats',
        bpm: 120,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); on(p, 1, [4,12]);
          on(p, 11, [0,2,4,6,8,10,12,14]); on(p, 12, [1,5,9,13]);
        }, [0,1,11,12]) },
      },
      {
        name: 'Juju',
        description: 'Yoruba juju feel with wood block talking drum pulse',
        bpm: 108,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,3,8,11]); on(p, 1, [4,12]);
          all16(p, 11); on(p, 14, [0,3,6,10,12]); on(p, 15, [0,4,8,12]);
        }, [0,1,11,14,15]) },
      },
      {
        name: 'Bikutsi',
        description: 'Cameroonian 12/8 feel mapped into a 4/4 frame',
        bpm: 116,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,2,4,6,8,10,12,14]); on(p, 1, [3,7,11,15]); all16(p, 11);
        }, [0,1,11]) },
      },
      {
        name: 'Benga',
        description: 'Kenyan benga rhythm with syncopated kick line',
        bpm: 118,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,6,10,12]); on(p, 1, [4,12]);
          on(p, 11, [0,2,4,6,8,10,12,14]); on(p, 12, [2,8,14]);
        }, [0,1,11,12]) },
      },
    ],
  },
  {
    name: 'Breakbeat',
    presets: [
      {
        name: 'Classic Break',
        description: 'Amen-inspired broken kick and off-beat snare hits',
        bpm: 140,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,10]); on(p, 1, [4,6,12,14]);
          on(p, 2, [0,2,3,4,6,7,8,10,11,12,14,15]);
        }, [0,1,2]) },
      },
      {
        name: 'Funky Drummer',
        description: 'Complex kick with shifting snare placement',
        bpm: 132,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,6,10]); on(p, 1, [4,8,14]);
          on(p, 2, [0,2,4,5,6,8,10,11,12,14]);
        }, [0,1,2]) },
      },
      {
        name: 'Jungle',
        description: 'Fast 16th rolls with sub-bass kick timing',
        bpm: 160,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,10,14]); on(p, 1, [4,6,10,12]); all16(p, 2);
        }, [0,1,2]) },
      },
      {
        name: 'Big Beat',
        description: 'Stadium-sized kick with crash landing on beat 1',
        bpm: 136,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,6,10]); on(p, 1, [4,12]);
          on(p, 2, [0,2,4,6,8,10,12,14]); on(p, 9, [0]);
        }, [0,1,2,9]) },
      },
      {
        name: 'Hip Hop Break',
        description: 'Sampled break feel slowed to hip-hop tempo',
        bpm: 95,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 15, p => {
          on(p, 0, [0,8,12]); on(p, 1, [4,14]); on(p, 2, [0,2,4,6,8,10,12]);
        }, [0,1,2]) },
      },
      {
        name: 'Drum & Bass',
        description: 'Classic two-step D&B kick and snare pattern',
        bpm: 174,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,12]); on(p, 1, [4,8,14]); all16(p, 2);
        }, [0,1,2]) },
      },
      {
        name: 'Trip Hop',
        description: 'Bristol sound dark swing at downtempo pace',
        bpm: 86,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 18, p => {
          on(p, 0, [0,6,10]); on(p, 1, [4,12]); on(p, 2, [0,2,4,6,8,10,12,14]);
        }, [0,1,2]) },
      },
      {
        name: 'Glitch Hop',
        description: 'Fractured kick pattern with chopped hi-hat grid',
        bpm: 110,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,5,8,11,14]); on(p, 1, [4,6,12]);
          on(p, 2, [0,2,3,4,6,8,9,10,12,14]);
        }, [0,1,2]) },
      },
    ],
  },
  {
    name: 'Latin',
    presets: [
      {
        name: 'Son Clave',
        description: 'Classic 3-2 son clave with congas and shaker',
        bpm: 120,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,8]); on(p, 4, [4,12]);
          on(p, 11, [0,2,4,6,8,10,12,14]);
          on(p, 12, [2,6,10,14]); on(p, 13, [0,8]);
          on(p, 14, [0,3,6,10,12]);
        }, [0,4,11,12,13,14]) },
      },
      {
        name: 'Bossa Nova',
        description: 'Gentle cross-rhythm with offbeat rim pattern',
        bpm: 112,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,6,10]); on(p, 2, [0,2,4,6,8,10,12,14]);
          on(p, 7, [3,7,11,15]); on(p, 11, [0,2,4,6,8,10,12,14]);
        }, [0,2,7,11]) },
      },
      {
        name: 'Cumbia',
        description: 'Driving clave and conga texture with full shaker',
        bpm: 115,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); all16(p, 11);
          on(p, 12, [2,6,10,14]); on(p, 13, [0,4,8,12]);
          on(p, 14, [0,3,6,10,12]);
        }, [0,11,12,13,14]) },
      },
      {
        name: 'Salsa',
        description: '2-3 clave, syncopated kick, full energy',
        bpm: 125,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,3,8,11]); on(p, 1, [4,12]); all16(p, 11);
          on(p, 12, [2,5,10,13]); on(p, 14, [2,4,8,11,14]);
        }, [0,1,11,12,14]) },
      },
      {
        name: 'Merengue',
        description: 'Snare on every 8th note for relentless merengue energy',
        bpm: 130,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); on(p, 1, [0,2,4,6,8,10,12,14]); all16(p, 11);
        }, [0,1,11]) },
      },
      {
        name: 'Samba',
        description: 'Rio carnival surdo and caixa groove',
        bpm: 120,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,3,4,7,8,11,12,15]); on(p, 1, [2,6,10,14]); all16(p, 11);
        }, [0,1,11]) },
      },
      {
        name: 'Mambo',
        description: 'Mambo clave with driving conga line',
        bpm: 160,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,6,8,14]); all16(p, 11);
          on(p, 12, [0,4,6,10,12]); on(p, 14, [2,4,8,11,14]);
        }, [0,11,12,14]) },
      },
      {
        name: 'Reggaeton',
        description: 'Dembow kick pattern — the reggaeton backbone',
        bpm: 92,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,3,4,6,8,11,12,14]); on(p, 1, [4,6,12,14]);
          on(p, 2, [0,2,4,6,8,10,12,14]);
        }, [0,1,2]) },
      },
    ],
  },
  {
    name: 'Techno',
    presets: [
      {
        name: 'Sparse',
        description: 'Wide-open groove with kick on 1 and 3, offbeat ride',
        bpm: 135,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,8]); on(p, 2, [0,2,4,6,8,10,12,14]);
          on(p, 7, [4,12]); on(p, 10, [2,6,10,14]);
        }, [0,2,7,10]) },
      },
      {
        name: 'Dub Techno',
        description: '4/4 kick with space for reverb to breathe',
        bpm: 128,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); on(p, 2, [0,2,4,6,8,10,12,14]); on(p, 7, [4,12]);
        }, [0,2,7]) },
      },
      {
        name: 'Industrial',
        description: 'Machine-like 16th hi-hat drive with clap accent',
        bpm: 145,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); all16(p, 2); on(p, 4, [4,12]);
        }, [0,2,4]) },
      },
      {
        name: 'Berlin',
        description: 'Offbeat hi-hats with ride locking onto the downbeats',
        bpm: 133,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); on(p, 2, [2,6,10,14]);
          on(p, 7, [4,12]); on(p, 10, [0,4,8,12]);
        }, [0,2,7,10]) },
      },
      {
        name: 'Acid Techno',
        description: 'Relentless kick with sparse ride punctuation',
        bpm: 138,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); on(p, 2, [0,2,4,6,8,10,12,14]);
          on(p, 7, [4,12]); on(p, 10, [2,10]);
        }, [0,2,7,10]) },
      },
      {
        name: 'Gabber',
        description: 'Extreme 180 BPM with relentless kick and clap',
        bpm: 180,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); all16(p, 2); on(p, 4, [4,12]);
        }, [0,2,4]) },
      },
      {
        name: 'Detroit Techno',
        description: 'Motor City soul with snare and ride groove',
        bpm: 132,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,4,8,12]); on(p, 1, [4,12]);
          on(p, 2, [0,2,4,6,8,10,12,14]); on(p, 10, [2,6,10,14]);
        }, [0,1,2,10]) },
      },
      {
        name: 'Techstep',
        description: 'Dark 170+ BPM neurofunk-influenced groove',
        bpm: 172,
        activePatternId: 'A', songChain: ['A'],
        patterns: { A: makeBundle(16, 0, p => {
          on(p, 0, [0,10]); on(p, 1, [4,8,14]); all16(p, 2);
        }, [0,1,2]) },
      },
    ],
  },
];
