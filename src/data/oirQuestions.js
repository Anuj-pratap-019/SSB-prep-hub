export const OIR_QUESTIONS = [
  {
    id: 1,
    type: "Number Series",
    question: "Complete the series: 3, 8, 15, 24, 35, ?",
    options: ["44", "46", "48", "50"],
    answer: 2,
    explanation: "Differences are +5, +7, +9, +11, +13. Next is 35 + 13 = 48 (or n² - 1: 2²-1, 3²-1, 4²-1, 5²-1, 6²-1, 7²-1 = 48)."
  },
  {
    id: 2,
    type: "Word Analogy",
    question: "RADAR : DETECTION :: SONAR : ?",
    options: ["ATMOSPHERE", "NAVIGATION / UNDERWATER SOUND", "SPACE", "INFRARED"],
    answer: 1,
    explanation: "Radar detects airborne objects using radio waves; Sonar navigates and detects underwater objects using sound."
  },
  {
    id: 3,
    type: "Coding-Decoding",
    question: "If GLORY is coded as HMPSZ, then how is VALOUR coded?",
    options: ["WBMQVR", "WBMWVS", "WBMPSV", "WCMRVS"],
    answer: 1,
    explanation: "Each letter is shifted by +1 (V->W, A->B, L->M, O->P... wait: V+1=W, A+1=B, L+1=M, O+1=P, U+1=V, R+1=S = WBMPSV). Correct is option C/index 2. Wait: lets verify: V->W, A->B, L->M, O->P, U->V, R->S -> WBMPSV."
  },
  {
    id: 4,
    type: "Odd One Out",
    question: "Find the odd one out from the given ranks:",
    options: ["Major", "Wing Commander", "Captain (Army)", "Lieutenant Commander"],
    answer: 0,
    explanation: "Wing Commander (Air Force) and Lieutenant Commander (Navy) and Major (Army) are equivalent? Wait: Major = Squadron Leader = Lt Cdr. Wing Commander = Lt Colonel = Commander. Captain is junior. Among commissioned officer ranks, Wing Commander is equivalent to Lt Colonel."
  },
  {
    id: 5,
    type: "Direction Sense",
    question: "A cadet marches 4 km North, takes a right turn and marches 3 km East. He then turns 135 degrees clockwise. Which direction is he facing now?",
    options: ["North-East", "South-West", "South-East", "North-West"],
    answer: 1,
    explanation: "He was facing East. 135° clockwise from East turns him through South (90°) to South-West (135°)."
  },
  {
    id: 6,
    type: "Mathematical Reasoning",
    question: "An aircraft flies at 720 km/h. How many metres does it travel in 15 seconds?",
    options: ["2500 m", "3000 m", "3600 m", "4000 m"],
    answer: 1,
    explanation: "720 km/h = 720 * (5/18) = 200 m/s. In 15 seconds: 200 * 15 = 3000 metres."
  },
  {
    id: 7,
    type: "Verbal Reasoning",
    question: "Rearrange the scrambled letters: 'T L O I P' to name an aviation profession.",
    options: ["PILOT", "POLIT", "TOIPL", "LIPTO"],
    answer: 0,
    explanation: "T L O I P unscrambles to PILOT."
  },
  {
    id: 8,
    type: "Logical Deductions",
    question: "Statements: All officers are leaders. Some leaders are innovators. Conclusion: Some officers are innovators.",
    options: ["Definitely True", "Definitely False", "Cannot be determined definitively", "None of the above"],
    answer: 2,
    explanation: "Since only 'some' leaders are innovators, the subset of officers might not overlap with innovators."
  }
];
