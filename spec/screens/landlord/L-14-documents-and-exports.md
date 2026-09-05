# L-14 · Documents and exports

## Meta

| | |
|---|---|
| Route | `/documents` |
| Purpose | Every uploaded file, and every export the accountant or the landlord might need. |

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `L14-TBL-DOCS` | Data table | Every uploaded file: type, what it belongs to, uploaded on. Download, share, delete. |
| `L14-BTN-EXPORT-*` | Buttons | Four exports: rent ledger · maintenance spend · tenant list · deposit register. Each with a date range picker. |
| `L14-BTN-EMAILCA` | Secondary button | Opens the email composer addressed to the saved accountant address, subject "Rental records — FY 2025-26", body listing what is attached. Helper text reminds the landlord to attach the downloaded file. |

`L14-BTN-EMAILCA` uses the accountant's email address configured in `L-15`
(`L15-FLD-CAEMAIL`).
