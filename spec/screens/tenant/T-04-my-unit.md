# T-04 · My unit and landlord contact

## Meta

| | |
|---|---|
| Access | Anyone holding the link. No sign-in. |

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `T04-SEC-UNIT` | Info block | Unit, property, landlord's name. Agreement start and end dates. **No rent figure.** |
| `T04-BTN-CALL` | Primary button | Calls the landlord |
| `T04-BTN-MESSAGE` | Secondary button | Opens WhatsApp to the landlord with a blank message |

> **This screen shows agreement dates but not rent.** The tenant knows
> their own rent; the app does not need to state it, and any screen that
> displays a money figure is one refactor away from displaying the wrong
> one. Receipts on `T-05` do show amounts, because those are the tenant's
> own payments and the receipt is the point.
