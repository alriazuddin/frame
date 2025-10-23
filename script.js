const upload = document.getElementById("upload");
const userImage = document.getElementById("userImage");
const frameImage = document.getElementById("frameImage");
const downloadBtn = document.getElementById("downloadBtn");

let scale = 1;
let pos = { x: 0, y: 0 };
let dragging = false;
let start = { x: 0, y: 0 };

upload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = ev => {
      userImage.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// অটো অ্যাপ্লাই (apply button দরকার নেই)
// Drag to adjust
userImage.addEventListener("mousedown", startDrag);
userImage.addEventListener("mousemove", onDrag);
userImage.addEventListener("mouseup", endDrag);
userImage.addEventListener("touchstart", startDrag);
userImage.addEventListener("touchmove", onDrag);
userImage.addEventListener("touchend", endDrag);

function startDrag(e) {
  dragging = true;
  start.x = e.clientX || e.touches[0].clientX;
  start.y = e.clientY || e.touches[0].clientY;
  userImage.style.cursor = "grabbing";
}

function onDrag(e) {
  if (!dragging) return;
  e.preventDefault();
  const x = e.clientX || e.touches[0].clientX;
  const y = e.clientY || e.touches[0].clientY;
  pos.x += (x - start.x);
  pos.y += (y - start.y);
  start.x = x;
  start.y = y;
  updateTransform();
}

function endDrag() {
  dragging = false;
  userImage.style.cursor = "grab";
}

function zoom(delta) {
  scale += delta;
  if (scale < 0.5) scale = 0.5;
  if (scale > 3) scale = 3;
  updateTransform();
}

function updateTransform() {
  userImage.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(${scale})`;
}

downloadBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const size = frameImage.naturalWidth;

  canvas.width = size;
  canvas.height = size;

  const user = new Image();
  user.src = userImage.src;
  user.onload = () => {
    ctx.drawImage(user, pos.x, pos.y, size * scale, size * scale);
    ctx.drawImage(frameImage, 0, 0, size, size);
    const link = document.createElement("a");
    link.download = "framed.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
});
