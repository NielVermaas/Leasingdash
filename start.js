// Kept deliberately tiny so the start button works even if the main game is still initialising.
window.openThemeParkGates = function () {
  var welcome = document.getElementById('welcome');
  if (welcome) welcome.classList.add('hidden');
  window.__themeParkStartRequested = true;
  try { window.dispatchEvent(new Event('themepark:start')); } catch (error) {}
};
