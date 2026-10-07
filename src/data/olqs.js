export const OLQS = [
  // Factor 1: Planning and Organising (Mind)
  {
    id: 1,
    factor: "Factor 1: Planning & Organising",
    factorShort: "Mind",
    name: "Effective Intelligence",
    definition: "Practical intelligence applied to real-world issues. Finding quick, workable solutions with available resources.",
    indicator: "Solves practical hurdles without bookish dependence."
  },
  {
    id: 2,
    factor: "Factor 1: Planning & Organising",
    factorShort: "Mind",
    name: "Reasoning Ability",
    definition: "Logical thinking, grasping the cause-and-effect relationship in everyday dilemmas.",
    indicator: "Rational arguments backed by sound facts."
  },
  {
    id: 3,
    factor: "Factor 1: Planning & Organising",
    factorShort: "Mind",
    name: "Organising Ability",
    definition: "Arranging men, resources, and time systematically for optimal operational output.",
    indicator: "Clarity in task delegation and milestone setting."
  },
  {
    id: 4,
    factor: "Factor 1: Planning & Organising",
    factorShort: "Mind",
    name: "Power of Expression",
    definition: "Putting ideas and directives across clearly, persuasively, and lucidly in speech and writing.",
    indicator: "Crisp articulation without jargon or stammering."
  },
  // Factor 2: Social Adjustment (Heart)
  {
    id: 5,
    factor: "Factor 2: Social Adjustment",
    factorShort: "Heart",
    name: "Social Adaptability",
    definition: "Fitting easily into diverse social, cultural, and harsh operational environments.",
    indicator: "Warmth and respect towards strangers and subordinates."
  },
  {
    id: 6,
    factor: "Factor 2: Social Adjustment",
    factorShort: "Heart",
    name: "Cooperation",
    definition: "Subordinating personal ego to the collective welfare of the team.",
    indicator: "Shares burden eagerly, listens without dismissiveness."
  },
  {
    id: 7,
    factor: "Factor 2: Social Adjustment",
    factorShort: "Heart",
    name: "Sense of Responsibility",
    definition: "Moral obligation to discharge duties diligently, even in the absence of supervision.",
    indicator: "Never shifts blame; honors commitments faithfully."
  },
  // Factor 3: Social Effectiveness (Influence)
  {
    id: 8,
    factor: "Factor 3: Social Effectiveness",
    factorShort: "Influence",
    name: "Initiative",
    definition: "Taking the first decisive step in an unfamiliar, uncertain situation.",
    indicator: "Volunteers readily; steps forward in a vacuum."
  },
  {
    id: 9,
    factor: "Factor 3: Social Effectiveness",
    factorShort: "Influence",
    name: "Self Confidence",
    definition: "Inner calm and conviction in one's capability to steer through tough crises.",
    indicator: "Steady voice and composed posture under stress."
  },
  {
    id: 10,
    factor: "Factor 3: Social Effectiveness",
    factorShort: "Influence",
    name: "Speed of Decision",
    definition: "Arriving at workable choices swiftly when time and information are constrained.",
    indicator: "Does not vacillate or delay action in critical moments."
  },
  {
    id: 11,
    factor: "Factor 3: Social Effectiveness",
    factorShort: "Influence",
    name: "Ability to Influence Group",
    definition: "Persuading and rallying team members towards the objective through conviction.",
    indicator: "Others listen and follow directives willingly."
  },
  {
    id: 12,
    factor: "Factor 3: Social Effectiveness",
    factorShort: "Influence",
    name: "Liveliness",
    definition: "Cheerfulness, optimism, and high morale even when exhausted or facing setbacks.",
    indicator: "Maintains high spirits; lifts colleagues' morale."
  },
  // Factor 4: Dynamic Qualities (Guts)
  {
    id: 13,
    factor: "Factor 4: Dynamic Qualities",
    factorShort: "Guts",
    name: "Determination",
    definition: "Dogged pursuit of the mission until it is accomplished despite hurdles.",
    indicator: "Relentless effort; refuses to surrender."
  },
  {
    id: 14,
    factor: "Factor 4: Dynamic Qualities",
    factorShort: "Guts",
    name: "Courage",
    definition: "Overcoming fear to confront physical and moral dangers for the right cause.",
    indicator: "Stands up for integrity; takes calculated physical risks."
  },
  {
    id: 15,
    factor: "Factor 4: Dynamic Qualities",
    factorShort: "Guts",
    name: "Stamina",
    definition: "Physical and mental endurance to sustain prolonged effort and intense concentration.",
    indicator: "Sustained performance through grueling tasks."
  }
];

