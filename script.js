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
    const disc = document.getElementById("q_disciplines").value.trim();
    if (!name || !purpose) {
      generateStatus.innerText = "Please fill required fields.";
      return;
    }
    // Corrected QUICK prompt output logic
    txt = `Create full GPT Project Instructions using the GPT OPS method for a [TYPE] assistant called ${name}, whose job is to ${purpose}. Include memory, tone, tools, and examples.`;
  } else {
    const get = id => document.getElementById(id).value.trim();
    const fields = ["projectName","purpose","users","disciplines","outputs","tone","values","memory","mustHave","shouldHave","couldHave","wontHave"];
    // Corrected labels for FULL prompt output based on PDF
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
    let parts = []; // Start with an empty array for parts

    for (let i = 0; i < fields.length; i++) {
      const val = get(fields[i]);
      if (i < 3 && !val) { // Project Name, Purpose, Primary Users are required
        generateStatus.innerText = "Please fill required fields.";
        return;
      }
      // Only add a line if the value is not empty
      if (val) {
          parts.push(`${labels[i]}: ${val}`);
      }
    }

    // Add the main title at the beginning
    parts.unshift("✖ GPT OPS FULL INSTRUCTIONS");

    txt = parts.join("\n");

    // Add the additional instructional text for FULL prompt, only if content was generated beyond just the title
    if (parts.length > 1) { // Check if there's more than just the title
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
