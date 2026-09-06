"use client";

/**
 * Dev-only sandbox route. Named `page.dev.tsx` so it disappears from
 * production builds entirely — see `pageExtensions` in next.config.ts.
 *
 * Every A2 component from `src/components/ui` is rendered here in every
 * state called for by spec/foundations.md § A2, so a reviewer can see all
 * of them without constructing anything.
 */
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable, stopRowPropagation } from "@/components/ui/data-table";
import { DateField } from "@/components/ui/date-field";
import { DetailPanel } from "@/components/ui/detail-panel";
import { Dropdown } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { MoneyField } from "@/components/ui/money-field";
import type { PhotoUploaderPhoto } from "@/components/ui/photo-uploader";
import { PhotoUploader } from "@/components/ui/photo-uploader";
import { PhoneField } from "@/components/ui/phone-field";
import { SegmentedChoice } from "@/components/ui/segmented-choice";
import { StatCard } from "@/components/ui/stat-card";
import { StatusChip } from "@/components/ui/status-chip";
import type { StatusChipTone } from "@/components/ui/status-chip";
import { TextArea } from "@/components/ui/text-area";
import { TextField } from "@/components/ui/text-field";
import { Timeline } from "@/components/ui/timeline";
import { ToastProvider, useToast } from "@/components/ui/toast";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-t border-line pt-6 first:border-t-0 first:pt-0">
      <h2 className="type-h1 text-ink">{title}</h2>
      {children}
    </section>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="type-label text-muted">{title}</h3>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

const BUTTON_HEIGHTS = ["compact", "default", "tenant"] as const;

function ButtonGallery() {
  return (
    <Section title="Buttons">
      {(["primary", "secondary", "quiet", "danger"] as const).map((variant) => (
        <SubSection key={variant} title={`${variant} — 32 / 40 / 48px`}>
          {BUTTON_HEIGHTS.map((height) => (
            <Button key={height} variant={variant} height={height}>
              {variant === "danger" ? "Delete unit" : "Save changes"}
            </Button>
          ))}
        </SubSection>
      ))}
      <SubSection title="Loading (inline spinner, non-interactive until it resolves)">
        <Button loading>Saving</Button>
      </SubSection>
      <SubSection title="Disabled (tooltip explains why)">
        <Button disabled disabledReason="Add a rent amount before saving.">
          Save changes
        </Button>
      </SubSection>
      <SubSection title="Icon (32×32, tooltip + accessible label)">
        <Button variant="icon" aria-label="Call tenant">
          ☎
        </Button>
        <Button variant="icon" aria-label="Print receipt">
          ⎙
        </Button>
        <CopyIconButton />
      </SubSection>
    </Section>
  );
}

function CopyIconButton() {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="icon"
      aria-label="Copy link"
      onClick={() => {
        // Must be called directly from the click handler, never after an
        // await — spec/screens/shared/S-03-share-and-copy-menu.md.
        navigator.clipboard?.writeText("https://rentroll.app/u/abc123");
        setCopied(true);
        showToast({ message: "Copied.", durationMs: 2000 });
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? "✓" : "⧉"}
    </Button>
  );
}

function TextFieldDemo() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>();

  return (
    <TextField
      label="Tenant name"
      placeholder="e.g. Priya Shah"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => setError(value.trim() === "" ? "Enter a name." : undefined)}
      error={error}
      helperText={error ? undefined : "As it should appear on the receipt."}
    />
  );
}

function MoneyFieldDemo() {
  const [value, setValue] = useState<number | null>(null);
  const [error, setError] = useState<string | undefined>();

  return (
    <MoneyField
      label="Monthly rent"
      value={value}
      onValueChange={setValue}
      onBlur={() => setError(value === null ? "Enter the rent amount." : undefined)}
      error={error}
      helperText={error ? undefined : "Shown on the tenant's receipt."}
    />
  );
}

function PhoneFieldDemo() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>();

  return (
    <PhoneField
      label="Tenant phone"
      value={value}
      onValueChange={setValue}
      onBlur={() => setError(value.length !== 10 ? "Enter a 10-digit number." : undefined)}
      error={error}
      helperText={error ? undefined : "Used for SMS reminders."}
    />
  );
}

function DateFieldDemo() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>();

  return (
    <DateField
      label="Agreement end date"
      value={value}
      onValueChange={setValue}
      onBlur={() => setError(value === "" ? "Pick a date." : undefined)}
      error={error}
    />
  );
}

