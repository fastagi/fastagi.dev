const menuButton = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('is-open');
}
menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  navigation.classList.toggle('is-open', !expanded);
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const text = document.getElementById(button.dataset.copy)?.textContent;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = button.dataset.success;
    } catch {
      button.textContent = button.dataset.failure;
    }
    setTimeout(() => { button.textContent = button.dataset.label; }, 2400);
  });
});
