function Carrot(sketch) {
  this.sketch = sketch;
  this.x = sketch.width / 2.0;
  this.y = sketch.height / 2.0;
  this.stripeChance = 0.4;
}

Carrot.prototype.map = function(v, vi, vx, ri, rx) {
  const vd = Math.abs(vx - vi);
  const vr = Math.abs(v - vi);
  const rd = Math.abs(rx - ri);
  return ((vr / vd) * rd) + ri;
};

Carrot.prototype.generate = function() {
  // #region body
  const length = this.map(Math.random(), 0, 1, this.sketch.height * 0.3, this.sketch.height * 0.5);
  const width = this.map(Math.random(), 0, 1, length * 0.1, this.sketch.width * 0.2);
  this.bodyVertices = [];
  this.bodyStripes = [];
  this.bodyVertices.push([0, -length/2]);
  this.bodyVertices.push([0, -length/2]);
  for (let i = 0; i < 10; i += 1) {
    const wp = width * (this.map(9-i, 0, 9, 0.1, 0.5) * this.map(Math.random(), 0, 1, 0.9, 1.1));
    const hp = length * (this.map(i, 0, 9, -0.45, 0.45) * this.map(Math.random(), 0, 1, 0.95, 1.05));
    this.bodyVertices.push([wp, hp]);
    if (Math.random() <= this.stripeChance) {
      this.bodyStripes.push({
        vertices: [
          [wp, hp],
          [wp * 0.5, hp]
        ],
        strokeWeight: Math.random(),
      });
    }
  }
  this.bodyVertices.push([0, length/2]);
  for (let i = 0; i < 10; i += 1) {
    const wp = width * (this.map(9-i, 0, 9, -0.5, -0.1) * this.map(Math.random(), 0, 1, 0.9, 1.1));
    const hp = length * (this.map(9-i, 0, 9, -0.45, 0.45) * this.map(Math.random(), 0, 1, 0.95, 1.05));
    this.bodyVertices.push([wp, hp]);
    if (Math.random() <= this.stripeChance) {
      this.bodyStripes.push({
        vertices: [
          [wp, hp],
          [wp * 0.5, hp]
        ],
        strokeWeight: Math.random(),
      });
    }
  }
  // #endregion

  // #region stem
  const numStems = Math.round(this.map(Math.random(), 0, 1, 1, 4));
  const stemAngle = this.map(numStems, 1, 4, 0, Math.PI / 2);
  const stemLength = this.map(Math.random(), 0, 1, length * 0.2, length * 0.6);
  this.stems = [];
  for (let i = 0; i < numStems; i += 1) {
    const angle = (Math.PI * 3 / 2) + this.map(i, 0, numStems, -stemAngle/2, stemAngle/2);
    const stemWidth = this.map(Math.random(), 0, 1, 0.05, 0.2);
    const leafSize = (stemWidth * 2 * stemLength) * 1.1;
    const color = Math.random();
    const leaves = [];
    const leaf = {
      location: [Math.cos(angle) * stemLength, Math.sin(angle) * stemLength - length/2],
      size: leafSize,
      color,
    };
    leaves.push(leaf);
    this.stems.push({
      vertices: [
        [0, -length/2],
        [Math.cos(angle-stemWidth) * stemLength, Math.sin(angle-stemWidth) * stemLength - length/2],
        [Math.cos(angle+stemWidth) * stemLength, Math.sin(angle+stemWidth) * stemLength - length/2],
        [0, -length/2],
      ],
      leaves,
      color,
    })
  }
  // #endregion
}

Carrot.prototype.draw = function() {
  this.sketch.translate(this.x, this.y * 1.25);

  // #region body
  this.sketch.stroke(255, 128, 0);
  this.sketch.strokeWeight(5);
  this.sketch.fill(255, 128, 0);
  this.sketch.beginShape();
  for (let v of this.bodyVertices) {
    this.sketch.curveVertex(v[0], v[1]);
  }
  this.sketch.endShape(this.sketch.CLOSE);

  this.sketch.push();
  this.sketch.stroke(255, 175, 50);
  this.sketch.blendMode(this.sketch.LIGHTEST);
  for (let s of this.bodyStripes) {
    this.sketch.strokeWeight(this.map(s.strokeWeight, 0, 1, 10, 20));
    this.sketch.fill(255, 175, 50);
    const v1 = s.vertices[0];
    const v2 = s.vertices[1];
    this.sketch.line(v1[0], v1[1], v2[0], v2[1]);
  }
  this.sketch.pop();
  // #endregion

  // #region stem
  for (let stem of this.stems) {
    const color = this.sketch.lerpColor(
      this.sketch.color(0, 125, 0),
      this.sketch.color(50, 200, 50),
      stem.color,
    );
    this.sketch.fill(color);
    this.sketch.stroke(color);
    this.sketch.beginShape();
    for (let v of stem.vertices) {
      this.sketch.vertex(v[0], v[1]);
    }
    this.sketch.endShape();
    this.sketch.push();
    for (let l of stem.leaves) {
      this.sketch.ellipse(l.location[0], l.location[1], l.size, l.size);
    }
    this.sketch.pop();
  }
  // #endregion
}