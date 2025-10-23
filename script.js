const upload = document.getElementById("upload");
const userImage = document.getElementById("userImage");
const frameImage = document.getElementById("frameImage");
const downloadBtn = document.getElementById("downloadBtn");

let scale = 1;
let pos = { x: 0, y: 0 };
let dragging = false;
let start = { x: 0, y: 0 };

// 📸 ফাইল আপলোড করলে অটো অ্যাপ্লাই
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

// 🖐️ Drag করে move করা
userImage.addEventListener("mousedown", startDrag);
userImage.addEventListener("mousemove", onDrag);
userImage.addEventListener("mouseup", endDrag);
userImage.addEventListener("touchstart", handleTouchStart, { passive: false });
userImage.addEventListener("touchmove", handleTouchMove, { passive: false });
userImage.addEventListener("touchend", endDrag);

function startDrag(e) {
  dragging = true;
  start.x = e.clientX || e.touches?.[0].clientX;
  start.y = e.clientY || e.touches?.[0].clientY;
  userImage.style.cursor = "grabbing";
}

function onDrag(e) {
  if (!dragging) return;
  e.preventDefault();
  const x = e.clientX || e.touches?.[0].clientX;
  const y = e.clientY || e.touches?.[0].clientY;
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

// 🔍 Pinch-to-zoom সাপোর্ট
let initialDistance = 0;
let initialScale = 1;

function handleTouchStart(e) {
  if (e.touches.length === 1) {
    startDrag(e);
  } else if (e.touches.length === 2) {
    e.preventDefault();
    initialDistance = getDistance(e.touches[0], e.touches[1]);
    initialScale = scale;
  }
}

function handleTouchMove(e) {
  if (e.touches.length === 1) {
    onDrag(e);
  } else if (e.touches.length === 2) {
    e.preventDefault();
    const newDistance = getDistance(e.touches[0], e.touches[1]);
    const scaleFactor = newDistance / initialDistance;
    scale = initialScale * scaleFactor;
    if (scale < 0.5) scale = 0.5;
    if (scale > 3) scale = 3;
    updateTransform();
  }
}

function getDistance(t1, t2) {
  return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
}

// 🧭 জুম বাটন (ঐচ্ছিক)
function zoom(delta) {
  scale += delta;
  if (scale < 0.5) scale = 0.5;
  if (scale > 3) scale = 3;
  updateTransform();
}

function updateTransform() {
  userImage.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(${scale})`;
}

// 💾 ডাউনলোড
downloadBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const size = frameImage.naturalWidth;

  canvas.width = size;
  canvas.height = size;

  const user = new Image();
  user.src = userImage.src;
  user.onload = () => {
    ctx.save();
    ctx.translate(size / 2 + pos.x, size / 2 + pos.y);
    ctx.scale(scale, scale);
    ctx.drawImage(user, -size / 2, -size / 2, size, size);
    ctx.restore();
    ctx.drawImage(frameImage, 0, 0, size, size);
    const link = document.createElement("a");
    link.download = "framed.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
});
