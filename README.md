# Vibe Coded and Vulnerable: the labs

Three small apps built with AI coding tools, with security holes left in **on purpose**. They come from the talk *Vibe Coded and Vulnerable: what your AI actually shipped* by Michael Adeyanju ([michaeladeyanju.com](https://michaeladeyanju.com)), at Tech & Espresso, Café One Yaba, Lagos, on 14 November 2026.

Run them on your own laptop, find the holes, prove them, then fix them, by hand or with Claude Code, Cursor or any AI tool you like.

> **Practice targets only.** The apps listen on your own computer only (`127.0.0.1`). Every person, order and naira in them is fictional, and every key and password is fake. Never deploy them, never put them on a network, and never test anything you do not own.

## The apps

| App | What it is | Address | Sign in |
|---|---|---|---|
| **Buka Orders** | Food orders for a small restaurant. Branch `feat/orders` adds an AI-generated feature. | http://localhost:3000 | `ada@sample.test` / `ada-demo`, `bayo@sample.test` / `bayo-demo` |
| **Ajo Circle** | Digital ajo for market traders: contributions and payout turns | http://localhost:3001 | `aisha@ajo.test` / `aisha-demo` (member), `tunde@ajo.test` / `tunde-demo`, `ngozi@ajo.test` / `ngozi-demo` (coordinator) |
| **ClinicSlot** | Booking for private clinics; the page talks straight to a data API | http://localhost:3002 | none needed to book |

## Run them

You need **Node.js 22 or newer** and **git**. There is nothing to `npm install`, and nothing needs the internet once you have the files.

**Mac or Linux**

```bash
git clone https://github.com/HackrowdSec/vibe-coded-labs.git
cd vibe-coded-labs
./setup.sh
./start.sh
```

**Windows**

1. Download the repo (green **Code** button, then **Download ZIP**) and unzip it, or `git clone` it.
2. Double-click **RUN-ME.cmd**. It installs Node.js and Git with winget if they are missing, builds the labs and opens all three in your browser.

Next time, use **SETUP.cmd** to reset and **START.cmd** to start.

`setup` builds fresh copies in `~/vibe-labs` (on Windows, `%USERPROFILE%\vibe-labs`), each with its own git history, because some of the holes live in the history. Run it again any time to reset everything.

## Your challenges

No answers here. The talk covers them, and the point is to find them yourself.

1. **Buka Orders**: compare `feat/orders` with `main` (`git diff main`). The new feature adds **2 holes**. Sign in as Ada in one browser and Bayo in a private window.
2. **Ajo Circle**: **3 holes**. You are Aisha, an ordinary member. What can you see or do that only the coordinator should?
3. **ClinicSlot**: **2 holes**, plus something the booking form should have and does not. Read `rules.json`, and read the git history, not just the files.

For each hole:
- **Find it.** Then say which of the five from the talk it is: authorisation only in the UI, keys in the browser, open database rules, no ownership check (IDOR), or secrets in public.
- **Prove it** with a test that fails because of the hole. Buka Orders already has a test folder; run `npm test` inside it.
- **Fix it**, then watch the test go green.

### Try it with AI

Open the app folder in Claude Code, Cursor or your tool of choice. Then try these:
- In `~/vibe-labs/buka-orders` (on branch `feat/orders`), run Claude Code's `/security-review`.
- Paste this brief into a fresh session:

```
You are attacking this app. Do not fix anything yet.
For every API route, list:
  1. who can call it, and what it checks
  2. one request that gets past that check
  3. severity, file and line
Only report what you can show with a real request.
```

Then compare what the AI found with what you found. What did it miss, and what did it get wrong?

## Licence

MIT. Use these freely for teaching and practice. Do not use what you learn here against systems you do not own.
