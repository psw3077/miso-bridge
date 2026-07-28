const imageMap = {
  '/plb-warehouse-main.jpg': '/KakaoTalk_20260713_194212610.png',
  '/plb-warehouse-sub.jpg': '/KakaoTalk_20260713_194212610_01.png',
  '/plb-ceo.jpg': '/KakaoTalk_20260719_204552857.jpg',
  '/plb-sponsor.jpg': '/plb.png'
};

function applyUploadedImages() {
  document.querySelectorAll('img').forEach((img) => {
    const original = img.getAttribute('src');
    if (!original || !imageMap[original]) return;
    img.src = imageMap[original];
    img.style.display = 'block';
  });
}

const observer = new MutationObserver(applyUploadedImages);
observer.observe(document.documentElement, { childList: true, subtree: true });

document.addEventListener('DOMContentLoaded', applyUploadedImages);
window.addEventListener('load', applyUploadedImages);
setTimeout(applyUploadedImages, 300);
