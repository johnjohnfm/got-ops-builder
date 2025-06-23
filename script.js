const toggle = document.getElementById("toggle");
const quickForm = document.getElementById("quickForm");
const fullForm = document.getElementById("fullForm");
const generateStatus = document.getElementById("generateStatus");
const copyStatus = document.getElementById("copyStatus");
const output = document.getElementById("output");

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
        "X PROJECT NAME",
        "X PURPOSE",
        "X PRIMARY USERS",
        "X CORE DISCIPLINE(S)",
        "X PREFERRED OUTPUTS",
        "X BRAND OR TONE",
        "X VALUES OR PRIORITIES",
        "X KEY MEMORY ELEMENTS",
        "X MUST-HAVE BEHAVIORS",
        "X SHOULD-HAVE FEATURES",
        "X COULD-HAVE EXTRAS",
        "X WON'T-HAVES"
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

    parts.unshift("✖ GPT OPS FULL INSTRUCTIONS");
    txt = parts.join("\n");

    if (parts.length > 1) {
        txt += "\n\nAlso include 3-5 example input/output pairs showing how this GPT should respond to common user queries. The tone should be professional and clear. You may include comments in the output to help me edit it later.";
    }
  }
  output.value = txt;
});

// Copy button functionality (modern API with fallback)
document.getElementById("copyButton").addEventListener("click", () => {
  const text = output.value.trim();
  generateStatus.innerText = "";
  copyStatus.innerText = "";

  if (text) {
    // Use modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        copyStatus.innerText = "Prompt copied!";
      }).catch(() => {
        // Fallback if Clipboard API fails
        output.select();
        document.execCommand("copy");
        copyStatus.innerText = "Prompt copied! (Fallback)";
      });
    } else {
      // Old fallback for very old browsers
      output.select();
      document.execCommand("copy");
      copyStatus.innerText = "Prompt copied! (Fallback)";
    }
  } else {
    copyStatus.innerText = "Please generate a prompt first.";
  }
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

// © 2025 John E. Reynolds. All rights reserved.
// Licensed under GPT-OPS License v2.1 — https://gpt-ops-builder.vercel.app/license.html
// Authored as part of the GPT-OPS Instruction Architecture by JOHNJOHNFM.

function copyToClipboard() {
  const outputText = document.getElementById("output").value;
  const hiddenAttribution = `

`;

  navigator.clipboard.writeText(outputText + hiddenAttribution)
    .then(() => {
      alert("Output copied to clipboard with GPT-Ops attribution.");
    })
    .catch(err => {
      console.error('Failed to copy:', err);
    });
}
