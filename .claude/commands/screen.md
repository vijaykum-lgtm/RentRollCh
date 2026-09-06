---
description: Show the spec for a stable screen ID (e.g. /screen L-04)
---

Look up the screen, component, or print-view ID given in `$ARGUMENTS`
(e.g. `L-04`, `T-01`, `S-02`, `P-01`) and show its spec.

1. Map the ID's prefix to its directory per `spec/index.md`:
   - `L-nn` → `spec/screens/landlord/`
   - `T-nn` → `spec/screens/tenant/`
   - `S-nn` → `spec/screens/shared/`
   - `P-nn` → `spec/screens/print/`
2. Find the matching file (filenames are `<ID>-<slug>.md`) and read it
   in full.
3. Check `spec/index.md` § Open contradictions and `spec/decisions.md`
   for any entry referencing this ID; note them if present.
4. Reply with the screen's spec content, preserving its stable
   element IDs (e.g. `L04-BTN-REMIND`) verbatim — this is a lookup,
   not a summary, so don't compress away the IDs a bug report would
   need to cite.

If `$ARGUMENTS` doesn't match a known ID, say so and point to
`spec/index.md` § Screen index instead of guessing.
