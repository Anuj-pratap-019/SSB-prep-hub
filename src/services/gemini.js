// ── Gemini AI Service for SSB Evaluation ──
// Supports multi-model fallback: gemini-flash-latest -> gemini-3.5-flash-lite

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const PRIMARY_MODEL = 'gemini-flash-latest';
const FALLBACK_MODEL = 'gemini-3.5-flash-lite';

async function callGemini(prompt, systemInstruction = '', jsonMode = true, image = null) {
  if (!API_KEY) {
    throw new Error('Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in .env');
  }

  const attachments = image ? (Array.isArray(image) ? image : [image]) : [];
  const payload = {
    contents: [{
      parts: [
        { text: prompt },
        ...attachments.map((attachment) => ({
          inlineData: { mimeType: attachment.mimeType, data: attachment.data }
        }))
      ]
    }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 2048,
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  if (jsonMode) {
    payload.generationConfig.responseMimeType = 'application/json';
  }

  // Try primary model, fallback on failure
  for (const model of [PRIMARY_MODEL, FALLBACK_MODEL]) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.warn(`Model ${model} returned ${res.status}:`, errData);
        continue; // Try fallback
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty response from Gemini API');

      if (jsonMode) {
        try {
          return JSON.parse(rawText);
        } catch {
          // Clean json markdown fences if present
          const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          return JSON.parse(cleaned);
        }
      }
      return rawText;
    } catch (err) {
      console.warn(`Attempt with ${model} failed:`, err);
    }
  }

  throw new Error('All Gemini API models failed. Please verify your internet connection or API quota.');
}

/**
 * PPDT Story Evaluation
 */
export async function evaluatePPDT({ story, characters, actionSummary, narration = '', storyImage = null }) {
  const systemInstruction = `You are a Senior Psychological Assessor (Psychologist) at a Services Selection Board (SSB), Indian Armed Forces.
You assess candidate PPDT (Picture Perception and Discussion Test) stories strictly on the 15 Officer Like Qualities (OLQs):
Factor 1: Effective Intelligence, Reasoning Ability, Organising Ability, Power of Expression
Factor 2: Social Adaptability, Cooperation, Sense of Responsibility
Factor 3: Initiative, Self Confidence, Speed of Decision, Ability to Influence the Group, Liveliness
Factor 4: Determination, Courage, Stamina

Return a structured JSON with:
{
  "overallScore": number (1 to 5 stars),
  "verdict": string ("Recommended", "Borderline", or "Needs Improvement"),
  "heroAnalysis": {
    "identified": boolean,
    "heroNameOrRole": string,
    "ageAppropriate": boolean,
    "comment": string
  },
  "structure": {
    "past": string (assessment of background/context),
    "present": string (assessment of problem tackling/action),
    "future": string (assessment of positive outcome/resolution),
    "score": number (out of 10)
  },
  "olqsDemonstrated": [
    { "name": string, "factor": string, "quote": string, "insight": string }
  ],
  "olqsMissing": [string],
  "redFlags": [string],
  "positivityRating": number (1 to 10),
  "actionOrientationRating": number (1 to 10),
  "narrationFeedback": string (critique of verbal narration if provided),
  "keyStrengths": [string],
  "improvementSuggestions": [string],
  "modelStorySnippet": string (A crisp 3-sentence model revision illustrating how to strengthen this candidate's plot)
}`;

  const prompt = `Evaluate this SSB PPDT submission:
Character Box Details:
- Total Characters Identified: ${characters.count || 'Not specified'}
- Main Character / Hero: Age ${characters.heroAge || 'N/A'}, Sex: ${characters.heroSex || 'N/A'}, Mood: ${characters.heroMood || 'N/A'}
- Action Chosen: "${actionSummary || 'N/A'}"

Written Story:
"""
${story}
"""

Handwritten Story Image:
${storyImage ? 'An image of the candidate handwritten story is attached. Read it carefully and use it as the primary written story if typed text is empty.' : 'No handwritten story image provided.'}

Spoken Narration Transcript:
"""
${narration || 'No audio narration provided'}
"""

Provide an honest, constructive, expert SSB psychological assessment in the specified JSON format.`;

  return callGemini(prompt, systemInstruction, true, storyImage);
}

