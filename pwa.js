/* Installation support only; ledger/authentication code is unchanged. */
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('./sw.js', document.baseURI), {updateViaCache: 'none'})
      .then(registration => registration.update())
      .catch(error => console.warn('앱 설치 기능을 불러오지 못했습니다.', error));
  });
}

// ledger-double-back-exit: one back press shows a notice; a second leaves the page.
(() => {
  const marker = '__ledgerExitGuard';
  const windowMs = 2300;
  let lastBackAt = -Infinity;
  let leaving = false;
  const arm = () => {
    const state = history.state && typeof history.state === 'object' ? history.state : {};
    history.pushState({...state, [marker]: true}, '', location.href);
  };
  try {
    if (!history.state?.[marker]) arm();
    window.addEventListener('popstate', () => {
      if (leaving) return;
      const now = performance.now();
      if (now - lastBackAt <= windowMs) {
        leaving = true;
        history.back();
        return;
      }
      arm();
      const dialog = [...document.querySelectorAll('dialog[open]')].pop();
      if (dialog) {
        lastBackAt = -Infinity;
        dialog.close();
        return;
      }
      lastBackAt = now;
      toast('뒤로가기를 한 번 더 누르면 종료됩니다.');
    });
    window.addEventListener('pageshow', () => {
      leaving = false;
      lastBackAt = -Infinity;
      if (!history.state?.[marker]) arm();
    });
  } catch (error) {
    console.warn('뒤로가기 종료 안내를 설정하지 못했습니다.', error);
  }
})();
