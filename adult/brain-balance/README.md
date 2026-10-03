# Brain Balance

An illustrated trainer for balancing emotion (the heart) and reason (the head)
with the ABC method: **Ask** what you feel and what's true, **Balance** the
two, then **Choose**.

## How it plays

1. **Ten moments.** Each one shows an illustrated situation and three responses:
   one heart-led, one head-led (rigid or overthinking), and one balanced.
2. **Instant reveal.** After you choose, every option shows how it leans. You
   also see the bias at work, what your heart and head are each saying, and
   an ABC breakdown.
3. **Balance profile.** A tilting scale and your heart, balanced and head
   counts give you a profile (Steady Center, Heart-Led, Head-Led, or Pulled
   Both Ways).
4. **Retrain.** Replay only the moments where you tipped, this time with the
   bias named in advance.
5. **Reflect.** Three prompts end with a personal "balance pledge". Answers
   stay in the browser tab and are never saved or sent.

Press 1–3 to choose and Enter for the next moment. Sound can be toggled with
the speaker button at the top right.

## Files

- `index.html`: page shell
- `styles.css`: all styling, with responsive and reduced-motion support
- `app.js`: screens, game logic and Web Audio sounds
- `data.js`: the 10 scenarios and reflection prompts. Edit this file to change content.
- `assets/`: title and scenario illustrations

## Run locally

There's no build step, but the page uses ES modules, so serve it over HTTP
instead of opening the file directly:

```bash
npx serve .
```
