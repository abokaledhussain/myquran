/* شاشة الفهرس: تبويب السور، وتبويب الأجزاء مع خطة الختمة، وتبويب الانتقال إلى صفحة */
(function () {
  var overlay = document.getElementById('index-screen');
  var list = document.getElementById('index-list');
  var tabs = {
    surah: document.getElementById('tab-surah'),
    juz: document.getElementById('tab-juz'),
    goto: document.getElementById('tab-goto')
  };
  var currentTab = 'surah';
  var SURAH_NAMES = window.SURAH_NAMES;

  function open() {
    overlay.hidden = false;
    show(currentTab);
  }

  function close() { overlay.hidden = true; }

  function openPage(n) {
    close();
    Reader.jumpTo(n, 0);
    Store.set('page', n);
    Store.set('pageOffset', 0);
  }

  function selectTab(name) {
    currentTab = name;
    Object.keys(tabs).forEach(function (k) {
      tabs[k].classList.toggle('active', k === name);
      tabs[k].setAttribute('aria-selected', k === name ? 'true' : 'false');
    });
  }

  function card(isCurrent, onTap) {
    var c = Util.el('div', 'card' + (isCurrent ? ' card-current' : ''));
    c.setAttribute('role', 'button');
    c.tabIndex = 0;
    c.addEventListener('click', onTap);
    return c;
  }

  function medal(text) { return Util.el('div', 'medal', text); }

  function textBlock(title, subtitle, opts) {
    var b = Util.el('div', 'card-text');
    var t = Util.el('div', 'card-title', title);
    if (opts && opts.quran) t.classList.add('quran-font');
    b.appendChild(t);
    b.appendChild(Util.el('div', 'card-sub', subtitle));
    return b;
  }

  function pill(text) { return Util.el('span', 'pill', text); }

  function show(name) {
    selectTab(name);
    list.innerHTML = '';
    if (name === 'juz') showJuz();
    else showSurahs();
  }

  function showSurahs() {
    var tj = card(false, function () { Extras.tajweedDialog(openPage); });
    tj.appendChild(medal('ت'));
    tj.appendChild(textBlock('دروس التجويد', 'الغنة والقلقلة والمد مع أمثلة'));
    list.appendChild(tj);

    var page = Reader.currentPage();
    var currentSurah = QuranData.pages[page].surah;
    for (var s = 1; s <= 114; s++) {
      (function (surah) {
        var start = QuranData.startPageOf(surah);
        var c = card(surah === currentSurah, function () {
          if (start) openPage(start); else Dialogs.toast('قريباً');
        });
        c.appendChild(medal(Util.digits(surah)));
        c.appendChild(textBlock(SURAH_NAMES[surah - 1],
          Util.digits(QuranData.ayahCount(surah)) + ' آية · ' + (window.SURAH_PLACES[String(surah)] || ''),
          { quran: true }));
        if (start) c.appendChild(pill('ص ' + Util.digits(start)));
        list.appendChild(c);
      })(s);
    }
  }

  function showJuz() {
    addKhatmaCards();
    for (var j = 1; j <= 30; j++) {
      (function (juz) {
        var page = QuranData.juzStartPage(juz);
        if (!page) return;
        var c = card(false, function () { openPage(page); });
        c.appendChild(medal(Util.digits(juz)));
        c.appendChild(textBlock('الجزء ' + Util.digits(juz), window.JUZ_NAMES[juz - 1]));
        c.appendChild(pill('ص ' + Util.digits(page)));
        list.appendChild(c);
      })(j);
    }
  }

  function addKhatmaCards() {
    if (!Khatma.isActive()) {
      var start = card(false, function () { startPicker(); });
      start.appendChild(medal(Util.digits(Khatma.DAYS)));
      start.appendChild(textBlock('خطة الختمة', 'ابدأ من أي جزء، ثم يتتابع الترتيب'));
      start.appendChild(pill('ابدأ'));
      list.appendChild(start);
      return;
    }
    var day = Khatma.currentDay();
    var done = Khatma.isDone(day);
    var juz = Khatma.juzOf(day);
    var juzPage = QuranData.juzStartPage(juz) || 1;
    var today = card(!done, function () { openPage(juzPage); });
    today.appendChild(medal(Util.digits(day)));
    today.appendChild(textBlock('اليوم ' + Util.digits(day) + ' · الجزء ' + Util.digits(juz), 'اضغط لفتح الجزء'));
    var toggle = pill(done ? '✓ تم' : '○ لم يُتم');
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      Khatma.setDone(day, !done);
      show('juz');
    });
    today.appendChild(toggle);
    list.appendChild(today);

    var reset = card(false, function () {
      Dialogs.confirm('إعادة الخطة', 'سيُمسح تقدم الختمة الحالية.', 'إعادة', function () {
        Khatma.reset();
        show('juz');
      });
    });
    reset.appendChild(textBlock('إعادة الخطة', 'تبدأ الختمة من جديد من اليوم'));
    list.appendChild(reset);
  }

  function startPicker() {
    var box = Util.el('div', 'lesson-list');
    for (var j = 1; j <= Khatma.DAYS; j++) {
      (function (juz) {
        var b = Util.el('button', 'tile wide', 'الجزء ' + Util.digits(juz));
        b.type = 'button';
        b.addEventListener('click', function () {
          dlg.close();
          Khatma.start(juz);
          show('juz');
        });
        box.appendChild(b);
      })(j);
    }
    var dlg = Dialogs.open({ title: 'ابدأ الختمة من الجزء', body: box, actions: [{ label: 'إلغاء' }] });
  }

  document.getElementById('index-back').addEventListener('click', close);
  document.getElementById('index-bookmarks').addEventListener('click', function () {
    Extras.bookmarksDialog(openPage);
  });
  tabs.surah.addEventListener('click', function () { show('surah'); });
  tabs.juz.addEventListener('click', function () { show('juz'); });
  tabs.goto.addEventListener('click', function () { Extras.gotoDialog(openPage); });

  window.Index = { open: open, close: close };
})();
