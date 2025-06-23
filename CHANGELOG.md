# ✖️ v1.3.5 — Silent Attribution + Info Pop

![Version](https://img.shields.io/badge/version-1.3.5-black?style=flat-square)
![Status](https://img.shields.io/badge/status-Stable-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-GPT--OPS%20v2.1-yellow?style=flat-square)

---

### ✨ Summary

This release introduces a hardened attribution system, modern clipboard handling, and a fully accessible info callout for user guidance. UI polish and licensing have been aligned across all files.

---

### 🔧 `script.js` Enhancements

- Refactored `copyToClipboard()` to async/await using `navigator.clipboard.writeText()`
- Added fallback to `document.execCommand()` for legacy support
- Global `hiddenAttribution` constant includes extra `\n` for spacing
- Clipboard listener appends attribution on manual copy
- Modularized with `execCopy()` helper

---

### 🎨 `style.css` Updates

- Added `.quick-info-callout` and `.quick-info-arrow` for animated tooltip behavior
- Anchored `.instructions` with `position: relative` for layout integrity
- Styled tooltip for mobile, keyboard, and hover access
- Minor layout refinements (marquee, footer, toggle)

---

### 📄 `index.html` Changes

- Info icon (`#quickInfoIcon`) added with `aria-describedby` + `tabindex`
- `.quick-info-callout` structure inserted
- Updated favicon tag

---

### 📜 `license.html` + `LICENSE.md`

- Markdown license now fully reflected in `license.html`
- External links include `rel="noopener"` and `target="_blank"`
- Improved semantic styling (headers, quotes, spacing)

---

### 🗒️ Documentation

- `README.md` updated to reference License v2.1
- `CHANGELOG.md` verified
- Descriptions polished and aligned with branding

---

### ✅ Audit Outcome

> All features tested and verified. Clipboard functionality works across modern and legacy browsers.  
> Accessibility and ethical attribution confirmed.

---

### 🏷️ Git Tag

```bash
git tag -a v1.3.5 -m "Silent Attribution + Info Pop — hardened clipboard integration and animated callout"
git push origin v1.3.5
