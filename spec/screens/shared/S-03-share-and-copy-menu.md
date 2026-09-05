# S-03 · Share and copy menu

## Meta

Used wherever a link, receipt, or piece of text needs to leave the app
(e.g. `L09-BTN-SHARELINK`, `T02-BTN-SAVE`).

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `S03-BTN-SHARE` | Icon button | Uses the device share sheet where available; falls back to copy with a toast on desktop. Never shows a broken share icon. |
| `S03-BTN-COPY` | Icon button | Copies, then the icon changes to a tick for 2 seconds. Must be called directly from the click — never after an `await`. |
