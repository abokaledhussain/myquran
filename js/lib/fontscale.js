/* حجم الخط: من 1% إلى 200%، و50% هو الحجم العادي (ملء عرض الشاشة) كما في الأندرويد */
(function () {
  var MIN = 1, MAX = 200, DEFAULT = 50;

  function percent() {
    return Util.clamp(Store.get('fontPercent', DEFAULT), MIN, MAX);
  }

  function scaleFor(p) {
    p = Util.clamp(p, MIN, MAX);
    return p <= DEFAULT
      ? 0.3 + 0.7 * (p - MIN) / (DEFAULT - MIN)
      : 1 + 3 * (p - DEFAULT) / (MAX - DEFAULT);
  }

  window.FontScale = { MIN: MIN, MAX: MAX, DEFAULT: DEFAULT, percent: percent, scaleFor: scaleFor };
})();
