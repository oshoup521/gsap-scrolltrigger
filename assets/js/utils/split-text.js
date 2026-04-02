/* ============================================================
   UTILS / split-text.js
   Lightweight character & word splitter (no GSAP SplitText plugin needed)
   ============================================================ */

(function () {
  'use strict';

  window.Portfolio = window.Portfolio || {};

  /**
   * SplitText — splits element text into spans
   * @param {HTMLElement|string} target  — element or CSS selector
   * @param {Object} opts
   *   opts.type  — 'chars' | 'words' | 'lines' | 'chars,words' (default 'chars')
   *   opts.charsClass  — class for char spans
   *   opts.wordsClass  — class for word spans
   */
  function SplitText(target, opts) {
    opts = opts || {};
    this.type = opts.type || 'chars';
    this.charsClass = opts.charsClass || 'char';
    this.wordsClass = opts.wordsClass || 'word';

    if (typeof target === 'string') {
      this.elements = Array.from(document.querySelectorAll(target));
    } else if (target instanceof HTMLElement) {
      this.elements = [target];
    } else if (target && target.length) {
      this.elements = Array.from(target);
    } else {
      this.elements = [];
    }

    this.chars = [];
    this.words = [];

    this._split();
  }

  SplitText.prototype._split = function () {
    var self = this;

    self.elements.forEach(function (el) {
      var originalText = el.textContent;
      var wordArr = originalText.split(' ');

      el.innerHTML = '';

      wordArr.forEach(function (word, wIdx) {
        // Word span
        var wordSpan = document.createElement('span');
        wordSpan.className = self.wordsClass;
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'pre';

        if (self.type.indexOf('chars') !== -1) {
          // Split into chars
          word.split('').forEach(function (char) {
            var charSpan = document.createElement('span');
            charSpan.className = self.charsClass;
            charSpan.style.display = 'inline-block';
            charSpan.textContent = char;
            wordSpan.appendChild(charSpan);
            self.chars.push(charSpan);
          });
        } else {
          wordSpan.textContent = word;
        }

        self.words.push(wordSpan);
        el.appendChild(wordSpan);

        // Add space between words (except last)
        if (wIdx < wordArr.length - 1) {
          var space = document.createTextNode('\u00a0');
          el.appendChild(space);
        }
      });
    });
  };

  /**
   * Revert the element back to plain text
   */
  SplitText.prototype.revert = function () {
    this.elements.forEach(function (el) {
      var text = '';
      el.querySelectorAll('span').forEach(function (s) {
        if (s.classList.contains('char')) text += s.textContent;
        else if (s.classList.contains('word')) {/* handled by chars */}
      });
      // Simpler: just collect all text content from words
      var words = el.querySelectorAll('.' + 'word');
      if (words.length) {
        var out = [];
        words.forEach(function (w) { out.push(w.textContent); });
        el.textContent = out.join(' ');
      }
    });
    this.chars = [];
    this.words = [];
  };

  /* ── Helpers ─────────────────────────────────────────────── */

  /**
   * splitChars — convenience: split a single element into char spans
   * Returns array of char span elements
   */
  function splitChars(el, charClass) {
    charClass = charClass || 'char';
    var text = el.textContent;
    el.innerHTML = '';
    var spans = [];
    text.split('').forEach(function (ch) {
      var s = document.createElement('span');
      s.className = charClass;
      s.style.display = 'inline-block';
      s.textContent = ch;
      el.appendChild(s);
      spans.push(s);
    });
    return spans;
  }

  /**
   * splitWords — convenience: split a single element into word spans
   * Returns array of word span elements
   */
  function splitWords(el, wordClass) {
    wordClass = wordClass || 'word';
    var text = el.textContent;
    el.innerHTML = '';
    var words = text.split(' ');
    var spans = [];
    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = wordClass;
      s.style.display = 'inline-block';
      s.textContent = w;
      el.appendChild(s);
      spans.push(s);
      if (i < words.length - 1) {
        el.appendChild(document.createTextNode('\u00a0'));
      }
    });
    return spans;
  }

  /* ── Export ───────────────────────────────────────────────── */
  window.Portfolio.SplitText = SplitText;
  window.Portfolio.splitChars = splitChars;
  window.Portfolio.splitWords = splitWords;

})();
