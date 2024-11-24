import React from 'react'

export function ThemeScript(): React.JSX.Element {
  // This script runs before React hydration and sets both data-theme and class
  const themeScript = `
    (function() {
      let theme = 'light';
      try {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark' || stored === 'light') {
          theme = stored;
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          theme = 'dark';
        }
      } catch {}
      
      // Set both data-theme and class for Tailwind
      document.documentElement.dataset.theme = theme;
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    })()
  `

  return React.createElement('script', {
    dangerouslySetInnerHTML: { __html: themeScript }
  })
}
