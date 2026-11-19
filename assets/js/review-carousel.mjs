// Enhance the static list without touching the persistent audio controller.
export function mountReviews(root) {
  if (!root) return () => {};
  const slides = [...root.querySelectorAll('[data-review-slide]')];
  const live = root.querySelector('[data-review-status]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const abort = new AbortController();
  const options = {signal:abort.signal};
  let index = 0;
  let keyboardPaused = false;
  let hovered = false;
  let visible = false;
  let timer;
  function schedule() {
    clearTimeout(timer);
    if (!motion.matches && !keyboardPaused && !hovered && visible && !document.hidden) {
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
    if (announce) live.textContent = `Review ${index + 1} of ${slides.length}`;
  }
  root.querySelectorAll('[data-review-action]').forEach(button => {button.hidden = false;});
  root.classList.add('reviews-enhanced');
  root.setAttribute('aria-roledescription', 'carousel');
  show(0);
  root.addEventListener('click', event => {
    const action = event.target.closest('[data-review-action]')?.dataset.reviewAction;
    if (!action) return;
    show(index + (action === 'next' ? 1 : -1), true);
    schedule();
  }, options);
  // Keyboard browsing stays still; pointer browsing resumes when the mouse leaves.
  root.addEventListener('focusin', event => {if (event.target.matches(':focus-visible')) keyboardPaused = true;schedule();}, options);
  root.addEventListener('pointerdown', () => {keyboardPaused = false;schedule();}, options);
  root.addEventListener('pointerenter', event => {if (event.pointerType === 'mouse') {hovered = true;schedule();}}, options);
  root.addEventListener('pointerleave', event => {if (event.pointerType === 'mouse') {hovered = false;schedule();}}, options);
  document.addEventListener('visibilitychange', schedule, options);
  motion.addEventListener('change', schedule, options);
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.25;
    schedule();
  }, {threshold:0.25});
  observer.observe(root);
  schedule();
  return () => {clearTimeout(timer);observer.disconnect();abort.abort();};
}
