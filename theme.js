// theme.js

// 1. Immediately check for saved theme on page load
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('syntheraTheme') || 'dark-mode'; // Default to dark
    applyTheme(savedTheme);
});

// 2. Function to apply the theme
function applyTheme(themeName) {
    // Remove all possible theme classes first
    document.body.classList.remove('light-mode', 'dark-mode', 'bahay-kubo', 'modern-dost');
    // Add the selected theme
    document.body.classList.add(themeName);

    // Save to storage
    localStorage.setItem('syntheraTheme', themeName);
}

// 3. Update your dropdown event listeners to call this function
// Example:
// document.getElementById('btn-light-mode').addEventListener('click', () => applyTheme('light-mode'));