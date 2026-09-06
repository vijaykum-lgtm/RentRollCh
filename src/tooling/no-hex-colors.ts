/**
 * Scans component source for raw hex colour literals — CLAUDE.md § 3 / A1:
 * "No raw hex values inside components." A1 tokens live as CSS custom
 * properties in `globals.css`; components must reference them via
 * Tailwind's generated utilities (`bg-ink`, `text-primary`, `border-line`,
 * ...), never a literal `#rrggbb`/`#rgb`.
 */
const HEX_LITERAL_RE = /#[0-9a-fA-F]{3,8}\b/g;

export interface HexColorViolation {
  file: string;
  line: number;
  match: string;
}

export function findHexColorLiterals(
  files: { path: string; content: string }[],
): HexColorViolation[] {
  const violations: HexColorViolation[] = [];

  for (const file of files) {
    const lines = file.content.split("\n");
    lines.forEach((lineText, index) => {
      for (const match of lineText.matchAll(HEX_LITERAL_RE)) {
        violations.push({ file: file.path, line: index + 1, match: match[0] });
      }
    });
  }

  return violations;
}
