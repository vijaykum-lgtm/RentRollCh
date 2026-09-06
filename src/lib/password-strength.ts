/**
 * Sign-up password strength, shown "as a single word, not a bar" —
 * spec/screens/landlord/L-01-sign-in.md § Rules.
 */
export type PasswordStrength = "Too short" | "Weak" | "Fair" | "Strong";

export function passwordStrength(password: string): PasswordStrength {
  if (password.length < 8) return "Too short";

  let score = 0;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return "Weak";
  if (score <= 2) return "Fair";
  return "Strong";
}
