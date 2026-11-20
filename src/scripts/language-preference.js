(() => {
  const supported = ['fr', 'en', 'it', 'de'];
  const storageKey = 'weasy-rider-language';
  const remember = (language) => {
    try { localStorage.setItem(storageKey, language); } catch {}
  };

  // Save a deliberate language switch before following its link.
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('[data-site-language]');
    const language = link?.getAttribute('data-site-language');
    if (supported.includes(language)) remember(language);
  });

  const url = new URL(location.href);
  const explicitLocale = url.pathname.match(/^\/(en|it|de)(?:\/|$)/)?.[1];
  if (explicitLocale) {
    remember(explicitLocale);
    return;
  }
  // Keep direct links to individual pages intact.
  if (url.pathname !== '/' && url.pathname !== '/index.html') return;

  // This also lets a visitor choose French when browser storage is unavailable.
  if (url.searchParams.get('lang') === 'fr') {
    remember('fr');
    return;
  }

  let saved;
  try { saved = localStorage.getItem(storageKey); } catch {}
  const preferences = navigator.languages?.length ? navigator.languages : [navigator.language];
  const browserLanguage = preferences
    .map((language) => String(language).toLowerCase().split(/[-_]/)[0])
    .find((language) => supported.includes(language));
  const language = supported.includes(saved) ? saved : browserLanguage || 'fr';
  remember(language);
  if (language !== 'fr') {
    url.pathname = `/${language}/`;
    location.replace(url.href);
  }
})();
