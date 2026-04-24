# amorcina&lt;3

*little messages from müsel, through the internet.*

---

## installing it

**1. unzip and find the folder.**
After unzipping, you should see a folder called `amorcina` containing `manifest.json` and a bunch of other files. Keep note of where it lives.

**2. open Chrome's extension settings and load it.**
Go to `chrome://extensions` in the address bar. In the top-right corner, flip on **Developer mode**. Then click **Load unpacked** and select the `amorcina` folder (the one with `manifest.json` inside). Chrome will load it and you'll see a little heart in your toolbar.

**3. you're in.**
A card will open automatically to say hello. Once you close it, the extension goes quiet for 20 minutes, then starts whispering.

---

## using it

Click the heart icon in your toolbar to open the controls. From there you can:

- **turn it on or off** with the toggle
- **change how often** messages appear: whisper (1/day), gentle (2–3/day), or cozy (4–5/day)
- **set quiet hours** so it stays silent while you sleep
- **pause it** for an hour, the rest of today, or until tomorrow

Rare messages (the longer, warmer ones) have a "save this one" button. Saved messages live in the archive — tap "open archive →" in the popup.

---

## troubleshooting

**I don't see any messages.**
Check that the extension is enabled (the toggle in the popup should be on and the status dot should say "listening"). Messages only appear on sites the extension is allowed to run on — social media, coding sites, email, etc. They also won't appear during quiet hours, if paused, or if you've already hit today's daily limit.

**The reveal card didn't open on install.**
Open a new tab, then reload the extension from `chrome://extensions` (the circular arrow icon). The reveal card will open the next time you trigger the install flow. Alternatively, just use the extension normally — messages will still arrive.

**Messages stopped appearing.**
If you closed three messages very quickly (under 2 seconds each), the extension backs off for 24 hours out of respect. It'll resume on its own.

**I want to edit the messages.**
Open `messages.js` in any text editor. Each array is a pool for a specific context. Edit freely, save, then go to `chrome://extensions` and click the circular reload arrow on the extension card.

---

*made by müsel, with a lot of love 💛*
