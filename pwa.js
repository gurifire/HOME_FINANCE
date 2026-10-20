/* Installation support only; ledger/authentication code is unchanged. */
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('./sw.js', document.baseURI), {updateViaCache: 'none'})
      .then(registration => registration.update())
      .catch(error => console.warn('앱 설치 기능을 불러오지 못했습니다.', error));
  });
}
