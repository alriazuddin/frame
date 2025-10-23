const upload = document.getElementById('upload');
const frameSelect = document.getElementById('frameSelect');
const applyBtn = document.getElementById('applyBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const download = document.getElementById('download');

let userImage = null;

upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      userImage = img;
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

applyBtn.addEventListener('click', () => {
  if (!userImage) {
    alert("দয়া করে আগে একটি ছবি আপলোড করুন!");
    return;
  }

  const frame = new Image();
  frame.src = frameSelect.value;
  frame.onload = function () {
    // draw user image
    ctx.drawImage(userImage, 0, 0, canvas.width, canvas.height);
    // overlay frame
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
    // show download link
    download.href = canvas.toDataURL("image/png");
    download.classList.remove('hidden');
  };
});
