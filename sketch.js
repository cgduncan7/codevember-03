/**
 * sketch
 */
var s = function(sketch) {
  // #region settings
  const framerate = 60;
  const w = window.innerWidth;
  const h = window.innerHeight;
  // #endregion

  let carrot;

  // #region p5
  sketch.setup = function() {
    const p5canvas = sketch.createCanvas(w, h);
    canvas = p5canvas.canvas;
    carrot = new Carrot(sketch);
    carrot.generate();
    sketch.frameRate(framerate);
  }

  sketch.draw = function() {
    sketch.background(255);
    carrot.draw();
  }

  sketch.mousePressed = function() {
    carrot.generate();
  }

  sketch.keyPressed = function() {
    carrot.generate();
  }
  // #endregion
};

var sketch = new p5(s, document.getElementById('sketch'));