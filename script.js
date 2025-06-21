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
