# Judgment calls

Every decision made that wasn't explicitly specified in the brief.

- **Toast auto-dismiss duration:** 7500ms for normal toasts, 14000ms for rare — the spec said "7.5s" for normal and "14s" for rare; taken literally.
- **Exit animation fallback:** added a 400ms `setTimeout` to `.remove()` the toast element after `.exit` is added, in case `animationend` doesn't fire (e.g. `prefers-reduced-motion`, tab hidden). The 400ms is longer than the 260ms exit animation so it only fires as a safety net.
- **`history.replaceState` hook:** patched alongside `pushState` so hostname is reported on both SPA navigation styles.
- **`mode: 'closed'` shadow DOM:** used `closed` rather than `open` so host-page JavaScript cannot reach into the shadow root and read or manipulate the toast.
- **`font-display: swap`:** used on all `@font-face` declarations per spec §3; swap means text renders immediately in fallback font and swaps when woff2 loads.
- **Quiet hours interpretation:** default `quietStart: '22:00'`, `quietEnd: '09:00'` — treated as an overnight range (quiet from 22:00 to 09:00 next morning). The `isInQuietHours` function detects that `start > end` and treats it as crossing midnight.
- **"1 hour" pause boundary:** `pausedUntil = now + 3600000` (rolling 1 hour). "Today" = midnight tonight. "Until tmrw" = midnight tomorrow night (i.e. 48h from midnight base).
- **Active pause button detection:** derived from the stored `pausedUntil` epoch by comparing against `midnightTonight()` and `midnightTomorrowNight()` boundaries.
- **`lastTabId` / `lastHostname` in DEFAULT_STATE:** added two keys to the storage schema to persist the most-recently-reporting tab across service worker suspension. These are not in the spec's schema table but are required by pacing decision #5.
- **`shownTodayDate` reset logic:** `shownToday` is reset to 0 inline on every `shouldFire()` check when `shownTodayDate !== todayStr()`, rather than using a separate midnight alarm. Simpler and correct.
- **History pruning:** `history` array is pruned to 30 days on every fire, not via a separate cleanup job.
- **`hashText` implementation:** used `Math.imul(31, h) + charCode` (Java-style string hash) for deterministic, collision-resistant IDs. Not cryptographic — just needs to be stable for dedup.
- **Rare message pool dedup:** rare messages go into the same `history` ring buffer as normal messages, using the same 14-day dedup window.
- **Easter-egg context label:** when an easter egg fires, `effectiveCtx` is set to the domain key (e.g. `'youtube'`) in storage as `lastContext`, so "no same context twice in a row" still works correctly for easter-egg domains.
- **Card rotation formula:** `((n % 30) - 15) / 10` where `n` is derived from the first 8 chars of the message ID — yields -1.5deg to +1.5deg deterministically.
- **Archive back button:** uses `history.back()` if history is available, falls back to `window.close()`. No explicit `/` URL to avoid a potential navigation target.
- **Popup fade-in:** 200ms `fadeIn` keyframe on `body` — specified in design spec §4.3.
- **`web_accessible_resources` scope:** `content.css` and `fonts/*` are declared accessible from the same explicit domain list as host permissions (not `<all_urls>`). These files contain no sensitive data, but consistency with the privacy posture is cleaner.
- **Status dot "paused" label:** when `enabled` is true but `pausedUntil` is in the future, the label reads "paused" (not "listening") to accurately reflect the extension's current state.
- **Popup `<script type="module">`:** `popup.js` is loaded as a module so it can use top-level `await` if needed in future; currently doesn't import anything. `reveal.js` and `archive.js` are plain scripts (they don't import ES modules and are self-contained IIFEs).
- **JetBrains Mono subset size (1160 bytes):** the Google Fonts Latin subset for JetBrains Mono at weight 400 is very small — this is expected; it only contains the characters needed for the Latin alphabet.
- **Icon generation:** used a parametric heart curve (sin³/cos series) in Pillow, 4× supersampling then LANCZOS downscale. The 16/32 icons have transparent backgrounds; 48/128 have the paper background.
- **`shopify.com` match pattern:** included as a shopping-context domain per spec §6.1. Custom storefronts on `*.myshopify.com` are not included since they weren't explicitly listed.
- **`dropbox.com` match pattern:** matched `*://dropbox.com/*` and `*://*.dropbox.com/*` rather than specifically `/scl/` paths — the content script only reads `location.hostname`, not the path, so a broader pattern is required and the context mapping is hostname-only anyway.
