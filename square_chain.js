"use strict";

var Vector = require('./Vector');
var Cube = require('./Cube');

/*
 * We use only four start positions: a corner, a middle edge,
 * a middle side, and the middle middle. All other positions are
 * redundant due to symmetry.
*/
const startPositions = [
  new Vector(0, 0, 0),
  new Vector(0, 0, 1),
  new Vector(0, 1, 1),
  new Vector(1, 1, 1)
];

let cube = new Cube();

let numFound = startPositions.
  map(position => {
    cube.mark(position);
    var result = cube.explore(position, [`Start at ${position.toString()}`], 0);
    cube.clear(position);
    return result;
  })
  .reduce( (prev, curr) => prev + curr, 0);

console.log(`Found ${numFound} solutions`);