function DropdownDemo() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>();

  return (
    <Dropdown
      label="Unit"
      placeholder="Select a unit"
      value={value}
      onValueChange={setValue}
      onBlur={() => setError(value === "" ? "Choose a unit." : undefined)}
      error={error}
      options={[
        { value: "1a", label: "Unit 1A" },
        { value: "2b", label: "Unit 2B" },
      ]}
    />
  );
}

function SegmentedChoiceDemo() {
  const [value, setValue] = useState("normal");
  return (
    <SegmentedChoice
      label="Urgency"
      value={value}
      onValueChange={setValue}
      options={[
        { value: "normal", label: "Normal" },
        { value: "urgent", label: "Urgent" },
      ]}
    />
  );
}

function TextAreaDemo() {
  const [value, setValue] = useState(
    "The kitchen tap has been leaking steadily for three days and the drip has started staining the counter. ".repeat(4),
  );
  const [error, setError] = useState<string | undefined>();

  return (
    <TextArea
      label="Describe the problem"
      value={value}
      onValueChange={setValue}
      onBlur={() => setError(value.trim() === "" ? "Describe the problem." : undefined)}
      error={error}
      helperText={error ? undefined : "Auto-grows to 8 lines, then scrolls."}
    />
  );
}

const PLACEHOLDER_PHOTO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23E2E8ED'/%3E%3C/svg%3E";

function PhotoUploaderDemo() {
  const [photos, setPhotos] = useState<PhotoUploaderPhoto[]>([
    { id: "done-1", previewUrl: PLACEHOLDER_PHOTO, progress: "done" },
    { id: "uploading-1", previewUrl: PLACEHOLDER_PHOTO, progress: 60 },
    {
      id: "error-1",
      previewUrl: PLACEHOLDER_PHOTO,
      progress: 0,
      error: "That file is too large",
    },
  ]);

  return (
    <PhotoUploader
      label="Photos"
      maxPhotos={10}
      photos={photos}
      onFilesSelected={(files) => {
        const next = files.map((file, index) => ({
          id: `${Date.now()}-${index}`,
          previewUrl: URL.createObjectURL(file),
          progress: 0 as number | "done",
        }));
        setPhotos((current) => [...current, ...next]);
      }}
      onRemove={(id) =>
        setPhotos((current) => current.filter((photo) => photo.id !== id))
      }
      onEnlarge={() => {}}
    />
  );
}

function FieldGallery() {
  return (
    <Section title="Form fields (validate on blur, not on keystroke)">
      <SubSection title="Text field">
        <TextFieldDemo />
      </SubSection>
      <SubSection title="Money field">
        <MoneyFieldDemo />
      </SubSection>
      <SubSection title="Phone field">
        <PhoneFieldDemo />
      </SubSection>
      <SubSection title="Date field">
        <DateFieldDemo />
      </SubSection>
      <SubSection title="Dropdown">
        <DropdownDemo />
      </SubSection>
      <SubSection title="Segmented choice">
        <SegmentedChoiceDemo />
      </SubSection>
      <SubSection title="Text area (character counter past 400)">
        <div className="w-full max-w-md">
          <TextAreaDemo />
        </div>
      </SubSection>
      <SubSection title="Photo uploader (uploading / done / error)">
        <PhotoUploaderDemo />
      </SubSection>
    </Section>
  );
}

interface DemoRentRow {
  id: string;
  unit: string;
  tenant: string;
  status: StatusChipTone;
  statusLabel: string;
  amount: string;
}

const RENT_ROWS: DemoRentRow[] = [
  { id: "1", unit: "1A", tenant: "Priya Shah", status: "danger", statusLabel: "Overdue 14 days", amount: "₹18,000" },
  { id: "2", unit: "2B", tenant: "Rahul Verma", status: "warning", statusLabel: "Due in 3 days", amount: "₹22,000" },
  { id: "3", unit: "3C", tenant: "Anjali Nair", status: "success", statusLabel: "Paid", amount: "₹15,500" },
];

function DataTableDemo() {
  const [sortKey, setSortKey] = useState("unit");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [lastRowClick, setLastRowClick] = useState<string | null>(null);
  const [lastActionClick, setLastActionClick] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <p className="type-small text-muted" aria-live="polite">
        Last row click: {lastRowClick ?? "none"} · Last action click (should not
        also trigger a row click): {lastActionClick ?? "none"}
      </p>
      <DataTable
        columns={[
          { key: "unit", header: "Unit", sortable: true, render: (row) => row.unit },
          { key: "tenant", header: "Tenant", render: (row) => row.tenant },
          {
            key: "status",
            header: "Status",
            render: (row) => <StatusChip tone={row.status} label={row.statusLabel} />,
          },
          { key: "amount", header: "Amount", align: "right", render: (row) => row.amount },
          {
            key: "actions",
            header: "",
            align: "right",
            render: (row) => (
              <Button
                variant="quiet"
                height="compact"
                onClick={stopRowPropagation(() => setLastActionClick(row.unit))}
              >
                Remind
              </Button>
            ),
          },
        ]}
        rows={RENT_ROWS}
        rowKey={(row) => row.id}
        onRowClick={(row) => setLastRowClick(row.unit)}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={(key) => {
          if (key === sortKey) {
            setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
          } else {
            setSortKey(key);
            setSortDirection("asc");
          }
        }}
      />
    </div>
  );
}

