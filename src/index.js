let startTime = null;
let numInstances = 0;
let ctxs = [];
let stepCounter = 0;
const speedFactor = 0.1;
const translateLength = 20;
const numPolygons = 10000;
const numVertices = 100;
const colors = [...Array(numPolygons).keys()].map(() => [
  Math.random() * 256,
  Math.random() * 256,
  Math.random() * 256,
]);
const randomPolygons = [...Array(numPolygons).keys()].map(() =>
  [...Array(numVertices).keys()].map(() => [
    Math.random() * 512,
    Math.random() * 512,
  ])
);

const createInstances = (instanceNumber) => {
  const parent = document.getElementById("parent");
  for (let i = 0; i < instanceNumber; ++i) {
    const newInstance = parent.cloneNode(true);
    newInstance.id = `instance-${numInstances}`;
    newInstance.style.transform = `translate3d(0px, ${
      translateLength * (numInstances + 1)
    }px, 0px)`;
    document.body.appendChild(newInstance);
    numInstances++;
  }
};

const draw = (timestamp) => {
  const elements = document.getElementsByClassName("states");
  if (!startTime) startTime = timestamp;
  const progress = Math.sin(
    ((timestamp - startTime) * speedFactor * Math.PI) / 180
  );
  const scaleFactor = progress + 1;
  [].forEach.call(elements, (e, index) => {
    e.style.transform = `translate3d(0px, ${
      translateLength * index
    }px, 0px) scale(${scaleFactor})`;
  });
  ctxs.forEach((ctx) => {
    drawCanvas(ctx, scaleFactor);
  });
};

const drawCanvas = (ctx, scaleFactor) => {
  ctx.save();
  ctx.fillStyle = "yellow";
  ctx.lineWidth = 3;
  ctx.scale(scaleFactor, scaleFactor);
  ctx.fillRect(0, 0, 512, 512);
  for (let p = 0; p < randomPolygons.length; ++p) {
    ctx.strokeStyle = `rgb(${colors[p][0]},${colors[p][1]},${colors[p][2]}`;
    ctx.beginPath();
    ctx.moveTo(randomPolygons[p][0][0], randomPolygons[p][0][1]);
    for (let i = 1; i < randomPolygons[p].length; ++i)
      ctx.lineTo(randomPolygons[p][i][0], randomPolygons[p][i][1]);
    ctx.stroke();
  }
  ctx.restore();
};

const singleStep = () => {
  const progress = Math.sin((stepCounter * Math.PI) / 180);
  const scaleFactor = progress + 1;
  ctxs.forEach((ctx) => {
    drawCanvas(ctx, scaleFactor);
  });
  stepCounter++;
};

const step = (timestamp) => {
  draw(timestamp);
  requestAnimationFrame(step);
};

const playAnimation = () => {
  requestAnimationFrame(step);
};

const createCanvasContexts = () => {
  const elements = document.getElementsByClassName("canvas-tile");
  ctxs = [].map.call(elements, (e) => e.getContext("2d"));
  draw();
};

window.createCanvasContexts = createCanvasContexts;
window.createInstances = createInstances;
window.playAnimation = playAnimation;
window.singleStep = singleStep;
