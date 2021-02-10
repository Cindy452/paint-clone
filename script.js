const Brush_Time = 1500;
const activeToolEl = document.getElementById('active-tool');
const brushColorBtn = document.getElementById('brush-color');
const brushIcon = document.getElementById('brush');
const brushSize = document.getElementById('brush-size');
const brushSlider = document.getElementById('brush-slider');
const bucketColorBtn = document.getElementById('bucket-color');
const eraser = document.getElementById('eraser');
const clearCanvasBtn = document.getElementById('clear-canvas');
const saveStorageBtn = document.getElementById('save-storage');
const loadStorageBtn = document.getElementById('load-storage');
const clearStorageBtn = document.getElementById('clear-storage');
const downloadBtn = document.getElementById('download');
const { body } = document;

const canvas = document.createElement('canvas');
canvas.id = 'canvas';
const context = canvas.getContext('2d');

let currentSize = 10;
let bucketColor = '#FFFFFF';
let currentColor = '#A51DAB';
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];


function displayBrushSize() {
  if(brushSlider.value < 10) {
     brushSize.textContent = `0${brushSlider.value}`;
    } else {
     brushSize.textContent = brushSlider.value;
    }
}
brushSlider.addEventListener('change', () => {
  currentSize = brushSlider.value;
  displayBrushSize();
});

brushColorBtn.addEventListener('change', () => {
  isEraser = false;
  currentColor = `#${brushColorBtn.value}`;
});


bucketColorBtn.addEventListener('change', () => {
  bucketColor = `#${bucketColorBtn.value}`;
  createCanvas();
  restoreCanvas();
});


eraser.addEventListener('click', () => {
  isEraser = true;
  brushIcon.style.color = 'white';
  eraser.style.color = 'black';
  activeToolEl.textContent = 'Eraser';
  currentColor = bucketColor;
  currentSize = 50;
});

function switchToBrush() {
  isEraser = false;
  activeToolEl.textContent = 'Brush';
  brushIcon.style.color = 'black';
  eraser.style.color = 'white';
  currentColor = `#${brushColorBtn.value}`;
  currentSize = 10;
  brushSlider.value = 10;
  displayBrushSize();
}

function brunshTimeSetTimeout(time) {
  setTimeout(switchToBrush, time);
}

function createCanvas() {
  canvas.width = window.innerWidth ;
  canvas.height = window.innerHeight - 50;
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas);
  switchToBrush();
}

clearCanvasBtn.addEventListener('click', () => {
  createCanvas();
  drawnArray = [];
  activeToolEl.textContent = 'Canvas Cleared';
  brunshTimeSetTimeout(Brush_Time);
});

function restoreCanvas() {
  for (let i = 1; i < drawnArray.length; i++) {
    context.beginPath();
    context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
    context.lineWidth = drawnArray[i].size;
    context.lineCap = 'round';
    if (drawnArray[i].eraser) {
      context.strokeStyle = bucketColor;
    } else {
      context.strokeStyle = drawnArray[i].color;
    }
    context.lineTo(drawnArray[i].x, drawnArray[i].y);
    context.stroke();
  }
}

function storeDrawn(x, y, size, color, erase) {
  const line = {
    x,
    y,
    size,
    color,
    erase,
  };
  drawnArray.push(line);
}

function getMousePosition(event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
}


canvas.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  context.moveTo(currentPosition.x, currentPosition.y);
  context.beginPath();
  context.lineWidth = currentSize;
  context.lineCap = 'round';
  context.strokeStyle = currentColor;
});

canvas.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser,
    );
  } else {
    storeDrawn(undefined);
  }
});

canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
});

saveStorageBtn.addEventListener('click', () => {
  localStorage.setItem('savedCanvas', JSON.stringify(drawnArray));
  activeToolEl.textContent = 'Canvas Saved';
  brunshTimeSetTimeout(Brush_Time);
});

loadStorageBtn.addEventListener('click', () => {
  if (localStorage.getItem('savedCanvas')) {
    drawnArray = JSON.parse(localStorage.savedCanvas);
    restoreCanvas();
    activeToolEl.textContent = 'Canvas Loaded';
    brunshTimeSetTimeout(Brush_Time);
  } else {
    activeToolEl.textContent = 'No Canvas Found';
    brunshTimeSetTimeout(Brush_Time);
  }

});

clearStorageBtn.addEventListener('click', () => {
  localStorage.removeItem('savedCanvas');
  activeToolEl.textContent = 'Local Storage Cleared';
  brunshTimeSetTimeout(Brush_Time);
});

downloadBtn.addEventListener('click', () => {
  downloadBtn.href = canvas.toDataURL('image/jpeg', 1);
  downloadBtn.download = 'canvas.jpg';
  activeToolEl.textContent = 'Image File Saved';
  brunshTimeSetTimeout(Brush_Time);
});

brushIcon.addEventListener('click', switchToBrush);

createCanvas();
