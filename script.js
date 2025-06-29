// ✖️ GPT OPS Prompt Builder
// Version: v1.3.5
// https://gpt-ops-builder.vercel.app
const VERSION = "v1.3.5";

const toggle = document.getElementById("toggle");
const quickForm = document.getElementById("quickForm");
const fullForm = document.getElementById("fullForm");
const generateStatus = document.getElementById("generateStatus");
const copyStatus = document.getElementById("copyStatus");
const output = document.getElementById("output");
// Global constant for attribution text, accessible by all copy functions.
// Modified to add an extra newline (\n) at the beginning for better spacing in copied output.
const hiddenAttribution = `\n\nGenerated using GPT-OPS v1.3.5\n© 2024 JOHNJOHNFM — Instruction Architecture by JOHN E. REYNOLDS\nLicense: https://gpt-ops-builder.vercel.app/license.html\nAttribution Required + Ethical Use Only`;

// Form toggle functionality
document.querySelectorAll('input[name="formMode"], .switch').forEach(el => {
  // This line might be redundant if the elements are toggle and labels, but harmless.
});
toggle.addEventListener("click", () => {
  const isQuick = toggle.classList.contains("active-quick");
  toggle.classList.toggle("active-quick", !isQuick);
  toggle.classList.toggle("active-full", isQuick);
  quickForm.classList.toggle("hidden", !toggle.classList.contains("active-quick"));
  fullForm.classList.toggle("hidden", toggle.classList.contains("active-quick"));
  output.value = "";
  copyStatus.innerText = "";
  generateStatus.innerText = "";
});

// Generate button functionality
document.getElementById("generateButton").addEventListener("click", () => {
  const isQuick = toggle.classList.contains("active-quick");
  let txt = "";
  generateStatus.innerText = "";
  copyStatus.innerText = "";

  if (isQuick) {
    const name = document.getElementById("q_projectName").value.trim();
    const purpose = document.getElementById("q_purpose").value.trim();
    const disc = document.getElementById("q_disciplines").value.trim();
    if (!name || !purpose || !disc) { // Ensure all 3 quick fields are required
      generateStatus.innerText = "Please fill required fields.";
      return;
    }
    txt = `Create full GPT Project Instructions using the GPT OPS method for a ${disc} assistant called ${name}, whose job is to ${purpose}. Include memory, tone, tools, and examples.`;
  } else {
    const get = id => document.getElementById(id).value.trim();
    const fields = ["projectName","purpose","users","disciplines","outputs","tone","values","memory","mustHave","shouldHave","couldHave","wontHave"];
    const labels = [
        "✖️ PROJECT NAME",
        "✖️ PURPOSE",
        "✖️ PRIMARY USERS",
        "✖️ CORE DISCIPLINE(S)",
        "✖️ PREFERRED OUTPUTS",
        "✖️ BRAND OR TONE",
        "✖️ VALUES OR PRIORITIES",
        "✖️ KEY MEMORY ELEMENTS",
        "✖️ MUST-HAVE BEHAVIORS",
        "✖️ SHOULD-HAVE FEATURES",
        "✖️ COULD-HAVE EXTRAS",
        "✖️ WON'T-HAVES"
    ];
    let parts = [];

    for (let i = 0; i < fields.length; i++) {
      const val = get(fields[i]);
      // Project Name, Purpose, Primary Users, Core Disciplines are required (first 4 fields)
      if (i < 4 && !val) {
        generateStatus.innerText = "Please fill required fields.";
        return;
      }
      if (val) {
          parts.push(`${labels[i]}: ${val}`);
      }
    }

    // Added a newline character (\n) at the end of the prompt string
    parts.unshift("Create and optimize detailed ChatGPT Project Instructions using the following variables:\n");
    txt = parts.join("\n");

    // Removed the "Also include" function as requested by the user.
  }
  output.value = txt;
});