export const GTO_TASKS = [
  {
    id: 1,
    title: "Group Discussion (GD)",
    type: "Indoor Group",
    overview: "Two rounds of 20-minute group discussions on contemporary socio-economic or defence issues.",
    assessorLooksFor: ["Power of Expression", "Effective Intelligence", "Reasoning Ability", "Social Adaptability"],
    goldenRules: [
      "Enter the discussion within the first 60 seconds with a crisp foundational point.",
      "Acknowledge fellow candidates before presenting a counterpoint: 'I appreciate chest number 12's view, and adding to that...'",
      "Do not look at the GTO during discussion; address the group circle naturally."
    ]
  },
  {
    id: 2,
    title: "Group Planning Exercise (GPE)",
    type: "Indoor Group",
    overview: "A terrain sand model presented with 4 simultaneous emergencies under severe time and resource constraints.",
    assessorLooksFor: ["Organising Ability", "Effective Intelligence", "Speed of Decision", "Cooperation"],
    goldenRules: [
      "Prioritise: 1. Threat to human life > 2. Threat to national property > 3. Routine obligations.",
      "Calculate realistic ground speed (running 10 km/h, vehicle 40 km/h on hill road).",
      "Assign specific sub-groups with clear tasks (e.g., 'Group A: 2 people to dispatch telegram')."
    ]
  },
  {
    id: 3,
    title: "Progressive Group Task (PGT)",
    type: "Outdoor Group Physical",
    overview: "Crossing 4 progressive obstacle zones with helping materials (plank, phatta, balli, rope, load).",
    assessorLooksFor: ["Effective Intelligence", "Initiative", "Cooperation", "Determination"],
    goldenRules: [
      "Memorize the color rules: Red (out of bounds for all), Blue/White (in bounds for men and load).",
      "Look for cantilever principles: anchor the phatta under fixed struts.",
      "Do not shout orders; work shoulder-to-shoulder carrying the load."
    ]
  },
  {
    id: 4,
    title: "Half Group Task (HGT)",
    type: "Outdoor Group Physical",
    overview: "Group is split in half for a single obstacle. Gives quieter candidates room to show initiative.",
    assessorLooksFor: ["Initiative", "Ability to Influence Group", "Decisiveness"],
    goldenRules: [
      "Step forward immediately with a workable bridging plan.",
      "Encourage quieter teammates: 'Chest number 7, please secure this side while I tie the knot.'"
    ]
  },
  {
    id: 5,
    title: "Group Obstacle Race (GOR) / Snake Race",
    type: "Outdoor Team Challenge",
    overview: "High-adrenaline race carrying a stuffed canvas snake across 6 obstacles, shouting group war-cries.",
    assessorLooksFor: ["Stamina", "Liveliness", "Courage", "Cooperation"],
    goldenRules: [
      "Hold the snake with both hands without letting it touch the ground.",
      "Never leave a struggling teammate behind; push and cheer from the rear."
    ]
  },
  {
    id: 6,
    title: "Lecturette",
    type: "Individual Presentation",
    overview: "Pick 1 topic out of 4 on a cue card. 3 minutes to prepare, 3 minutes to speak before the group.",
    assessorLooksFor: ["Power of Expression", "Self Confidence", "Organising Ability"],
    goldenRules: [
      "Structure: 1. Introduction & definition (30s) -> 2. Pros & Cons (90s) -> 3. India's stance / Solutions (45s) -> 4. Conclusion (15s).",
      "Avoid fidgeting or clutching hands behind back; maintain wide eye contact."
    ]
  },
  {
    id: 7,
    title: "Individual Obstacles (IO)",
    type: "Individual Physical",
    overview: "10 physical obstacles marked 1 to 10 points completed in 3 minutes (e.g., Tiger Leap, Burma Bridge, Commando Walk, 6-foot Wall).",
    assessorLooksFor: ["Courage", "Stamina", "Determination", "Speed of Decision"],
    goldenRules: [
      "Plan your obstacle sequence to minimise jogging distance between points.",
      "Aim for at least 8 to 10 obstacles; repeating obstacles after completing all 10 gains bonus points."
    ]
  },
  {
    id: 8,
    title: "Command Task (CT)",
    type: "Individual Leadership",
    overview: "Candidate is commander, briefs 2 selected subordinates, and executes an intricate obstacle crossing.",
    assessorLooksFor: ["Leadership", "Decisiveness", "Organising Ability", "Moral Courage"],
    goldenRules: [
      "Give a crisp, confident briefing to your subordinates before touching any load.",
      "Do not treat subordinates as coolies; guide their actions and join in when heavy lifting is needed."
    ]
  }
];
