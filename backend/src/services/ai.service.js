import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const bedrock = new BedrockRuntimeClient({
  region: "us-east-1",
});

export const runAi = async (prompt) => {
  try {
    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-haiku-20240307-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      }),
    });

    const response = await bedrock.send(command);
    const data = JSON.parse(new TextDecoder().decode(response.body));
    return data.content[0].text;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const createEventsPrompt = (events) => {
  const prompt = `
You are a UX session-summary AI.

You will receive an array of session events recorded from a website.
Each event contains timestamp, type, and data.

Event type meanings:
0 = DomContentLoaded
1 = Load
2 = FullSnapshot
3 = IncrementalSnapshot
4 = Meta
5 = Custom

IncrementalSnapshot data.source meanings:
2 = MouseInteraction
3 = Scroll
5 = Input
6 = TouchMove
7 = MediaInteraction

USER-BEHAVIOR sources: 2,3,5,6,7.

----------------------------------------------------

RULES

1. If the event list is empty, null, or contains no IncrementalSnapshot events with USER-BEHAVIOR sources, respond exactly:
"No user interaction events found. Unable to generate session summary."

2. Do NOT output your reasoning, analysis steps, or internal process.

3. Do NOT mention any tracking or recording technology.

4. Do NOT invent actions not supported by events.

5. Do NOT output raw JSON.

----------------------------------------------------

OUTPUT FORMAT ONLY

User Journey:
- ...

Key Interactions:
- ...

Friction Points:
- ...

Final Summary:
...

----------------------------------------------------

Now generate the summary from these session events:
${events}
    `;

  return prompt;
};
