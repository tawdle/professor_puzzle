"use strict";

const Vector = require('./vector');

/*
 * Defines the sequence of immovable lengths within the chain.
 * Between each sequence, the chain may freely turn.
*/
const SEQUENCE = [
  3, 3, 3, 3, 2, 2, 2, 3, 3, 2, 2, 3, 2, 3, 2, 2, 3
];

class Cube {
  constructor() {
    this.state = new Array(27);
  }

  /*
   * Given a position vector v, return an index that can be used to find the
   * state of the position in the state array.
   *
   * Returns `undefined` if the the provided position is out of bounds.
  */
  toIndex(v) {
    return this.isLegal(v) ? v.x + v.y * 3 + v.z * 9 : undefined;
  }

  isLegal(v) {
    return v.x >=0 && v.x <= 2 &&
      v.y >= 0 && v.y <= 2 &&
        v.z >= 0 && v.z <= 2;
  }

  /*
   * Determines whether the position(s) indciated by the provided vector(s) are
   * available. Caller may provide a single vector or an array of vectors; if
   * multiple are provided, returns true iff all positions are available.
  */
  isAvailable(vs) {
    if (Array.isArray(vs)) {
      return vs.every(v => this.isAvailable(v));
    }

    let index = this.toIndex(vs);
    return  (index !== undefined && !this.state[index]);
  }

  /*
   * Sets one or more states to the provided value.
  */
  _set(vs, value) {
    if (Array.isArray(vs)) {
      vs.forEach(v => this._set(v, value));
      return;
    }

    if (!this.isLegal(vs)) {
      throw new RangeError(`Tried to set value out of range: ${vs.toString()}`);
    }

    this.state[this.toIndex(vs)] = value;
  }

  mark(vs) {
    this._set(vs, true);
  }

  clear(vs) {
    this._set(vs, undefined);
  }

  /*
   * Returns an array corresponding to the positions that are traversed by
   * walking `length` steps from `start` in along `direction`.
  */
  getPositions(start, direction, length) {
    var positions = [];

    for (var i = 0; i < length - 1; ++i) {
      start = start.add(direction);
      positions.push(start);
    }
    return positions;
  }

  /*
   * Explores all possible ways to continue given the start position,
   * sequenceIndex, and cube state.  `descs` contains an array of step-wise
   * directions that will be output to the console when a complete solution has
   * been discovered.
   *
   * Operates recursively to explore all possible solutions, returning the
   * total number of solutions discovered.
  */
  explore(start, descs, sequenceIndex) {
    if (sequenceIndex >= SEQUENCE.length) {
      this.displayMoves(descs);
      return 1;
    }

    const directions = {
      left: new Vector(-1, 0, 0),
      right: new Vector(1, 0, 0),
      up: new Vector(0, 1, 0),
      down: new Vector(0, -1, 0),
      back: new Vector(0, 0, 1),
      front: new Vector(0, 0, -1)
    };

    return Object.keys(directions).map(direction => {
      let positions = this.getPositions(
        start, directions[direction], SEQUENCE[sequenceIndex]);
      let newPosition = positions[positions.length - 1];
      if (this.isAvailable(positions)) {
        this.mark(positions);
        descs.push(`${direction} ${SEQUENCE[sequenceIndex]} to ${newPosition}`);
        let result = this.explore(newPosition, descs, sequenceIndex + 1);
        this.clear(positions);
        descs.pop();
        return result;
      } else {
        return 0;
      }
    }).reduce( (prev, curr) => prev + curr);
  }

  displayMoves(descs) {
    console.log(descs.map( (desc, index) => `${index + 1}. ${desc}`).join("\n"));
    console.log("");
  }
}

module.exports = Cube;
