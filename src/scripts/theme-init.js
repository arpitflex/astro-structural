// Applies the saved theme before first paint. astro.config.mjs puts this in the head of every page.
try {
  const theme = localStorage.getItem('theme');
  if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
} catch {}
