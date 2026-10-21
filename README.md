# NIGRANI (निगरानी)
### Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System

**SIH Problem Statement:** 26262  
**Organisation / Department:** AICTE — Regulation Bureau  
**Theme:** Smart Automation  
**Document Reference:** [NIGRANI_UI_Focused_PRD.md](./NIGRANI_UI_Focused_PRD.md)  
**Notice:** *Demonstration Prototype — Synthetic Data*  

---

## Overview

NIGRANI is a role-based, accessible public-sector case-management system designed for monitoring AICTE approval-related workflows, statutory institutional compliances, and automated multi-tier alert escalations.

Built towards the **Guidelines for Indian Government Websites and Apps (GIGW 3.0)** and **W3C WCAG 2.1 Level AA**, the system replaces disconnected manual record searches with information-dense operational queues, explicit deadline telemetry, route-based workflow timelines, and an immutable cryptographic audit trail.

---

## Core Capabilities

1. **Role-Based Dynamic Scoping**:
   - **Regional Officer:** Priority work queue ("Needs Attention"), KPI metric tiles, case ageing bands (`0–7d`, `8–15d`, `16–30d`, `31+d`), deficiency issuance, and stage transition controls.
   - **Institution User:** Scoped strictly to own institution (*North Valley Institute of Technology*), action required table, and direct deficiency rectification response.
   - **Bureau Officer:** Cross-region processing comparison matrices with explicit denominators, stage delay telemetry, and bottleneck analytics without punitive ranking.
   - **Committee Member:** Expert Visit Committee (EVC) schedules, dossier review, and on-site observation recording.
   - **Senior Authority (Member Secretary / Advisor):** Chronological oversight of chronic delays (Level 1, 2, 3 escalations) with supervisory direction issuance.
   - **System Administrator:** Approval Process Handbook (APH) rulebook management, route stage sequencer, turnaround SLAs, and user administration.
   - **Header Demo Role Switcher:** Pivot instantly between all 6 personas for complete end-to-end evaluation.

2. **Route-Specific Workflow Timelines**:
   - Stages dynamically adapt to the application's configured route (*Extension of Approval (EoA)*, *New Institution Setup*, *Increase in Intake*, *Standalone Verification*).
   - Only applicable statutory stages appear.
   - Enforced **Return for Deficiency** dialog requiring a non-empty rationale and response deadline.

3. **EVC Panel Scheduling**:
   - Dual-view interface toggling between **Queue View** and an interactive **Calendar View** visualizing on-site committee visits and regulatory deadlines.
   - Panel proposal and schedule confirmation workflows.

4. **Compliance & Undertakings**:
   - Multi-category condition tracking (*Faculty Pay Scale / 7th CPC*, *Safety & Structural*, *Internal Complaints Committee*, *Affidavits*, *Land Norms*).
   - Two-step evidentiary lifecycle: Institution upload $\to$ `Under review` $\to$ Scrutiny Officer verification (**Accept** or **Reject with required correction rationale**).
   - Slide-over inspection drawer for condition text and audit lifecycle.

5. **Documents & Renewals with Simulated OCR**:
   - Expiration countdown tracking (*Land Lease Deeds*, *Fire Safety NOC*, *Building Stability*, *NBA Accreditation*).
   - Simulated OCR extraction panel for lease deeds extracting lessee name, plot numbers, and expiration dates (94.2% confidence), flagged with the mandatory advisory safeguard: *"Unconfirmed suggestions — requires human reviewer verification"*.

6. **Unified Obligations & Notification Centre**:
   - Single consolidated work queue tracking stage SLAs, EVC deadlines, compliance conditions, and document expirations with explicit human-readable urgency ("Due in 2 days", "Overdue by 7 days").
   - Transparent simulated notification log tracking Email, SMS, and Portal notices with actionable retry capabilities for delivery failures (e.g., SMTP timeouts).

7. **Cryptographic SHA-256 Audit Trail**:
   - Blockchain-style immutable event ledger with sequential SHA-256 hash chaining.
   - Interactive **Verify Chain Integrity** engine computing continuity across all committed actions.

8. **Bilingual & Accessible UI**:
   - Global toggle for **English** and **हिन्दी (Hindi)** across navigation, statuses, key metrics, and actions.
   - Semantic headings, skip link, high-contrast color tokens, and keyboard accessibility.

---

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Custom government design tokens (`src/styles/tokens.css` & `src/styles/globals.css`) adhering to GIGW 3.0
- **Icons:** Lucide React (accessible, clean outline icons)
- **Typography:** Inter & Noto Sans Devanagari

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended, tested on v22)
- npm (v9+)

### Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/RazzGourav/Nigrani.git
cd Nigrani

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **`http://localhost:5173/`** in your browser.

### Production Build Validation

```bash
# Type check and build bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure

```text
src/
  components/
    common/         # StatusBadge, UrgencyBadge, Modal, Drawer, EmptyState
    shell/          # AppHeader, SideNavigation, Breadcrumbs
  context/
    AppContext.tsx      # Central reactive store, hash-chaining, workflow actions
    LanguageContext.tsx # Bilingual dictionary (EN & हिन्दी)
  data/
    demoApplications.ts # Seed applications across approval routes
    demoAudit.ts        # Cryptographic audit events with hash chaining
    demoCompliance.ts   # Conditions, evidence uploads, verification states
    demoDocuments.ts    # Certificates, expiry dates, simulated OCR data
    demoEVC.ts          # EVC schedules, committee assignments, statuses
    demoNotifications.ts# Dispatched notices and simulated gateway telemetry
    demoRules.ts        # APH routes, stage sequences, SLAs, escalation rules
    demoUsers.ts        # Seed accounts for all 6 personas
  features/
    admin/          # Rulebook manager & user management
    applications/   # List, detail dossier, transition & deficiency modals
    audit/          # Cryptographic audit trail & integrity check engine
    compliance/     # Compliance conditions, upload & verify modals
    dashboard/      # Role-specific dashboards (Regional, Inst, Bureau, Committee, Senior)
    documents/      # Validity tracking, renewal upload & OCR inspection
    evc/            # EVC queue and visual calendar view
    notifications/  # Notification log and retry interactions
    obligations/    # Unified obligations work queue
    reports/        # Operational analytics & printable report layouts
  styles/
    tokens.css      # GIGW 3.0 & WCAG 2.1 AA design tokens
    globals.css     # Global styling, accessible tables, and print rules
  types/
    index.ts        # Comprehensive TypeScript domain interfaces
```

---

## License

Prototype demonstration system developed for Smart India Hackathon (SIH Problem Statement 26262) for the AICTE Regulation Bureau.
