/* خطة الختمة في 30 يومًا: جزء لكل يوم، تبدأ من الجزء المختار ثم تتابع وتعود إلى 1 بعد 30 */
(function () {
  var DAYS = 30;
  var DAY_MS = 86400000;

  function todayIndex() {
    var now = Date.now();
    return Math.floor((now - new Date(now).getTimezoneOffset() * 60000) / DAY_MS);
  }

  function isActive() { return Store.get('khatma_start', null) !== null; }

  function start(startJuz) {
    Store.set('khatma_start', todayIndex());
    Store.set('khatma_start_juz', Util.clamp(startJuz, 1, DAYS));
    Store.remove('khatma_done');
  }

  function reset() {
    Store.remove('khatma_start');
    Store.remove('khatma_start_juz');
    Store.remove('khatma_done');
  }

  function currentDay() {
    var start = Store.get('khatma_start', todayIndex());
    return Util.clamp(todayIndex() - start + 1, 1, DAYS);
  }

  function juzOf(day) {
    var startJuz = Store.get('khatma_start_juz', 1);
    return ((startJuz - 1 + day - 1) % DAYS) + 1;
  }

  function isDone(day) {
    var done = Store.get('khatma_done', []);
    return Array.isArray(done) && done.indexOf(String(day)) >= 0;
  }

  function setDone(day, value) {
    var done = Store.get('khatma_done', []);
    if (!Array.isArray(done)) done = [];
    done = done.filter(function (d) { return d !== String(day); });
    if (value) done.push(String(day));
    Store.set('khatma_done', done);
  }

  window.Khatma = {
    DAYS: DAYS, isActive: isActive, start: start, reset: reset,
    currentDay: currentDay, juzOf: juzOf, isDone: isDone, setDone: setDone
  };
})();
