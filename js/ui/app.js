/* نقطة البداية: تطبيق المظهر، ثم تشغيل المصحف، وربط الأزرار العلوية */
(function () {
  document.getElementById('open-index').addEventListener('click', function () { Index.open(); });
  document.getElementById('open-settings').addEventListener('click', function () { Settings.open(); });
  Reader.init(Settings.apply());
  window.CurrentPalette = Settings.apply();
})();
