// ✖️ GPT OPS Prompt Builder
// Version: v1.4.2
// https://gpt-ops-builder.vercel.app

const VERSION = "v1.4.2";

const toggle = document.getElementById("toggle");
const quickForm = document.getElementById("quickForm");
const fullForm = document.getElementById("fullForm");
const generateStatus = document.getElementById("generateStatus");
const copyStatus = document.getElementById("copyStatus");
const output = document.getElementById("output");

// ✅ GPT Assist toggle element
let gptToggle = document.getElementById("enableGPTAssist");
if (!gptToggle) {
  const t = document.createElement("label");
  t.innerHTML = '<input type="checkbox" id="enableGPTAssist"> Enhance with GPT';
  document.getElementById("controlsSection")?.appendChild(t);
  gptToggle = document.getElementById("enableGPTAssist");
}

const hiddenAttribution = `\n\nGenerated using GPT-OPS v2.1\n© 2024 JOHNJOHNFM — Instruction Architecture by JOHN E. REYNOLDS\nLicense: https://gpt-ops-builder.vercel.app/license.html\nAttribution Required + Ethical Use Only`;

// Form toggle logic
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

// Generate button logic
document.getElementById("generateButton").addEventListener("click", async () => {
  const isQuick = toggle.classList.contains("active-quick");
  let txt = "";
  generateStatus.innerText = "";
  copyStatus.innerText = "";

  if (isQuick) {
    const name = document.getElementById("q_projectName").value.trim();
    const purpose = document.getElementById("q_purpose").value.trim();
    const disc = document.getElementById("q_disciplines").value.trim();
    if (!name || !purpose || !disc) {
      generateStatus.innerText = "Please fill required fields.";
      return;
    }
    txt = `Create full GPT Project Instructions using the GPT OPS method for a ${disc} assistant called ${name}, whose job is to ${purpose}. Include memory, tone, tools, and examples.`;
  } else {
    const get = id => document.getElementById(id).value.trim();
    const fields = ["projectName","purpose","users","disciplines","outputs","tone","values","memory","mustHave","shouldHave","couldHave","wontHave"];
    const labels = ["X PROJECT NAME","X PURPOSE","X PRIMARY USERS","X CORE DISCIPLINE(S)","X PREFERRED OUTPUTS","X BRAND OR TONE","X VALUES OR PRIORITIES","X KEY MEMORY ELEMENTS","X MUST‑HAVE BEHAVIORS","X SHOULD‑HAVE FEATURES","X COULD‑HAVE EXTRAS","X WON'T‑HAVES"];
    let parts = [];
    for (let i = 0; i < fields.length; i++) {
      const val = get(fields[i]);
      if (i < 4 && !val) {
        generateStatus.innerText = "Please fill required fields.";
        return;
      }
      if (val) parts.push(`${labels[i]}: ${val}`);
    }
    parts.unshift("✖ GPT OPS FULL INSTRUCTIONS");
    txt = parts.join("\n");
    if (parts.length > 1) {
      txt += "\n\nAlso include 3–5 example input/output pairs showing how this GPT should respond. Tone should be professional and clear. You may include comments.";
    }
  }

  output.value = txt;

  // ✅ GPT Assist API Call
  if (gptToggle.checked) {
    generateStatus.innerText = "Enhancing with GPT...";
    try {
      const result = await callGPTAssist(txt);
      if (result.enhanced_instruction) {
        output.value = result.enhanced_instruction;
        generateStatus.innerText = "GPT Enhancement Complete.";
      } else {
        generateStatus.innerText = "GPT returned no enhancement.";
      }
    } catch (err) {
      console.error("GPT Assist error:", err);
      generateStatus.innerText = "GPT Assist failed.";
    }
  }
});

// Copy button logic
document.getElementById("copyButton").addEventListener("click", () => {
  const text = output.value.trim();
  generateStatus.innerText = "";
  copyStatus.innerText = "";
  if (text) {
    copyToClipboard(text).then(() => copyStatus.innerText = "Prompt copied!").catch(() => copyStatus.innerText = "Prompt copied! (fallback)");
  } else {
    copyStatus.innerText = "Please generate a prompt first.";
  }
});

// Clipboard utility
function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    const finalText = text + hiddenAttribution;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(finalText).then(resolve).catch(reject);
    } else {
      const temp = document.createElement("textarea");
      temp.value = finalText;
      document.body.appendChild(temp);
      temp.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (e) {
        reject(e);
      } finally {
        document.body.removeChild(temp);
      }
    }
  });
}

// ✅ GPT Assist API Function
async function callGPTAssist(instructionText) {
  try {
    const response = await fetch("https://got-ops-api.onrender.com/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instruction: instructionText,
        failure_type: "soft_flag",
        mode: "Strict",
        context_tags: ["ambiguity"],
        desired_fix_type: "clarify",
        language_register: "professional",
        target_role: "AI assistant",
        useAI: true
      })
    });

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("GPT Assist failed:", err);
    return { enhanced_instruction: null };
  }
}

// ✅ Quick Info Callout logic
document.addEventListener('DOMContentLoaded', () => {
  const quickInfoIcon = document.getElementById('quickInfoIcon');
  const gptOpsInfoCallout = document.getElementById('gptOpsInfoCallout');
  let dismissTimeout;

  if (!quickInfoIcon || !gptOpsInfoCallout) {
    console.error('Quick Info elements not found');
    return;
  }

  function showCallout() {
    if (dismissTimeout) clearTimeout(dismissTimeout);
    gptOpsInfoCallout.classList.remove('hidden');
    void gptOpsInfoCallout.offsetWidth;
    gptOpsInfoCallout.classList.add('active');
  }

  function hideCallout() {
    gptOpsInfoCallout.classList.remove('active');
    dismissTimeout = setTimeout(() => {
      gptOpsInfoCallout.classList.add('hidden');
    }, 300);
  }

  quickInfoIcon.addEventListener('mouseenter', showCallout);
  quickInfoIcon.addEventListener('mouseleave', hideCallout);
  gptOpsInfoCallout.addEventListener('mouseenter', () => {
    if (dismissTimeout) clearTimeout(dismissTimeout);
  });
  gptOpsInfoCallout.addEventListener('mouseleave', hideCallout);
  quickInfoIcon.addEventListener('focus', showCallout);
  quickInfoIcon.addEventListener('blur', hideCallout);
});
