"use strict";

class Vector {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(other) {
    return new Vector(
      this.x + other.x,
      this.y + other.y,
      this.z + other.z);
  }

  toString() {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}

module.exports = Vector;

