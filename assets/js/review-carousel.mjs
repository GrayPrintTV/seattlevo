// Enhance the static list without touching the persistent audio controller.
export function mountReviews(root) {
  if (!root) return () => {};
  const slides = [...root.querySelectorAll('[data-review-slide]')];
  const controls = root.querySelector('.review-controls');
  const toggle = root.querySelector('[data-review-action="rotation"]');
  const count = root.querySelector('[data-review-count]');
  const live = root.querySelector('[data-review-status]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const abort = new AbortController();
  const options = {signal:abort.signal};
  let index = 0;
  let paused = motion.matches;
  let hovered = false;
  let visible = false;
  let timer;
  let pointerPaused;
  function schedule() {
    clearTimeout(timer);
    toggle.textContent = paused ? 'Resume rotation' : 'Pause rotation';
    if (!paused && !hovered && visible && !document.hidden) {
      timer = setTimeout(() => {show(index + 1);schedule();}, 5000);
    }
  }
  function show(next, announce = false) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('is-active', active);
      slide.inert = !active;
      slide.setAttribute('aria-hidden', String(!active));
    });
    count.textContent = `${index + 1} / ${slides.length}`;
    if (announce) live.textContent = `Review ${index + 1} of ${slides.length}`;
  }
  controls.hidden = false;
  root.classList.add('reviews-enhanced');
  root.setAttribute('aria-roledescription', 'carousel');
  show(0);
  root.addEventListener('click', event => {
    const action = event.target.closest('[data-review-action]')?.dataset.reviewAction;
    if (!action) return;
    if (action === 'rotation') {paused = !(event.detail > 0 ? pointerPaused ?? paused : paused);pointerPaused = undefined;}
    else {paused = true;show(index + (action === 'next' ? 1 : -1), true);}
    schedule();
  }, options);
  toggle.addEventListener('pointerdown', () => {pointerPaused = paused;}, options);
  toggle.addEventListener('pointercancel', () => {pointerPaused = undefined;}, options);
  // Keyboard focus stops rotation until explicitly resumed, per accessible carousel guidance.
  root.addEventListener('focusin', () => {paused = true;schedule();}, options);
  root.addEventListener('pointerenter', event => {if (event.pointerType === 'mouse') {hovered = true;schedule();}}, options);
  root.addEventListener('pointerleave', event => {if (event.pointerType === 'mouse') {hovered = false;schedule();}}, options);
  document.addEventListener('visibilitychange', schedule, options);
  motion.addEventListener('change', () => {if (motion.matches) paused = true;schedule();}, options);
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.25;
    schedule();
  }, {threshold:0.25});
  observer.observe(root);
  schedule();
  return () => {clearTimeout(timer);observer.disconnect();abort.abort();};
}
