# ✖️ GPT-OPS CHANGELOG

![Version](https://img.shields.io/badge/version-1.3.5-black?style=flat-square)
![Status](https://img.shields.io/badge/status-Stable-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-GPT--OPS%20v2.1-yellow?style=flat-square)

---

## ✖️ v1.3.5 — Silent Attribution + Info Pop  
**Release Date:** June 23, 2025  
**Status:** ✅ Verified (Audit complete)

This release introduces a hardened attribution system, improved clipboard interaction, and a refined quick-info callout with full accessibility and animation polish.

---

### 🔧 `script.js` Enhancements

- `hiddenAttribution` is now globally scoped for universal access
- `copyToClipboard()` refactored into `async` function using `navigator.clipboard.writeText()`, with `execCommand('copy')` fallback
- Native `copy` event listener added to `#output` to silently append attribution on manual copy
- Copy button updated to use new clipboard logic
- Attribution now includes extra `\n` newline for visual separation

#### Quick Info Logic:
- Added `showCallout()` and `hideCallout()` for toggling visibility
- Handles `mouseenter`, `mouseleave`, `focus`, and `blur` for accessibility
- Removed all JS-based XY positioning in favor of CSS anchors

---

### 🎨 `style.css` Additions

- `.quick-info-callout` styled with:
  - `position: absolute`, `backdrop-filter`, `box-shadow`, and transition animations
  - `.quick-info-arrow` visually connects callout to info icon
- `.instructions` container updated with `position: relative`
- Text elements `.quick-info-title` and `.quick-info-description` introduced for internal formatting

---

### 📄 `index.html` Updates

- Info icon (`#quickInfoIcon`) added with proper `aria-describedby` and `tabindex`
- `.quick-info-callout` block structured for accessibility + animation
- Footer: “License v2.1” now links to `./license.html` with `target="_blank"`

---

### 📜 `license.html` Upgrades

- All outbound links now include `target="_blank"` and `rel="noopener"`
- Styled locally with scoped `<style>` for layout control
- Fully reflects Markdown content from `LICENSE.md` (v2.1)

---

### 🗒️ Documentation + Legal

- `README.md` updated to reference License v2.1 (was v2.0)
- `LICENSE.md` confirms full terms under GPT-OPS v2.1 including Attribution, Commercial Use, and Moral Clauses

---

### ✅ Audit Outcome

> All changes verified against source files.  
> No discrepancies or missing features found.  
> Attribution is now silently enforced across both button and manual copy flows.  

---

🔖 **Tag Recommendation:** `v1.3.5`  
📝 **Commit Message:**  
```bash
Silent Attribution + Info Pop — hardened clipboard integration and animated callout
