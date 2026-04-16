// Custom cursor -- only on pointer:fine devices
if (window.matchMedia('(pointer: fine)').matches) {
  document.body.classList.add('has-cursor');

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;
  let looping = false;

  function loop() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    if (Math.abs(mx - rx) > 0.5 || Math.abs(my - ry) > 0.5) {
      requestAnimationFrame(loop);
    } else {
      ring.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      looping = false;
    }
  }

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    if (!looping) { looping = true; requestAnimationFrame(loop); }
  });

  // Zone toggles via event delegation (single listener pair instead of N per zone)
  const HOVER_SELECTOR = 'a, button, .pl-lk, .pl, .pc, .ip, .ec';
  const DARK_SELECTOR = '.ap-cp, .ap-vis, .hr, .wv, .cf, .footer, [style*="background:var(--color-ink)"]';

  document.addEventListener('mouseover', (e) => {
    const target = e.target as Element | null;
    if (!target?.closest) return;
    if (target.closest(HOVER_SELECTOR)) document.body.classList.add('hz');
    if (target.closest(DARK_SELECTOR)) document.body.classList.add('dz');
  });
  document.addEventListener('mouseout', (e) => {
    const target = e.target as Element | null;
    if (!target?.closest) return;
    if (target.closest(HOVER_SELECTOR)) document.body.classList.remove('hz');
    if (target.closest(DARK_SELECTOR)) document.body.classList.remove('dz');
  });
}
