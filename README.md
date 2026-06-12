# ForHumanityNow — Games

Browser-based educational games built to develop critical thinking, self-awareness, and communication skills. Two audience tracks — teens and adults — each with two games.

---

## Teens

### Bias Breakers
**Path:** `teen/bias_breakers/`
**Entry:** `index.html`

A cyberpunk-styled quiz game where players identify cognitive biases playing out in everyday scenarios. Each of the 10 rounds presents a situation and three answer choices — players select the one that best demonstrates the bias being explored. Correct and incorrect answers are highlighted immediately, and missed biases are listed on the results screen.

**Biases covered:**
Confirmation Bias, Loss Aversion, Anchoring Bias, Availability Heuristic, Hindsight Bias, Overconfidence Bias, Self-Serving Bias, Status Quo Bias, Negativity Bias, Them vs Us Bias.

**Tech:** Phaser 3, ES modules via importmap, Tone.js for audio.

---

### Question Quest
**Path:** `teen/question-quest/`
**Entry:** `index.html`

A scenario-based game that trains players to ask better questions. Each of the 10 rounds shows a real-life teen situation and three possible questions to ask — ranging from reactive to genuinely insightful. Players pick the question that best combines big-picture thinking with relevant detail. Feedback explains why the best question works. Streak tracking rewards consistency.

**Scenarios cover:** friendship tension, low grades, online conflict, peer pressure, family arguments, social exclusion, impulsive posting, and more.

**Tech:** Phaser 3, ES modules via importmap, Tone.js for audio.

---

## Adults

### Bias Awareness
**Path:** `adult/bias-awareness/`
**Entry:** `index.html` (in the bias-awareness folder)

An adult-oriented two-phase bias game. The instinct phase presents each bias as a scenario where players identify the biased response. A follow-on knowledge quiz then tests deeper understanding. Results show score breakdown across both phases.

**Biases covered:** Same 10 as Bias Breakers, framed for adult professional and personal contexts.

**Tech:** Phaser 3, ES modules via importmap, Tone.js for audio.

---

### Question Probe
**Path:** `adult/question_probe/`
**Entry:** `main.js` (React app, no separate index.html)

A React-based game focused on workplace and interpersonal communication. Players are shown professional and personal scenarios and choose the most effective question to ask — one that uncovers context, avoids defensiveness, and moves things forward. Includes a radar chart on the results screen showing communication strengths across categories. Audio feedback on correct and incorrect answers.

**Scenarios cover:** missed deadlines, difficult conversations, financial disagreements, medical consultations, career negotiations, peer feedback, and more.

**Tech:** React (via CDN), htm, Framer Motion, ES modules via importmap.

---

## Running locally

Each game is a standalone set of static files. Serve any game folder with a local static server, for example:

```bash
npx serve teen/bias_breakers
npx serve teen/question-quest
npx serve adult/bias-awareness
npx serve adult/question_probe
```

All assets, scripts, and styles are self-contained within each folder. No build step required.
