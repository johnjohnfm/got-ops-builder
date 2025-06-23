const toggle = document.getElementById("toggle");
const quickForm = document.getElementById("quickForm");
const fullForm = document.getElementById("fullForm");
const generateStatus = document.getElementById("generateStatus");
const copyStatus = document.getElementById("copyStatus");
const output = document.getElementById("output");
document.querySelectorAll('input[name="formMode"], .switch').forEach(el => {
  // The switch itself triggers form toggle
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

document.getElementById("generateButton").addEventListener("click", () => {
  const isQuick = toggle.classList.contains("active-quick");
  let txt = "";
  generateStatus.innerText = "";
  copyStatus.innerText = "";

  if (isQuick) {
    const name = document.getElementById("q_projectName").value.trim();
    const purpose = document.getElementById("q_purpose").value.trim();
    const disc = document.getElementById("q_disciplines").value.trim(); // Core Disciplines for [TYPE]
    if (!name || !purpose) {
      generateStatus.innerText = "Please fill required fields.";
      return;
    }
    // Corrected QUICK prompt output to fill [TYPE], [NAME], and [MISSION]
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
        "X WON’T-HAVES"
    ];
    let parts = [];

    for (let i = 0; i < fields.length; i++) {
      const val = get(fields[i]);
      if (i < 3 && !val) {
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

document.getElementById("copyButton").addEventListener("click", () => {
  const text = output.value.trim();
  generateStatus.innerText = "";
  copyStatus.innerText = "";

  if (text) {
    output.select();
    document.execCommand("copy");
    copyStatus.innerText = "Prompt copied!";
  } else {
    copyStatus.innerText = "Please generate a prompt first.";
  }
});

// Quick Info Callout JavaScript Logic
document.addEventListener('DOMContentLoaded', () => {
    const quickInfoIcon = document.getElementById('quickInfoIcon');
    const gptOpsInfoCallout = document.getElementById('gptOpsInfoCallout');
    const quickInfoContainer = document.getElementById('quickInfoContainer');

    let dismissTimeout;

    if (!quickInfoIcon || !gptOpsInfoCallout || !quickInfoContainer) {
        console.error('Quick Info elements not found. Check your HTML IDs.');
        return;
    }

    function positionCallout() {
        const iconRect = quickInfoIcon.getBoundingClientRect();
        const calloutRect = gptOpsInfoCallout.getBoundingClientRect();
        
        // Calculate horizontal center of the icon relative to the viewport
        const iconCenterX = iconRect.left + (iconRect.width / 2);

        // Calculate desired left position for the callout to be centered under the icon
        let calloutLeft = iconCenterX - (calloutRect.width / 2);

        // Basic boundary checking for the left edge
        if (calloutLeft < 10) { // Keep 10px from left edge
            calloutLeft = 10;
        }

        // Calculate the top position (above the icon)
        const calloutTop = iconRect.top - calloutRect.height - 15; // 15px offset from icon

        // Apply positions
        gptOpsInfoCallout.style.left = `${calloutLeft}px`;
        gptOpsInfoCallout.style.top = `${calloutTop}px`;

        // Adjust arrow position if the callout shifted due to boundary checks
        // This makes the arrow always point to the original icon's center
        const arrowElement = gptOpsInfoCallout.querySelector('.quick-info-arrow');
        if (arrowElement) {
            const arrowLeftRelativeToCallout = iconCenterX - calloutLeft;
            arrowElement.style.left = `${arrowLeftRelativeToCallout}px`;
            arrowElement.style.transform = `translateX(-50%)`;
        }
    }

    function showCallout() {
        if (dismissTimeout) {
            clearTimeout(dismissTimeout);
        }
        gptOpsInfoCallout.classList.remove('hidden');
        // Force reflow to ensure CSS transition works from the 'hidden' state
        void gptOpsInfoCallout.offsetWidth;
        gptOpsInfoCallout.classList.add('active');
        positionCallout(); // Position correctly after making it visible
    }

    function hideCallout() {
        gptOpsInfoCallout.classList.remove('active');
        dismissTimeout = setTimeout(() => {
            gptOpsInfoCallout.classList.add('hidden');
        }, 300); // Match CSS transition duration
    }

    // Event Listeners for Hover
    quickInfoIcon.addEventListener('mouseenter', showCallout);
    quickInfoIcon.addEventListener('mouseleave', hideCallout);

    // Keep the callout visible if the mouse moves onto it
    gptOpsInfoCallout.addEventListener('mouseenter', () => {
        if (dismissTimeout) {
            clearTimeout(dismissTimeout); // Prevent auto-dismiss if mouse enters callout
        }
    });
    gptOpsInfoCallout.addEventListener('mouseleave', hideCallout);

    // For accessibility (keyboard users)
    quickInfoIcon.addEventListener('focus', showCallout);
    quickInfoIcon.addEventListener('blur', hideCallout);
});