/**
 * TAT Story Evaluation
 */
export async function evaluateTAT({ story, sceneTheme, sceneDescription }) {
  const systemInstruction = `You are an SSB Psychologist assessing a TAT (Thematic Apperception Test) story.
Evaluate the story based on Officer Like Qualities, realistic problem resolution, and psychological soundness.
Return JSON:
{
  "score": number (1-10),
  "heroAssessment": string,
  "olqsFound": [{ "name": string, "evidence": string }],
  "psychologicalTendencies": {
    "optimism": string,
    "resilience": string,
    "leadership": string
  },
  "weaknesses": [string],
  "recommendations": [string],
  "improvedVersion": string
}`;

  const prompt = `Theme: ${sceneTheme}
Scene Description: ${sceneDescription}
Candidate's Story:
"""
${story}
"""`;

  return callGemini(prompt, systemInstruction, true);
}

async function urlToImageData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Unable to read a TAT picture for assessment.');
  const blob = await response.blob();
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  const [header, data] = dataUrl.split(',');
  return {
    mimeType: header.match(/data:(.*);base64/)?.[1] || blob.type || 'image/jpeg',
    data
  };
}

export async function evaluateTATBatch(submissions) {
  const systemInstruction = `You are a senior SSB psychologist assessing a complete 12-card Thematic Apperception Test.
Assess every card independently and then identify consistent patterns across the candidate's stories.
The picture attachments are provided in card order, followed by any handwritten story attachments in the same card order.
Do not invent visual details that are not present. Do not treat the picture filename as a theme.
Assess realistic action, emotional balance, initiative, responsibility, cooperation, determination,
effective intelligence, power of expression, social adaptability, self-confidence, and overall OLQ projection.
Return JSON:
{
  "overallScore": number,
  "overallAssessment": string,
  "olqs": [{ "name": string, "evidence": string }],
  "cardAssessments": [
    { "cardNumber": number, "score": number, "analysis": string, "olqs": [string], "improvement": string }
  ],
  "strengths": [string],
  "improvementSuggestions": [string]
}`;

  const pictureAttachments = [];
  const handwrittenAttachments = [];
  const cardLines = [];
  for (const submission of submissions) {
    cardLines.push(`Card ${submission.cardNumber} (${submission.pictureTitle}): Typed story: "${submission.story || 'No typed story.'}"`);
    if (submission.pictureImage) {
      pictureAttachments.push(await urlToImageData(submission.pictureImage));
    }
    if (submission.storyImage) {
      handwrittenAttachments.push(submission.storyImage);
    }
  }

  const prompt = `Evaluate this complete TAT submission.
There are 12 cards: cards 1-11 use the attached pictures, and card 12 is blank and has no picture attachment.
Image attachment order: picture cards 1-11, then handwritten story images in ascending card order.
${cardLines.join('\n')}
Use the visual evidence from each picture attachment when assessing its paired story.`;

  return callGemini(prompt, systemInstruction, true, [...pictureAttachments, ...handwrittenAttachments]);
}

/**
 * WAT Single Word Response Evaluator
 */
export async function evaluateWATResponse(word, sentence) {
  const systemInstruction = `You are an SSB Psychologist assessing a single WAT (Word Association Test) sentence.
A good WAT response is:
1. Active voice, positive connotation, non-preachy (avoid "One must...", "Always...", "Never...")
2. Reflects spontaneous OLQs and healthy mindset.
Return JSON:
{
  "rating": "Excellent" | "Good" | "Average" | "Negative / Preachy",
  "score": number (1-5),
  "olqReflected": string,
  "isPreachy": boolean,
  "isPositive": boolean,
  "critique": string,
  "betterAlternative": string
}`;

  const prompt = `Word: "${word}"
Candidate sentence: "${sentence}"`;

  return callGemini(prompt, systemInstruction, true);
}

