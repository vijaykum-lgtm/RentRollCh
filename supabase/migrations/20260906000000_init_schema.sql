-- RentRoll initial schema.
--
-- Encodes spec/decisions.md D1-D12 (the seven mandatory corrections plus
-- five schema-blocking gaps) on top of spec/product.md's data model.
-- RLS is enabled on every table in this same migration -- it is never
-- added later. Tenant-facing routes get zero direct table access: there
-- are no policies for the `anon` role anywhere in this file. Tenant reads
-- go through a service-role resolver in application code instead (see
-- src/server/tokens/resolve-token.ts), which returns only the small set
-- of identifiers a token is allowed to reveal.
--
-- Table order follows FK dependencies: landlord, property, unit, tenant,
-- tenancy, agreement, rent_entry, payment, reminder, request, document,
-- deduction, audit_event.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------

create table public.landlord (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  phone text,
  email text,
  upi_id text,
  business_name text,
  created_at timestamptz not null default now()
);

create table public.property (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null references public.landlord (id) on delete cascade,
  name text not null,
  address text not null,
  created_at timestamptz not null default now()
);

create index property_landlord_id_idx on public.property (landlord_id);

-- D1: unit.door_token is durable and unit-scoped -- created once, never
-- rotated, and unaffected by tenant turnover.
create table public.unit (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.property (id) on delete cascade,
  unit_number text not null,
  type text not null,
  rent numeric(12, 2) not null,
  deposit_amount numeric(12, 2) not null,
  occupied boolean not null default false,
  door_token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create index unit_property_id_idx on public.unit (property_id);

-- D5: tenant is lightened to identity only. Notice/agreement state moves
-- to tenancy (D5) and agreement (D3) respectively.
create table public.tenant (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

-- D1: tenancy.tenant_token is per-stay, created at move-in, and stops
-- being valid once the tenancy is no longer current (status <> 'current').
-- D5: notice fields live here, not on tenant, because they describe one
-- stay, not the person.
-- D9: deposit_paid lives here; the deposit balance is deposit_paid minus
-- the sum of this tenancy's deductions.
create table public.tenancy (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.unit (id) on delete cascade,
  tenant_id uuid not null references public.tenant (id) on delete cascade,
  status text not null default 'current' check (status in ('current', 'notice', 'past')),
  tenant_token uuid not null unique default gen_random_uuid(),
  notice_given_on date,
  planned_move_out_on date,
  actual_move_out_on date,
  deposit_paid numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index tenancy_unit_id_idx on public.tenancy (unit_id);
create index tenancy_tenant_id_idx on public.tenancy (tenant_id);

-- D3: agreement is its own entity, many per tenancy, one row per signed
-- or renewed term. Renewal creates a new row; it never mutates the old
-- one, so rent rows already generated under an earlier agreement keep
-- their history intact.
-- D4: rent_due_day lives here (per current agreement), not as a global
-- or landlord-wide constant.
create table public.agreement (
  id uuid primary key default gen_random_uuid(),
  tenancy_id uuid not null references public.tenancy (id) on delete cascade,
  start_date date not null,
  end_date date not null,
  rent_amount numeric(12, 2) not null,
  deposit_amount numeric(12, 2) not null,
  rent_due_day int not null check (rent_due_day between 1 and 31),
  created_at timestamptz not null default now()
);

create index agreement_tenancy_id_idx on public.agreement (tenancy_id);

-- D2: rent_entry no longer carries amount_paid/paid_on/receipt_number --
-- those move to payment. amount_paid is derived (sum of payments), not
-- stored.
create table public.rent_entry (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.unit (id) on delete cascade,
  month date not null,
  amount_due numeric(12, 2) not null,
  due_date date not null,
  created_at timestamptz not null default now(),
  unique (unit_id, month)
);

create index rent_entry_unit_id_idx on public.rent_entry (unit_id);

-- D2: payment is its own entity, many per rent_entry. Each mark-paid
-- action (full or partial) creates one row here; a receipt is issued for
-- the amount actually received.
create table public.payment (
  id uuid primary key default gen_random_uuid(),
  rent_entry_id uuid not null references public.rent_entry (id) on delete cascade,
  amount numeric(12, 2) not null,
  received_on date not null,
  reference text,
  receipt_number text not null,
  created_at timestamptz not null default now()
);

create index payment_rent_entry_id_idx on public.payment (rent_entry_id);

-- Unchanged from product.md's data model -- kept separate from
-- audit_event (D6) because its fields are structured and queried on
-- their own (e.g. "which tenants are at formal level").
create table public.reminder (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenant (id) on delete cascade,
  level text not null check (level in ('gentle', 'direct', 'formal')),
  sent_on date not null,
  sent_via text not null,
  call_notes text,
  created_at timestamptz not null default now()
);

create index reminder_tenant_id_idx on public.reminder (tenant_id);

-- D8: no separate vendor entity -- vendor stays free text here.
-- D12: no_cost_confirmed is distinct from an empty cost; the Done
-- transition checks (cost is not null or no_cost_confirmed), never an
-- empty field.
-- reported_via ("phone call", "tenant portal", ...) has no DB default --
-- T-01 and L06-BTN-NEW set it explicitly at the app layer.
create table public.request (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.unit (id) on delete cascade,
  category text not null,
  description text not null,
  urgency text not null default 'normal' check (urgency in ('low', 'normal', 'high')),
  status text not null default 'new' check (status in ('new', 'assigned', 'in_progress', 'done')),
  vendor_name text,
  vendor_phone text,
  cost numeric(12, 2),
  no_cost_confirmed boolean not null default false,
  reported_via text not null,
  created_at timestamptz not null default now()
);

create index request_unit_id_idx on public.request (unit_id);

-- D7: is_protected. A settlement statement is marked protected the
-- moment the tenancy is settled; move-in condition photos are marked
-- protected at creation. L-14's delete action must refuse (with an
-- explanation) on any protected document -- enforced at the application
-- layer, this column is its schema-level home.
-- D10: request_id is additive to unit_id -- most documents stay
-- unit-scoped and leave this null; maintenance before/after photos set
-- it.
-- D11: type = 'receipt' is kept only for a landlord manually uploading a
-- scanned/external receipt -- P-01 always renders live from payment.
create table public.document (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.unit (id) on delete cascade,
  type text not null check (type in ('agreement', 'id_proof', 'photo', 'receipt', 'statement')),
  request_id uuid references public.request (id) on delete set null,
  is_protected boolean not null default false,
  file_path text not null,
  created_at timestamptz not null default now()
);

create index document_unit_id_idx on public.document (unit_id);
create index document_request_id_idx on public.document (request_id);

-- D9: deduction is its own entity, scoped to the tenancy. The deposit
-- balance is tenancy.deposit_paid minus the sum of that tenancy's
-- deductions.
create table public.deduction (
  id uuid primary key default gen_random_uuid(),
  tenancy_id uuid not null references public.tenancy (id) on delete cascade,
  description text not null,
  reason text not null,
  amount numeric(12, 2) not null,
  document_id uuid references public.document (id) on delete set null,
  request_id uuid references public.request (id) on delete set null,
  created_at timestamptz not null default now()
);

create index deduction_tenancy_id_idx on public.deduction (tenancy_id);

-- D6: audit_event is generic, polymorphic, and append-only. parent_type
-- names which table parent_id belongs to; there is no FK here because
-- Postgres has no polymorphic foreign key -- ownership for RLS is
-- resolved by app.audit_event_landlord() below instead.
create table public.audit_event (
  id uuid primary key default gen_random_uuid(),
  parent_type text not null,
  parent_id uuid not null,
  event_type text not null,
  occurred_on timestamptz not null default now(),
  actor uuid references public.landlord (id) on delete set null,
  from_value text,
  to_value text,
  note text
);

create index audit_event_parent_idx on public.audit_event (parent_type, parent_id);

-- ---------------------------------------------------------------------
-- RLS helper functions (schema `app`) -- one join chain written once,
-- reused by every table's policy below.
-- ---------------------------------------------------------------------

create schema if not exists app;

create function app.unit_landlord(p_unit_id uuid)
returns uuid
language sql
stable
as $$
  select p.landlord_id
  from public.unit u
  join public.property p on p.id = u.property_id
  where u.id = p_unit_id;
$$;

create function app.tenancy_landlord(p_tenancy_id uuid)
returns uuid
language sql
stable
as $$
  select app.unit_landlord(t.unit_id)
  from public.tenancy t
  where t.id = p_tenancy_id;
$$;

create function app.tenant_landlord(p_tenant_id uuid)
returns uuid
language sql
stable
as $$
  select app.unit_landlord(t.unit_id)
  from public.tenancy t
  where t.tenant_id = p_tenant_id
  limit 1;
$$;

-- D6: dispatches ownership resolution by parent_type for the generic
-- audit_event table. Extend this case list as new auditable parent
-- tables are added.
create function app.audit_event_landlord(p_parent_type text, p_parent_id uuid)
returns uuid
language sql
stable
as $$
  select case p_parent_type
    when 'property' then (select landlord_id from public.property where id = p_parent_id)
    when 'unit' then app.unit_landlord(p_parent_id)
    when 'tenant' then app.tenant_landlord(p_parent_id)
    when 'tenancy' then app.tenancy_landlord(p_parent_id)
    when 'agreement' then (select app.tenancy_landlord(tenancy_id) from public.agreement where id = p_parent_id)
    when 'rent_entry' then (select app.unit_landlord(unit_id) from public.rent_entry where id = p_parent_id)
    when 'payment' then (select app.unit_landlord(re.unit_id) from public.payment pay join public.rent_entry re on re.id = pay.rent_entry_id where pay.id = p_parent_id)
    when 'reminder' then (select app.tenant_landlord(tenant_id) from public.reminder where id = p_parent_id)
    when 'request' then (select app.unit_landlord(unit_id) from public.request where id = p_parent_id)
    when 'document' then (select app.unit_landlord(unit_id) from public.document where id = p_parent_id)
    when 'deduction' then (select app.tenancy_landlord(tenancy_id) from public.deduction where id = p_parent_id)
    else null
  end;
$$;

-- ---------------------------------------------------------------------
-- RLS. Enabled on every table, no `anon` policies anywhere. A signed-in
-- landlord's policy always resolves to their own auth.uid(); a mismatch
-- returns zero rows, which the calling application layer must surface as
-- "not found", never "forbidden" (spec/cross-cutting.md § E4).
-- ---------------------------------------------------------------------

alter table public.landlord enable row level security;
alter table public.property enable row level security;
alter table public.unit enable row level security;
alter table public.tenant enable row level security;
alter table public.tenancy enable row level security;
alter table public.agreement enable row level security;
alter table public.rent_entry enable row level security;
alter table public.payment enable row level security;
alter table public.reminder enable row level security;
alter table public.request enable row level security;
alter table public.document enable row level security;
alter table public.deduction enable row level security;
alter table public.audit_event enable row level security;

create policy landlord_self on public.landlord
  for all
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy property_owner on public.property
  for all
  to authenticated
  using (landlord_id = auth.uid())
  with check (landlord_id = auth.uid());

create policy unit_owner on public.unit
  for all
  to authenticated
  using (app.unit_landlord(id) = auth.uid())
  with check (app.unit_landlord(id) = auth.uid());

create policy tenant_owner on public.tenant
  for all
  to authenticated
  using (app.tenant_landlord(id) = auth.uid())
  with check (app.tenant_landlord(id) = auth.uid());

create policy tenancy_owner on public.tenancy
  for all
  to authenticated
  using (app.unit_landlord(unit_id) = auth.uid())
  with check (app.unit_landlord(unit_id) = auth.uid());

create policy agreement_owner on public.agreement
  for all
  to authenticated
  using (app.tenancy_landlord(tenancy_id) = auth.uid())
  with check (app.tenancy_landlord(tenancy_id) = auth.uid());

create policy rent_entry_owner on public.rent_entry
  for all
  to authenticated
  using (app.unit_landlord(unit_id) = auth.uid())
  with check (app.unit_landlord(unit_id) = auth.uid());

create policy payment_owner on public.payment
  for all
  to authenticated
  using (
    app.unit_landlord((select unit_id from public.rent_entry where id = rent_entry_id)) = auth.uid()
  )
  with check (
    app.unit_landlord((select unit_id from public.rent_entry where id = rent_entry_id)) = auth.uid()
  );

create policy reminder_owner on public.reminder
  for all
  to authenticated
  using (app.tenant_landlord(tenant_id) = auth.uid())
  with check (app.tenant_landlord(tenant_id) = auth.uid());

create policy request_owner on public.request
  for all
  to authenticated
  using (app.unit_landlord(unit_id) = auth.uid())
  with check (app.unit_landlord(unit_id) = auth.uid());

create policy document_owner on public.document
  for all
  to authenticated
  using (app.unit_landlord(unit_id) = auth.uid())
  with check (app.unit_landlord(unit_id) = auth.uid());

create policy deduction_owner on public.deduction
  for all
  to authenticated
  using (app.tenancy_landlord(tenancy_id) = auth.uid())
  with check (app.tenancy_landlord(tenancy_id) = auth.uid());

create policy audit_event_owner on public.audit_event
  for all
  to authenticated
  using (app.audit_event_landlord(parent_type, parent_id) = auth.uid())
  with check (app.audit_event_landlord(parent_type, parent_id) = auth.uid());

-- ---------------------------------------------------------------------
-- landlord row provisioning. Sign-up only creates an auth.users row;
-- without this trigger no landlord row would exist and every policy
-- above would deny that user everything.
-- ---------------------------------------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.landlord (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
