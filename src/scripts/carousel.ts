// Drag scroll for testimonial carousel
const tt = document.getElementById('tt');
if (tt) {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  tt.addEventListener('mousedown', (e) => {
    isDown = true;
    tt.style.cursor = 'grabbing';
    startX = e.pageX - tt.offsetLeft;
    scrollLeft = tt.scrollLeft;
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
    if (tt) tt.style.cursor = 'grab';
  });

  tt.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - tt.offsetLeft;
    tt.scrollLeft = scrollLeft - (x - startX) * 1.3;
  });

  // Touch support
  tt.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - tt.offsetLeft;
    scrollLeft = tt.scrollLeft;
  }, { passive: true });

  tt.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - tt.offsetLeft;
    tt.scrollLeft = scrollLeft - (x - startX);
  }, { passive: true });

  // Keyboard support for accessibility
  tt.setAttribute('tabindex', '0');
  tt.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') tt.scrollBy({ left: 200, behavior: 'smooth' });
    if (e.key === 'ArrowLeft') tt.scrollBy({ left: -200, behavior: 'smooth' });
  });
}