export async function evaluateWATSheet(words, sheetImage) {
  const systemInstruction = `You are an SSB psychologist reviewing a photographed handwritten WAT answer sheet.
The sheet is expected to contain one numbered answer per numbered word. Never infer a sentence for a blank or unreadable entry.
Return JSON:
{
  "answers": [{"number": number, "word": string, "transcription": string, "status": "answered" | "blank" | "unreadable", "score": number, "rating": string, "feedback": string, "betterAlternative": string}],
  "summary": string,
  "strengths": [string],
  "improvementTips": [string]
}
Match by the printed number first, not by sentence order. A skipped answer must remain attached to its numbered word.`;
  const prompt = `Official word sequence:
${words.map((word, index) => `${index + 1}. ${word.word}`).join('\n')}

Read the numbered handwritten responses from the attached sheet. Evaluate answered sentences for relevance to the stimulus, action orientation, practicality, positivity, originality, and OLQ projection.`;
  return callGemini(prompt, systemInstruction, true, sheetImage);
}

/**
 * SRT Reaction Evaluator
 */
export async function evaluateSRTReaction(situation, reaction) {
  const systemInstruction = `You are an SSB Psychologist assessing a Situation Reaction Test (SRT) response.
Check for:
1. Decisive, practical action.
2. Self-reliance and courage.
3. No reliance on supernatural luck, no unnecessary escalation, no freezing.
Return JSON:
{
  "score": number (1-5),
  "verdict": "Effective" | "Partially Effective" | "Ineffective / Passive",
  "olqsDemonstrated": [string],
  "feedback": string,
  "idealReaction": string
}`;

  const prompt = `Situation: "${situation}"
Candidate's reaction: "${reaction}"`;

  return callGemini(prompt, systemInstruction, true);
}

/**
 * Personal Interview (PI) Chatbot response
 */
export async function generatePIReply({ messages, candidateProfile }) {
  const systemInstruction = `You are Colonel R.S. Rathore, a seasoned Interviewing Officer (IO) at 1 AFSB / 21 SSB.
Your demeanor is dignified, sharp, warm yet inquisitive. You probe for depth, authenticity, and Officer Like Qualities.
Candidate Profile:
- Name: ${candidateProfile?.name || 'Candidate'}
- Education: ${candidateProfile?.education || 'Engineering Student'}
- Native Place: ${candidateProfile?.nativePlace || 'India'}
- Preferred Arm/Service: ${candidateProfile?.service || 'Army / Air Force / Navy'}
- Hobbies: ${candidateProfile?.hobbies || 'Sports, reading'}

Rules:
1. Ask one crisp, probing question at a time or respond briefly to their answer and pivot to a logical follow-up.
2. Catch inconsistencies, test depth of general awareness, defence knowledge, family ties, and reasoning.
3. Keep your replies concise (under 80 words) to keep the interview flow snappy.
4. After 6-8 exchanges, if the candidate asks for feedback or says concluding remarks, provide a comprehensive final PI appraisal.`;

  const conversationHistory = messages.map(m => `${m.role === 'user' ? 'Candidate' : 'IO (You)'}: ${m.content}`).join('\n\n');
  const prompt = `Current Interview Transcript:\n${conversationHistory}\n\nRespond as Colonel Rathore:`;

  return callGemini(prompt, systemInstruction, false);
}

/**
 * Self Description (SD) Comprehensive Evaluation
 */
export async function evaluateSelfDescription(sd) {
  const systemInstruction = `You are an SSB Psychologist reviewing a candidate's complete 5-part Self-Description (SD).
Assess:
1. Congruence across Parents, Teachers, Friends, Self, and Future Aims.
2. Self-awareness: Is the candidate genuine about weaknesses? Are weaknesses fatal or improvable?
3. Modesty vs Confidence balance.
Return JSON:
{
  "congruenceScore": number (1-10),
  "overallVerdict": string,
  "positives": [string],
  "inconsistenciesOrRedFlags": [string],
  "personalitySummary": string,
  "improvementTips": [string]
}`;

  const prompt = `Candidate's 5-Part SD:
1. Parents' View: ${sd.parents}
2. Teachers'/Employers' View: ${sd.teachers}
3. Friends' View: ${sd.friends}
4. Self View (Strengths & Weaknesses): ${sd.self}
5. Future Aims & Qualities to Develop: ${sd.aims}`;

  return callGemini(prompt, systemInstruction, true);
}