// Copy button functionality (now uses the new copyToClipboard function)
document.getElementById("copyButton").addEventListener("click", () => {
  const text = output.value.trim();
  generateStatus.innerText = "";
  copyStatus.innerText = "";

  if (text) {
    copyToClipboard(text).then(() => {
      copyStatus.innerText = "Prompt copied!";
    }).catch(() => {
      copyStatus.innerText = "Prompt copied! (Fallback)";
    });
  } else {
    copyStatus.innerText = "Please generate a prompt first.";
  }
});

// Append hidden attribution when copying manually from the output field
output.addEventListener('copy', event => {
  const selection = window.getSelection().toString() || output.value;
  event.preventDefault(); // Prevent default copy behavior
  event.clipboardData.setData('text/plain', selection + hiddenAttribution);
  copyStatus.innerText = 'Prompt copied!';
});


// Quick Info Callout functionality
document.addEventListener('DOMContentLoaded', () => {
  const quickInfoIcon = document.getElementById('quickInfoIcon');
  const gptOpsInfoCallout = document.getElementById('gptOpsInfoCallout');
  let dismissTimeout;

  if (!quickInfoIcon || !gptOpsInfoCallout) {
    console.error('Quick Info elements not found');
    return;
  }

  // No complex positionCallout() needed, CSS handles it
  function showCallout() {
    if (dismissTimeout) {
      clearTimeout(dismissTimeout);
    }
    gptOpsInfoCallout.classList.remove('hidden');
    // Force reflow for transform transition
    void gptOpsInfoCallout.offsetWidth; 
    gptOpsInfoCallout.classList.add('active');
  }

  function hideCallout() {
    gptOpsInfoCallout.classList.remove('active');
    dismissTimeout = setTimeout(() => {
      gptOpsInfoCallout.classList.add('hidden');
    }, 300); // Match CSS transition duration
  }

  // HOVER ONLY: Event Listeners for Hover
  quickInfoIcon.addEventListener('mouseenter', showCallout);
  quickInfoIcon.addEventListener('mouseleave', hideCallout);

  // Keep callout visible when hovering over it (to prevent flicker)
  gptOpsInfoCallout.addEventListener('mouseenter', () => {
    if (dismissTimeout) {
      clearTimeout(dismissTimeout);
    }
  });
  gptOpsInfoCallout.addEventListener('mouseleave', hideCallout);

  // Keyboard accessibility
  quickInfoIcon.addEventListener('focus', showCallout);
  quickInfoIcon.addEventListener('blur', hideCallout);

  // REMOVED: No 'click' toggle as per "HOVER ONLY" requirement
});

// New copyToClipboard function using Promises for better async handling
function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    const finalText = text + hiddenAttribution;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Use modern Clipboard API
      navigator.clipboard.writeText(finalText)
        .then(resolve)
        .catch(err => {
          // Fallback if Clipboard API fails for any reason
          console.error('Clipboard.writeText failed, attempting execCommand:', err);
          const temp = document.createElement('textarea');
          temp.value = finalText;
          document.body.appendChild(temp);
          temp.select();
          try {
            document.execCommand('copy');
            resolve();
          } catch (e) {
            console.error('document.execCommand("copy") failed:', e);
            reject(e);
          } finally {
            document.body.removeChild(temp);
          }
        });
    } else {
      // Old browsers fallback (clipboard API not available)
      console.log('navigator.clipboard not available, using execCommand fallback.');
      const temp = document.createElement('textarea');
      temp.value = finalText;
      document.body.appendChild(temp);
      temp.select();
      try {
        document.execCommand('copy');
        resolve();
      } catch (e) {
        console.error('document.execCommand("copy") failed:', e);
        reject(e);
      } finally {
        document.body.removeChild(temp);
      }
    }
  });
}

// © 2025 JOHNJOHNFM, LLC. All rights reserved.
// Licensed under GPT-OPS License v2.1 — https://gpt-ops-builder.vercel.app/license.html
// Authored as part of the GPT-OPS Instruction Architecture by JOHNJOHNFM.
