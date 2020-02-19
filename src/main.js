import './register-sw';

function loadText() {
  let el = document.querySelector('#loaded');
  el.innerHTML = 'App Loaded';
}

( () => {
  loadText();
})();