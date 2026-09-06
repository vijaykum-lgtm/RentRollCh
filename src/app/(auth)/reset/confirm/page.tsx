import { ConfirmResetForm } from "./confirm-reset-form";

// Completes the reset flow started on /reset. spec/screens/landlord/L-01
// doesn't name IDs for this step — it only specifies the request-a-reset
// screen — so this page follows the same A2 form conventions without a
// new spec ID.
export default function ResetConfirmPage() {
  return <ConfirmResetForm />;
}
