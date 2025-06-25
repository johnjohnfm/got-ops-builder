// logicPlus.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // pulled from GitHub Secrets or .env
});

export async function runGPTAssist(payload) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: "You are a logic assistant that enhances and clarifies ambiguous, vague, or logically flawed instructions based on the GPT-Ops validation system."
        },
        {
          role: "user",
          content: `
Instruction: ${payload.instruction}
Failure Type: ${payload.failure_type}
Context Tags: ${payload.context_tags?.join(", ")}
Desired Fix: ${payload.desired_fix_type}
Language Register: ${payload.language_register}
Target Role: ${payload.target_role}
Mode: ${payload.mode}

Please return:
1. Revised Instruction
2. Reason for Change
3. Scoring Estimate [0.0–1.0]
          `.trim()
        }
      ]
    });

    const result = response.choices[0].message.content;

    return {
      original_instruction: payload.instruction,
      enhanced_output: result,
      model: response.model,
      cost_estimate: "Minimal – gpt-3.5-turbo (~$0.002 per call)"
    };
  } catch (err) {
    console.error("GPT Assist Error:", err.message);
    return { error: "GPT API call failed." };
  }
}
