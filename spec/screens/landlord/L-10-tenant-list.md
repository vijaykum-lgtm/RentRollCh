# L-10 · Tenant list

## Meta

| | |
|---|---|
| Route | `/tenants` |
| Purpose | Contact, agreement and payment history for a person, past or present. |
| Leads to | `L-11` |

## Components

| ID | Type | Content and behaviour |
|---|---|---|
| `L10-TBL-TENANTS` | Data table | Name · Unit · Phone · Agreement ends · Status. Row click → `L-11`. |
| `L10-SEG-FILTER` | Segmented choice | Current · On notice · Past |

See `L-11` for tenant detail — the two screens are documented together in
the source specification because `L-10` is purely a navigational list into
`L-11`.
