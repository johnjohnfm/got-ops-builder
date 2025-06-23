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

    let dismissTimeout;

    if (!quickInfoIcon || !gptOpsInfoCallout) {
        console.error('Quick Info elements not found. Check your HTML IDs.');
        return;
    }

    function positionCallout() {
        const iconRect = quickInfoIcon.getBoundingClientRect(); // Get position relative to viewport for dimensions
        const calloutRect = gptOpsInfoCallout.getBoundingClientRect(); // Get own dimensions

        // Calculate top position: callout height + offset above the icon's top edge
        // Since callout is absolutely positioned within the relative icon,
        // we use negative value from icon's top.
        const topOffset = -(calloutRect.height + 15); // 15px is the desired offset

        // Calculate left position: center of the icon minus half of callout width
        const leftOffset = (iconRect.width / 2) - (calloutRect.width / 2);

        // Apply these offsets as CSS top/left values
        gptOpsInfoCallout.style.top = `${topOffset}px`;
        gptOpsInfoCallout.style.left = `${leftOffset}px`;

        // Adjust arrow position to be horizontally centered on the icon's actual width
        const arrowElement = gptOpsInfoCallout.querySelector('.quick-info-arrow');
        if (arrowElement) {
             arrowElement.style.left = `${iconRect.width / 2}px`; // Center on icon's width
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

// Quick Info Callout JavaScript Logic
document.addEventListener('DOMContentLoaded', () => {
    const quickInfoIcon = document.getElementById('quickInfoIcon');
    const gptOpsInfoCallout = document.getElementById('gptOpsInfoCallout');

    let dismissTimeout;

    if (!quickInfoIcon || !gptOpsInfoCallout) {
        console.error('Quick Info elements not found. Check your HTML IDs.');
        return;
    }

    function positionCallout() {
        const iconRect = quickInfoIcon.getBoundingClientRect();
        const calloutRect = gptOpsInfoCallout.getBoundingClientRect();

        const topOffset = -(calloutRect.height + 15);
        const leftOffset = (iconRect.width / 2) - (calloutRect.width / 2);

        gptOpsInfoCallout.style.top = `${topOffset}px`;
        gptOpsInfoCallout.style.left = `${leftOffset}px`;

        const arrowElement = gptOpsInfoCallout.querySelector('.quick-info-arrow');
        if (arrowElement) {
             arrowElement.style.left = `${iconRect.width / 2}px`;
             arrowElement.style.transform = `translateX(-50%)`;
        }
        console.log('Callout positioned: top=' + topOffset + 'px, left=' + leftOffset + 'px'); // ADD THIS LINE
    }

    function showCallout() {
        console.log('showCallout function called'); // ADD THIS LINE
        if (dismissTimeout) {
            clearTimeout(dismissTimeout);
        }
        gptOpsInfoCallout.classList.remove('hidden');
        void gptOpsInfoCallout.offsetWidth;
        gptOpsInfoCallout.classList.add('active');
        positionCallout();
        console.log('Callout should be active now.'); // ADD THIS LINE
    }

    function hideCallout() {
        console.log('hideCallout function called'); // ADD THIS LINE
        gptOpsInfoCallout.classList.remove('active');
        dismissTimeout = setTimeout(() => {
            gptOpsInfoCallout.classList.add('hidden');
        }, 300);
        console.log('Callout should be hiding now.'); // ADD THIS LINE
    }

    // Event Listeners for Hover
    quickInfoIcon.addEventListener('mouseenter', () => {
        console.log('Mouse entered quickInfoIcon'); // ADD THIS LINE
        showCallout();
    });
    quickInfoIcon.addEventListener('mouseleave', () => {
        console.log('Mouse left quickInfoIcon'); // ADD THIS LINE
        hideCallout();
    });

    // Keep the callout visible if the mouse moves onto it
    gptOpsInfoCallout.addEventListener('mouseenter', () => {
        console.log('Mouse entered callout area'); // ADD THIS LINE
        if (dismissTimeout) {
            clearTimeout(dismissTimeout);
        }
    });
    gptOpsInfoCallout.addEventListener('mouseleave', () => {
        console.log('Mouse left callout area'); // ADD THIS LINE
        hideCallout();
    });

    // For accessibility (keyboard users)
    quickInfoIcon.addEventListener('focus', () => {
        console.log('quickInfoIcon focused'); // ADD THIS LINE
        showCallout();
    });
    quickInfoIcon.addEventListener('blur', () => {
        console.log('quickInfoIcon blurred'); // ADD THIS LINE
        hideCallout();
    });
});

