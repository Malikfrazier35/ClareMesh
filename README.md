<div align="center">

# ClareMesh

**Open-source financial data schema and bi-directional sync SDK.**

[![npm version](https://img.shields.io/npm/v/@claremesh/schema?color=5b7fcc&label=%40claremesh%2Fschema)](https://www.npmjs.com/package/@claremesh/schema)
[![npm transforms](https://img.shields.io/npm/v/@claremesh/transforms?color=c4884a&label=%40claremesh%2Ftransforms)](https://www.npmjs.com/package/@claremesh/transforms)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Schema version](https://img.shields.io/badge/schema-v2.4.1-blue)](https://claremesh.com/schema)
[![Compliance controls](https://img.shields.io/badge/compliance-61_controls-7c3aed)](https://claremesh.com/security/controls)

[Website](https://claremesh.com) · [Docs](https://claremesh.com/docs) · [Schema](https://claremesh.com/schema) · [Trust Center](https://claremesh.com/security/trust-center) · [Pricing](https://claremesh.com/pricing)

</div>

---

## What is ClareMesh?

ClareMesh is the universal adapter for financial data. It publishes a unified schema for the five primitives every fintech product needs (`Account`, `Transaction`, `Entity`, `Balance`, `Forecast`), provides MIT-licensed transforms to normalize raw API responses from Plaid, Stripe, QuickBooks, Xero, and NetSuite into that schema, and offers an optional sync layer that runs on **your own infrastructure**.

Your data never leaves your servers.

## Why ClareMesh?

Every fintech product team eventually writes the same code: a normalization layer that takes Plaid's snake_case JSON, Stripe's amount-in-cents, QuickBooks' nested journal entries, and Xero's contact-shaped invoices, and turns them into one shape your application can reason about. That code is finicky, drifts as providers change their APIs, and accumulates bugs that show up six months later as silent reconciliation errors.

ClareMesh is that code, maintained collaboratively, source-available, and used in production.

## Quick start

```bash
npm install @claremesh/schema @claremesh/transforms
```

```typescript
import { transformPlaidAccount } from '@claremesh/transforms/plaid';
import type { Account } from '@claremesh/schema';

// Raw Plaid response → normalized ClareMesh Account
const account: Account = transformPlaidAccount(plaidApiResponse, {
  org_id: 'org_d8afc85d',
  entity_id: 'ent_acme_01',
});

// account.balance is in major units (dollars, not cents)
// account.currency is ISO 4217
// account.account_type is normalized (asset / liability / equity / revenue / expense)
```

12ms per transform. Schema v2.4.1 validated. Zero data egress.

## What's in the box

ClareMesh ships as three layers, each available independently:

### 1. Schema · `@claremesh/schema`

TypeScript and Python type definitions, JSON Schema, Zod validators. MIT licensed. Use this alone if all you need is a canonical type system.

```typescript
import type { Account, Transaction, Entity, Balance, Forecast } from '@claremesh/schema';
import { AccountSchema } from '@claremesh/schema/zod';

const result = AccountSchema.safeParse(maybeAccount);
if (!result.success) console.error(result.error.issues);
```

### 2. Transforms · `@claremesh/transforms`

Provider-specific normalization functions. MIT licensed. Pure functions — no network calls, no side effects.

```typescript
// Plaid
import { transformPlaidAccount, transformPlaidTransaction } from '@claremesh/transforms/plaid';

// Stripe
import { transformStripeCharge, transformStripePayout } from '@claremesh/transforms/stripe';

// QuickBooks
import { transformQuickbooksAccount, transformQuickbooksJournal } from '@claremesh/transforms/quickbooks';

// Xero
import { transformXeroInvoice, transformXeroBankTransaction } from '@claremesh/transforms/xero';

// CSV (custom mapping)
import { transformCsvRow } from '@claremesh/transforms/csv';
```

### 3. Sync · hosted

Bi-directional sync, conflict resolution, append-only audit trail, retention policies, compliance dashboard. Runs on **your** Supabase project. ClareMesh never sees your data.

Get started: [claremesh.com/signup](https://claremesh.com/signup)

## The schema, briefly

| Object | Purpose | Key fields |
|---|---|---|
| **Account** | A financial account (bank, credit card, GL account) | `id`, `entity_id`, `account_type`, `currency`, `balance` |
| **Transaction** | A single financial event | `id`, `account_id`, `amount`, `transaction_date`, `category` |
| **Entity** | A legal entity (company, subsidiary, person) | `id`, `name`, `entity_type`, `tax_id`, `jurisdiction` |
| **Balance** | A point-in-time balance snapshot | `id`, `account_id`, `balance`, `as_of_timestamp` |
| **Forecast** | A projected cash flow | `id`, `forecast_date`, `projected_amount`, `confidence_level` |

Conventions:
- Amounts in **major units** (dollars, not cents)
- Currencies in **ISO 4217**
- Timestamps in **ISO 8601 UTC**
- All IDs are **UUIDs**
- Schema versioned via `schema_version` field

Full schema browser: [claremesh.com/schema](https://claremesh.com/schema)

## Provider coverage

| Provider | Read | Write | Status |
|---|---|---|---|
| Plaid | ✓ | n/a | Stable |
| Stripe | ✓ | ✓ | Stable |
| QuickBooks Online | ✓ | ✓ | Stable |
| Xero | ✓ | ✓ | Stable |
| NetSuite | ✓ | ✓ | Beta |
| CSV / SFTP | ✓ | n/a | Stable |
| Sage Intacct | — | — | Roadmap |
| FreshBooks | — | — | Roadmap |
| Zoho Books | — | — | Roadmap |

Don't see your provider? [Open an issue](https://github.com/Malikfrazier35/ClareMesh/issues/new) or contribute a transform — see [CONTRIBUTING.md](./CONTRIBUTING.md).

## How it compares

| | ClareMesh | Merge.dev | Plaid alone | In-house |
|---|---|---|---|---|
| Open source | ✓ | ✗ | n/a | n/a |
| Self-hosted | ✓ | ✗ | n/a | ✓ |
| Multi-provider | ✓ | ✓ | ✗ | depends |
| Fintech-focused | ✓ | ✗ | ✓ | depends |
| Data egress | none | full | provider-side | depends |
| Bi-directional sync | ✓ (Scale+) | ✓ | ✗ | depends |
| Time to first integration | 1 hour | 1 day | 1 week | 2-4 months |
| Maintenance burden | shared | none | per provider | full |
| Cost at 1M transforms/mo | $799 | ~$2K+ | provider fees only | engineering time |

Detailed comparisons: [vs. Merge](https://claremesh.com/compare/merge) · [vs. Plaid](https://claremesh.com/compare/plaid) · [vs. Building in-house](https://claremesh.com/compare/in-house) · [vs. Airbyte](https://claremesh.com/compare/airbyte) · [vs. Fivetran](https://claremesh.com/compare/fivetran)

## Compliance

61 controls across 13 control families, mapped to SOC 2, ISO 27001, GDPR, CCPA, PCI DSS, SOX, OWASP API Security, and 7 jurisdiction-specific frameworks.

| Family | Controls | Auto-enforced |
|---|---|---|
| Encryption | 4 | ✓ |
| Access & Authentication | 5 | ✓ |
| Audit Logging | 4 | ✓ |
| Availability & DR | 4 | partial |
| Application Security | 6 | ✓ |
| Network Security | 4 | ✓ |
| Vulnerability Management | 4 | partial |
| Incident Response | 4 | policy |
| Change Management | 4 | ✓ |
| Consent & Processing | 3 | ✓ |
| Data Subject Rights | 4 | ✓ |
| Data Retention | 2 | ✓ |
| Vendor Risk | 4 | policy |

Full list with descriptions and framework mapping: [claremesh.com/security/controls](https://claremesh.com/security/controls)

## Pricing

| Tier | Price | What you get |
|---|---|---|
| **Open** | $0 forever | Schema + transforms (this repo). MIT licensed. No limits. |
| **Build** | $199/mo + usage | 5 connectors, 50K transforms/mo, hosted dashboard, 4 compliance controls |
| **Scale** | $799/mo + usage | Unlimited connectors, bi-directional sync, 14 compliance controls |
| **Enterprise** | Custom | Dedicated infra, SOC 2 Type II, all 61 controls, BYOK encryption |

30-day money-back guarantee. [Pricing details →](https://claremesh.com/pricing)

## The suite

ClareMesh is the data infrastructure layer of a four-product fintech suite. Customers using all four get one canonical financial data model flowing through every layer.

```
                ┌─────────────────────────────────────┐
                │            ClareMesh                │
                │     normalize · validate · sync     │
                └─────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
            ┌───────┐    ┌────────┐    ┌─────────┐
            │Vaultline│   │Castford│   │ Ashford │
            │Treasury │   │  FP&A  │   │ Ledger  │
            └─────────┘   └────────┘   └─────────┘
```

- [Vaultline](https://vaultline.app) — AI-powered treasury management
- [Castford](https://castford.com) — AI-native FP&A
- [Ashford Ledger](https://ashfordledger.com) — B2B month-end close

## Self-hosting

ClareMesh edge functions are designed to run on your own Supabase project. The compliance posture, sub-processors, and data residency are entirely under your control. No data leaves your infrastructure.

```bash
# Clone
git clone https://github.com/Malikfrazier35/ClareMesh.git
cd ClareMesh

# Install
npm install

# Configure your Supabase
cp .env.example .env.local
# Edit with your SUPABASE_URL and keys

# Deploy edge functions to your Supabase
supabase functions deploy transform --no-verify-jwt
supabase functions deploy schema-registry --no-verify-jwt
supabase functions deploy compliance-dashboard

# Run locally
npm run dev
```

Detailed self-hosting guide: [claremesh.com/docs/self-hosting](https://claremesh.com/docs)

## Contributing

We welcome contributions. Most valuable areas:

1. **New provider transforms** — add Sage Intacct, FreshBooks, Zoho Books, or any provider you use
2. **Edge case fixes** — file a bug with a failing test case, we'll merge the test, you fix the bug
3. **Documentation** — code examples, tutorials, blog post submissions
4. **Translations** — schema field labels, error messages, UI copy

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, conventions, and review process.

## Security

Found a vulnerability? Email security@claremesh.com. We respond within 5 business days, triage within 10, and operate a 90-day coordinated disclosure window. Full policy: [claremesh.com/security/vulnerability-disclosure](https://claremesh.com/security/vulnerability-disclosure)

## License

MIT for `@claremesh/schema` and `@claremesh/transforms` (this repo).
Commercial license for the hosted sync layer.

## Built by

[Financial Holding LLC](https://claremesh.com) — a fintech suite company building the financial infrastructure stack for AI-native finance teams.

If you find ClareMesh useful, please ⭐ this repo. It's the single biggest signal we get that the open-source approach is working.

