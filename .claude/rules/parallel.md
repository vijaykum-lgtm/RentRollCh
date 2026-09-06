# Parallel development — lane ownership

When multiple agents/sessions work on this repo at once, each owns a
lane and must not casually edit outside it.

## Lane ownership

- A lane is a feature's own files: its screen(s) under
  `src/app/(landlord)/...` or `src/app/(tenant)/...`, its server code
  under `src/server/...`, and its tests.
- `src/components/ui` is shared-ownership (`CLAUDE.md` rule 4) —
  every lane depends on it, no lane owns it.
- Spec files (`spec/**`) are read-only during implementation work —
  see `CLAUDE.md` rule 1. If a spec looks wrong, say so; do not edit
  it as a side effect of an implementation task.

## Never edit another lane's files

- Don't fix, refactor, or "clean up" a file that belongs to a
  different feature lane, even if the fix looks trivial or the task
  brushes up against it.
- If your task genuinely requires a change in another lane (a shared
  type, a schema field, an API contract), stop and report the
  integration requirement instead of making the edit yourself:
  state which file, what change, and why — then let the owning lane
  or the user decide.

## Shared components: use `// PROMOTE:`

- If a screen needs a shared component that doesn't exist yet in
  `src/components/ui` (a button variant, a table, a status chip,
  etc. — see `CLAUDE.md` rule 4 / `spec/foundations.md` § A2), build
  the minimum version locally, in your own lane.
- Mark it at the definition site:
  ```
  // PROMOTE: <short reason this belongs in src/components/ui>
  ```
- Do not add it to `src/components/ui` yourself. That directory is
  promoted-to by discussion, not by whichever lane needed it first.

## Reporting instead of acting

When you notice a cross-lane need (a missing shared type, a
conflicting assumption between two screens, a schema gap), report it
in your summary to the user in this shape: **what's needed**, **which
file(s) it touches**, **why it's outside your lane**. Do not resolve
it unilaterally.
