/**
 * Dark mode toggle functionality for Crypto Investor Copilot
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create dark mode toggle button
    const themeToggle = document.createElement('button');
    themeToggle.classList.add('theme-toggle');
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeToggle);
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      enableDarkMode();
    }
    
    // Add event listener to toggle button
    themeToggle.addEventListener('click', toggleDarkMode);
  });
  
  /**
   * Toggle between light and dark mode
   */
  function toggleDarkMode() {
    if (document.body.classList.contains('dark-theme')) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  }
  
  /**
   * Enable dark mode
   */
  function enableDarkMode() {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
    
    // Change icon to sun
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }
  
  /**
   * Disable dark mode
   */
  function disableDarkMode() {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
    
    // Change icon to moon
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  }