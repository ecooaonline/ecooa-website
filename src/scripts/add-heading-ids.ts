import { generateHeadingId } from './extract-headings';

export function addHeadingIds() {
  if (typeof document === 'undefined') return;

  const container = document.querySelector('.blog-content');
  if (!container) return;

  const headings = container.querySelectorAll('h2, h3');
  headings.forEach(heading => {
    if (!heading.id) {
      heading.id = generateHeadingId(heading.textContent || '');
    }
  });
}

// Auto-run on page load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addHeadingIds);
  } else {
    addHeadingIds();
  }
}
