/* officer-main.js
   공통 유틸리티만 관리
   - header/sidebar/footer 제어 금지
   - 페이지 이동/아코디언/active 처리는 각 전용 JS에서 관리
*/

(function () {

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {

    document.documentElement.style.visibility = 'visible';

    /* button 기본 type 지정 */
    document.querySelectorAll('button:not([type])').forEach(function (btn) {
      btn.setAttribute('type', 'button');
    });

    /* href="#" 기본 이동 방지 */
    document.querySelectorAll('a[href="#"]').forEach(function (a) {

      if (a.dataset.preventDefaultBound === '1') return;

      a.dataset.preventDefaultBound = '1';

      a.addEventListener('click', function (e) {
        e.preventDefault();
      });

    });

  });

  /* 공통 confirm */
  window.showConfirm = function (message, callback) {

    if (confirm(message)) {

      if (typeof callback === 'function') {
        callback();
      }

    }

  };

  /* 공통 alert */
  window.showAlert = function (message) {
    alert(message);
  };

})();