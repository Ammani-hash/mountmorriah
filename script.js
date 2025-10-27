// Optional: Slow scroll pause on hover
const track = document.querySelector('.scroll-track');

track.addEventListener('mouseenter', () => {
  track.style.animationPlayState = 'paused';
});

track.addEventListener('mouseleave', () => {
  track.style.animationPlayState = 'running';
});