function DetailPanelDemo() {
  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => setOpen(true)}>Open detail panel</Button>
      <DetailPanel
        open={open}
        title="Rent detail — Unit 1A"
        isDirty={dirty}
        onClose={() => {
          setOpen(false);
          setDirty(false);
        }}
      >
        <div className="flex flex-col gap-4">
          <p className="type-body text-body">
            Edit the field below, then try to close the panel (Escape,
            backdrop click, or the × button) — it should warn before
            discarding your edit.
          </p>
          <TextField
            label="Note"
            value={dirty ? "Unsaved edit" : ""}
            onChange={() => setDirty(true)}
            helperText="Typing here marks the panel dirty."
          />
        </div>
      </DetailPanel>
    </div>
  );
}

function ConfirmDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete unit
      </Button>
      <ConfirmDialog
        open={open}
        title="Delete this unit?"
        consequence="This removes the unit and its history. This can't be undone."
        actionLabel="Delete unit"
        tone="danger"
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

function ToastDemo() {
  const { showToast } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() =>
          showToast({ message: "Reminder recorded on the tenant's history." })
        }
      >
        Show toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          showToast({
            message: "Payment recorded. Receipt RR-0847 created.",
            undo: { label: "Undo", onUndo: () => {} },
          })
        }
      >
        Show toast with Undo
      </Button>
    </div>
  );
}

const TIMELINE_EVENTS = [
  { id: "3", icon: "✓", text: "Marked resolved by landlord", timestamp: "06 Sep 2026, 10:12" },
  { id: "2", icon: "☎", text: "Reminder call logged", timestamp: "04 Sep 2026, 16:40" },
  { id: "1", icon: "＋", text: "Reported by tenant", timestamp: "02 Sep 2026, 09:03" },
];

function DisplayGallery() {
  return (
    <Section title="Display components">
      <SubSection title="Stat card (whole card is the click target)">
        <div className="w-40">
          <StatCard label="Rent due" value="₹1,84,000" comparison="↑ ₹12,000 vs last month" href="#" />
        </div>
        <div className="w-40">
          <StatCard label="Open requests" value={4} />
        </div>
      </SubSection>
      <SubSection title="Status chip (colour is never the only signal)">
        <StatusChip tone="success" label="Paid" />
        <StatusChip tone="warning" label="Due soon" />
        <StatusChip tone="danger" label="Overdue" />
        <StatusChip tone="neutral" label="Vacant" />
        <StatusChip tone="primary" label="In progress" />
      </SubSection>
      <div className="flex flex-col gap-2">
        <h3 className="type-label text-muted">
          Data table (sortable column, row click, row-action stopPropagation)
        </h3>
        <DataTableDemo />
      </div>
      <SubSection title="Detail panel (unsaved-edit warning, focus return)">
        <DetailPanelDemo />
      </SubSection>
      <div className="flex flex-col gap-2">
        <h3 className="type-label text-muted">Timeline</h3>
        <Timeline events={TIMELINE_EVENTS} />
      </div>
      <SubSection title="Empty state">
        <div className="w-full max-w-sm">
          <EmptyState
            description="No maintenance requests yet."
            action={<Button variant="secondary">Log a request</Button>}
          />
        </div>
      </SubSection>
      <SubSection title="Toast (bottom-centre, 4s default, optional Undo)">
        <ToastDemo />
      </SubSection>
      <SubSection title="Confirm dialog (action button names the action)">
        <ConfirmDialogDemo />
      </SubSection>
    </Section>
  );
}

export default function DevComponentsPage() {
  return (
    <ToastProvider>
      <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-8 p-4 md:p-8">
        <header className="flex flex-col gap-1">
          <h1 className="type-display text-ink">Component gallery</h1>
          <p className="type-body text-muted">
            Dev-only route for previewing every A2 component in every state.
            Not included in production builds.
          </p>
        </header>
        <ButtonGallery />
        <FieldGallery />
        <DisplayGallery />
      </main>
    </ToastProvider>
  );
}
