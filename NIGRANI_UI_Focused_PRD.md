# NIGRANI — Product Requirements Document (UI-Focused)

**Project:** NIGRANI — Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System  
**SIH Problem Statement:** 26262  
**Organisation / Department:** AICTE — Regulation Bureau  
**Theme:** Smart Automation  
**Document type:** Product Requirements Document (PRD), frontend/UI and interaction specification  
**Version:** 1.0  
**Date:** 21 October 2026  
**Status:** Prototype specification for hackathon implementation

> **Important positioning:** NIGRANI is a proposed prototype that supports approval-related workflow monitoring and institutional compliance. It must not be presented as an already-authorised AICTE system or as a replacement for the official AICTE portal. Real AICTE logos, official seals, production data and external integrations must only be used when the team has permission. For the prototype, visibly label the environment **“Demonstration Prototype — Synthetic Data”**.

---

## 1. Executive summary

NIGRANI is a role-based web application for monitoring AICTE approval-related workflows and institutional compliance. Its user interface helps authorised users answer four questions without manually searching through disconnected records:

1. **What is pending?** Application stages, EVCs, undertakings, renewals and other prescribed actions.
2. **Who owns the next action?** Institution, officer, committee or designated authority.
3. **When is it due?** Current deadline, time remaining, ageing and escalation status.
4. **What happened and why?** Evidence, observations, transitions, reminders, verification and audit history.

The product should look like a serious public-sector case-management system: measured, precise, accessible and information-dense. It must not resemble a generic AI landing page or a collection of decorative dashboard cards. It prioritises work queues, readable tables, explicit statuses, clear dates, helpful filters and an audit trail.

The first release is a **hackathon MVP** using realistic but synthetic applications and configurable sample rules. The UI must demonstrate complete, connected user journeys for application routing, stage transitions, return for deficiency, overdue alerts, compliance evidence submission, officer verification and audit history.

## 2. Regulatory and design basis

### 2.1 Applicable process rules

- Approval workflow rules, application routes, roles and regulatory deadlines must be configurable against the applicable AICTE Approval Process Handbook (APH) and authorised administrative procedures.
- The UI must never invent a legal deadline or imply that an example reminder policy is an official AICTE rule.
- The UI must distinguish administrative workflow automation from statutory scrutiny, inspection, verification and decisions reserved for competent authorities.
- Automated summaries, OCR-extracted fields and risk indicators are advisory and must be visibly marked as such until reviewed where applicable.

### 2.2 Government web and accessibility guidance

Use the **Guidelines for Indian Government Websites and Apps (GIGW 3.0)** as the design reference for government-style usability, accessibility, security and lifecycle quality. The GIGW 3.0 guidance references WCAG 2.1 Level AA. NIGRANI must be designed towards these criteria; the prototype must not claim formal GIGW or STQC certification without an actual conformity assessment.

- GIGW 3.0: https://guidelines.india.gov.in/
- GIGW 3.0 scope and objectives: https://guidelines.india.gov.in/scope-and-objective/
- GIGW 3.0 new features: https://guidelines.india.gov.in/new-features-of-gigw-3-0/
- GIGW quick accessibility tips: https://guidelines.india.gov.in/quick-tips/
- AICTE Approval Process Handbook 2024–25 to 2026–27: https://www.aicte.gov.in/sites/default/files/APH%20Final.pdf
- W3C WCAG 2.1: https://www.w3.org/TR/WCAG21/

**Interpretation:** AICTE APH governs approval-related rules; GIGW/WCAG inform interface quality and accessibility. This PRD does not assert that AICTE has a separate prescribed colour palette or UI design system. Visual tokens below are proposed NIGRANI prototype choices, not official AICTE branding.

## 3. Product goals

### 3.1 Primary goals

1. Give each role an actionable, role-appropriate overview immediately after sign-in.
2. Make pending, due-soon, overdue and escalated items easy to distinguish.
3. Provide a consistent workflow experience across supported application routes.
4. Make EVC, undertaking and document-validity follow-up understandable and traceable.
5. Separate evidence submission from verification and approval.
6. Make each important state change explainable through a readable activity timeline.
7. Reduce repetitive navigation and manual follow-up by surfacing the next action in context.
8. Present a polished, accessible, credible government-service UI suitable for a hackathon demonstration.

### 3.2 Success criteria for the prototype

These are **test targets**, not claims of real-world AICTE performance:

- A judge can identify the most urgent queue item from the dashboard in under 30 seconds.
- The demo completes one end-to-end application journey without using developer tools or editing database rows manually.
- All supported role-specific screens show data within that role's permitted scope in the prototype.
- Every successful workflow transition visible in the UI has a corresponding activity/audit entry.
- A return for deficiency cannot be submitted with an empty reason.
- A compliance upload remains “Submitted” or “Under review” until a reviewer records a decision.
- Due and overdue items are displayed consistently across dashboard, detail page and obligation list.
- The UI works at desktop, tablet and mobile widths, with keyboard navigation for core actions.

## 4. Users and permissions

### 4.1 User roles

| Role | Primary objective | Default landing page | Data scope |
|---|---|---|---|
| Institution user | Check application status, understand obligations, submit evidence and respond to deficiencies | Institution dashboard | Own institution's applications and obligations only |
| Regional officer | Manage regional queues, pendency, EVC follow-up and compliance | Regional dashboard | Assigned region and any specifically assigned cases |
| Bureau officer | Monitor national or bureau-level performance and bottlenecks | Bureau overview | Authorised cross-region view |
| Committee member | Review assigned cases and record visit/hearing observations | My assigned cases | Assigned cases and approved supporting information |
| Senior authority | Review escalations and summary performance | Escalations | Escalated matters and authorised summary data |
| System administrator | Manage rules, users, templates and configuration | Administration overview | Administrative functions granted to that account |

### 4.2 Permission rules in the UI

- Navigation items and actions must be role-aware. Do not show an action as available if the user cannot perform it.
- Hiding a button is not security: server-side API permissions must enforce the same restrictions when integrated.
- Institution users must never see another institution's cases, files or identifiers.
- Regional officers must not automatically see data outside their assigned region.
- Committee users may access only assigned cases and their permitted documents.
- Administrative actions must include confirmation and be recorded in audit history.
- If permission is denied, show a neutral “You do not have access to this item” screen and a route back to an authorised page; do not expose sensitive data in the error.

## 5. Product scope

### 5.1 MVP scope — required

- Secure-looking sign-in and role-aware demo session.
- Role-based application dashboard and navigation shell.
- Application list, search, filters, status and ageing indicators.
- Application details with stage timeline and action history.
- Configurable demo workflow routes, valid transitions and return/revert with mandatory reason.
- EVC queue with schedule/completion status and due dates.
- Unified obligation list for stage deadlines, EVCs, undertakings and document expiry.
- Institution evidence submission interaction and reviewer verification screen.
- Upcoming, overdue and escalated queues.
- Notification centre with sent/failed/demo notification outcomes.
- Audit/event history view.
- Rulebook summary and configurable prototype rules (admin only).
- Synthetic seed data and a predictable demo/reset path.
- Clear empty, loading, error, success and permission-denied states.

### 5.2 Should-have scope

- English/Hindi interface switch for core navigation and essential actions.
- Export current table view to CSV.
- Basic report screens and printable report layout.
- A lightweight date/calendar view for EVCs and due dates.
- Rule version comparison and effective-date information.
- Upload preview and a simulated OCR result panel for a sample lease document.

### 5.3 Stretch scope

- Actual OCR extraction of lease dates with confidence and source evidence.
- Natural-language co-pilot for role-limited search.
- EVC visit clustering/scheduling suggestions.
- Live email/SMS integrations.
- Production identity integration, government single sign-on, DigiLocker or other connectors.
- Predictive delay models based on validated historical data.

Do not let stretch features delay the core end-to-end workflow.

### 5.4 Out of scope for this prototype

- Replacing the official AICTE portal.
- Making or recommending final statutory approval/rejection decisions autonomously.
- Claiming verified access to live AICTE case data or internal APIs.
- Presenting synthetic test records as real institutions or operational statistics.
- Claiming formal security, GIGW or STQC certification without assessment.
- Building complex AI agents where deterministic rules are more reliable.

## 6. Visual direction: “credible government operations software”

### 6.1 Design principles

1. **Official, not ornamental.** The interface should resemble reliable case-management software, not a consumer app or AI marketing website.
2. **Data first.** Prioritise tables, queues, dates, owners, stages, actions and evidence over decorative cards.
3. **Clear hierarchy.** Every page has one clear title, a concise explanation and a primary action where applicable.
4. **Consistent patterns.** Use the same status labels, table controls, form design and detail layout across modules.
5. **Visible traceability.** Users should be able to see why an item is pending, who owns it and what changed.
6. **Low-friction.** Keep common actions in predictable locations and avoid unnecessary confirmation steps.
7. **Accessible by default.** Support keyboard use, screen readers, zoom, colour contrast and bilingual text expansion.
8. **Honest system identity.** Use NIGRANI branding for the prototype and a prototype notice; do not imitate official government marks without permission.

### 6.2 Visual identity and proposed design tokens

These tokens are a prototype design recommendation—not an official AICTE colour specification.

| Token | Proposed value | Usage |
|---|---|---|
| Primary navy | `#15324B` | Main header text, navigation and primary structure |
| Government blue | `#0B65A3` | Primary buttons, active navigation, links and focus accents |
| Dark blue | `#084C78` | Hover states and stronger hierarchy |
| Teal | `#137C78` | Optional secondary status or chart accent; use sparingly |
| Amber | `#9A5A00` foreground on pale amber | Due-soon / warning states |
| Red | `#B42318` foreground on pale red | Overdue, blocked or high-risk states |
| Green | `#216E4E` foreground on pale green | Verified, completed or successful states |
| Page background | `#F4F6F8` | Application canvas |
| Surface | `#FFFFFF` | Main content, tables and forms |
| Border | `#D5DDE5` | Dividers, fields and table boundaries |
| Main text | `#172B3A` | Body text and headings |
| Muted text | `#526575` | Secondary metadata and helper text |

**Status must never be communicated by colour alone.** Pair every status colour with text and, where useful, a small icon. Test contrast before implementation.

### 6.3 Typography

- Use **Noto Sans** or a similarly readable sans-serif with reliable Devanagari support.
- Use 14–16 px body text as a starting point for dense desktop administration screens; do not shrink text to fit tables.
- Page title: 24–28 px, semibold.
- Section title: 17–20 px, semibold.
- Table header: 12–13 px, semibold, with high contrast.
- Body and control labels: 14–16 px.
- Helper/error text: at least 12–13 px and never rely on tiny grey text for important instructions.
- Use tabular numerals for dates, counts and IDs where supported.
- Preserve readable line length and vertical spacing; avoid all-caps labels for long text.

### 6.4 Layout and spacing

- Desktop content max-width: approximately 1440 px; content uses available width for operational tables.
- Use a 12-column grid for large screens, with consistent page gutters around 24–32 px.
- Adopt a 4 px spacing base; common gaps 8, 12, 16, 24 and 32 px.
- Controls should have a comfortable target area and consistent height, normally 40–44 px.
- Cards are reserved for summary metrics or grouped actions; do not wrap every piece of content in a separate floating card.
- Prefer solid surfaces, clean borders, shallow or no shadows, restrained radii (4–8 px) and straightforward alignment.
- Avoid gradients, glassmorphism, blurred translucent panels, glowing borders, animated blobs, oversized emoji, excessive pills, random abstract illustrations, floating AI chat bubbles and decorative chart clutter.

### 6.5 Product shell

**Desktop shell**

- Top government-service-style header containing NIGRANI wordmark, service name, prototype environment label, language switch, help and user menu.
- Persistent left navigation with text labels and simple outline icons.
- Main content area with breadcrumbs, page title, supporting line and primary action aligned consistently.
- No full-screen hero section after login. Users arrive directly at their work queue.
- Optional compact footer with build/version label, support placeholder and privacy/security links.

**Header copy example**

`NIGRANI  |  Approval Workflow & Compliance Monitoring`  
`DEMONSTRATION PROTOTYPE • SYNTHETIC DATA`

Do not use an AICTE seal, national emblem or official header treatment unless authorised.

## 7. Information architecture

### 7.1 Global navigation

1. **Overview**
2. **Applications**
3. **EVC Scheduling**
4. **Compliance & Undertakings**
5. **Documents & Renewals**
6. **Obligations**
7. **Notifications**
8. **Reports**
9. **Audit Trail**
10. **Administration** — visible only to authorised roles

Navigation should be role-filtered. Some modules can be grouped under “Compliance” in a narrow layout, but common destinations must not be hidden behind a complicated mega-menu.

### 7.2 Route examples

- `/login`
- `/dashboard`
- `/applications`
- `/applications/:id`
- `/evc`
- `/compliance`
- `/documents`
- `/obligations`
- `/notifications`
- `/reports`
- `/audit`
- `/admin/rules`
- `/admin/users`
- `/settings`

## 8. Screen-by-screen requirements

### 8.1 Sign-in screen

**Purpose:** Establish the user's session and communicate the system identity without a marketing-style landing page.

**Layout:**
- Simple white/light-grey page with a compact NIGRANI identity block.
- Heading: “Sign in to NIGRANI”.
- Short line: “Approval workflow and institutional compliance monitoring”.
- Prototype environment banner: “Demonstration only — synthetic data”.
- Email/username and password fields, show/hide password, submit button, inline validation.
- “Forgot password?” may be shown only if the recovery flow is implemented; otherwise omit it.
- A separately labelled **Demo role selector** may be included for judge demonstrations. It must be visibly identified as demo-only and must not be confused with production authentication.

**Interactions:**
- Enter submits; invalid fields show a clear message next to the field.
- Loading state disables duplicate submissions.
- Failed login shows a generic safe error, not stack traces or system details.
- Successful login routes to the role's dashboard.

### 8.2 Common dashboard structure

All dashboards share a stable pattern:

1. Page title and one-line purpose.
2. Global filters relevant to the role (Region, date range, stage, status).
3. Up to four key metric tiles, only where useful.
4. “Needs attention” work queue sorted by urgency.
5. One or two compact analytical views, such as cases by stage or ageing band.
6. Recent activity or notification summary.

Do not make the dashboard a wall of cards. The action queue must be the visual centre of gravity.

### 8.3 Institution dashboard

**Primary question:** “What do I need to submit or respond to next?”

**Top summary:**
- Applications in progress.
- Actions required.
- Obligations due soon.
- Overdue submissions.

**Main sections:**
- “Action required” table: item, related application, requirement, due date, status and action.
- Application status list: application ID, application type, current stage, last update and next expected action.
- “Recently submitted” list with submitted date and verification status.
- Messages/deficiency notices with the response deadline and the recorded reason.

**Primary actions:** `View application`, `Upload evidence`, `Respond to deficiency`.

Do not display internal risk labels or restricted committee notes to institutions unless explicitly authorised by policy.

### 8.4 Regional officer dashboard

**Primary question:** “Which cases need action in my region today?”

**Summary metrics:** Open applications, due soon, overdue, EVC actions pending.

**Priority queue columns:** Priority, application ID, institution, stage, days in stage, next deadline, assigned owner and next action.

**Additional views:**
- Ageing bands: `0–7`, `8–15`, `16–30`, `31+` days. These are dashboard bands for analysis, not regulatory deadlines.
- Cases by stage.
- EVC queue due soon.
- Undertakings/documents due soon or overdue.
- Officer workload view where role permissions allow.

**Interactions:** Filter by stage, date, owner and status; open a case; record an allowed transition; assign or reassign only if permitted; inspect the activity trail.

### 8.5 Bureau officer dashboard

**Primary question:** “Where are the cross-region bottlenecks?”

**Layout:**
- National/authorised overall metrics.
- Region comparison table with open cases, overdue items, median/average stage age where meaningful, and cases due soon.
- Stage bottleneck table/heatmap with accessible labels and a text alternative to colour-based displays.
- Overdue categories and trend over a chosen period.
- Click-through into a Region or stage, respecting role permission.

Avoid league-table shaming or unsupported “best/worst region” claims. Show denominators, date range and data completeness for comparative metrics.

### 8.6 Committee member workspace

**Primary question:** “Which assigned cases and meetings require my review?”

**Screen elements:**
- Assigned case queue.
- Visit/hearing schedule with date, venue/mode if applicable, assigned members and status.
- Case summary containing submitted documents and prior permitted observations.
- Observation form with categories, notes, supporting attachment and save/submit action.
- Confirmation before a submitted observation is finalised.

The UI must state whether a note is a draft, submitted observation or final recorded report. Do not imply that the committee member can take decisions outside their authorised responsibility.

### 8.7 Senior authority / escalation dashboard

**Primary question:** “Which overdue or escalated matters require intervention?”

**Elements:**
- Escalations by age and type.
- Case/institution identifier, reason, current owner, escalation level, time overdue and history.
- Filters by region, category and escalation date.
- Detail view with the complete chain of reminders and prior actions.
- Permitted action choices such as “Acknowledge”, “Assign for review” or “Record direction”; do not add an approval/rejection action unless it is explicitly in scope for that authority.

### 8.8 Applications list

**Page title:** “Applications”  
**Supporting line:** “Track processing stage, ownership and next required action.”

**Table columns:**
- Application ID
- Institution
- Application type
- Region
- Current stage
- Status
- Days in current stage
- Next deadline
- Assigned officer/committee
- Last updated
- Actions

**Filters:** Search ID/institution, region, application type, stage, status, assigned officer, due range and overdue only.

**Table behaviour:**
- Column headers support sorting where meaningful.
- Filters remain visible and can be cleared together.
- Active filters are summarised above the table.
- Pagination shows total matching records and current range.
- Empty state tells the user how to broaden or clear filters.
- Clicking a row opens the application detail page; row actions use a separate menu with accessible labels.
- Avoid placing destructive actions as the first or default row action.

### 8.9 Application detail page

**Header:** Application ID, institution, application type, current stage and overall status.

**Primary action area:** The next permitted action only, based on role and current state.

**Tabs:**
1. Overview
2. Workflow
3. Documents
4. Obligations
5. Activity & audit

**Overview:** Applicant/institution details, route, rule version, current owner, next deadline and a concise list of blockers.

**Workflow timeline:** Completed stages, current stage, upcoming configured stages, returns and timestamps. Each stage shows status, responsible role and available permitted action.

**Transition dialog:**
- Current state and proposed next state.
- Required observations/evidence if configured.
- Reason field for return/revert (mandatory).
- Optional supporting attachment where permitted.
- Explicit button: `Confirm transition`.
- Summary of the consequence before committing.

The UI must never show every stage as mandatory for every application. The selected route determines which stages appear.

### 8.10 EVC Scheduling

**Purpose:** Make cases requiring an Expert Visit Committee visible and manageable.

**Views:** Queue view as default; optional calendar view as a secondary view.

**Queue columns:** Application ID, institution, region, reason EVC is required, readiness status, scheduling deadline, proposed/confirmed visit date, assigned committee and status.

**Status examples:** `Awaiting scheduling`, `Proposed`, `Scheduled`, `Visit completed`, `Report pending`, `Closed` — final labels must be validated against the configured process.

**Interactions:**
- Filter by region, date range, status and urgency.
- Open application detail.
- Propose a date/committee when authorised.
- Confirm or revise scheduling with a recorded reason.
- Record completion/report receipt separately where applicable.
- Display conflicts clearly if a scheduling feature supports them; do not claim optimisation if suggestions are just static.

### 8.11 Compliance & Undertakings

**Purpose:** Track time-bound conditions and evidence required from institutions.

**Table columns:** Institution, application/approval reference, undertaking/condition, evidence required, due date, submission status, verification status, assigned reviewer and next action.

**Detail drawer/page:** Full condition text, source/approval reference, due date, reminder timeline, submitted evidence, verification history and permitted actions.

**Submission states:** `Not submitted`, `Submitted`, `Under review`, `Accepted`, `Rejected — correction required`, `Overdue`. Use the precise state model agreed for the prototype.

**Interactions:**
- Institution user can upload evidence and add a short note.
- Reviewer can accept or request correction, with a reason where configured.
- A submission cannot close an obligation merely because a file exists.
- Rejection leaves the history intact and clearly displays the next action and any new deadline.

### 8.12 Documents & Renewals

**Purpose:** Display document validity and renewal requirements.

**Table columns:** Institution, document type, application/approval reference, issue/start date where relevant, expiry date, days until expiry, renewal status and reviewer.

**Upload flow:**
1. Select document type.
2. Choose file and confirm file constraints.
3. Enter or review relevant dates.
4. If OCR is enabled, show extracted values as **unconfirmed suggestions** with a way to inspect the source.
5. Confirm submission.
6. Show receipt, upload time and next step.

**Review flow:** Preview metadata and, where authorised, document content; compare submitted values; accept or request correction; record reviewer and timestamp.

**Expiry states:** `Valid`, `Due soon`, `Expired`, `Renewal submitted`, `Awaiting verification`. Exact labels and transitions must reflect the configured business rules.

### 8.13 Unified Obligations

**Purpose:** One consolidated work queue across application SLAs, EVCs, undertakings and documents.

**Filters:** Obligation type, owner, region (where permitted), status, due date, overdue age and linked application.

**Table columns:** Obligation ID, type, title, linked case/institution, owner, due date, time remaining/overdue, status, reminder stage and next action.

**Detail panel:** Origin event, rule version, due-date basis, reminder schedule, notification outcomes, escalation history, linked evidence and closure reason.

**Visual rule:** Use explicit words like “Due in 3 days” and “Overdue by 5 days”, not colour alone.

### 8.14 Notification centre

**Purpose:** Make reminders and system communication observable.

**Views:** All, Scheduled, Sent, Failed, Retried and Escalated.

**Columns:** Created time, recipient/role, linked obligation, message type, planned time, outcome time, channel, status and error summary where safe.

**Interactions:** Open linked case, view message preview, retry a failed demo notification if authorised, mark as acknowledged where applicable.

For the prototype, an in-app notification log and simulated email outcome are acceptable. The UI must label simulated delivery explicitly and never display “Sent” unless the underlying adapter confirms success.

### 8.15 Reports

**Report tiles/list:** Application pendency, application ageing, EVC status, undertaking compliance, document validity, overdue obligations and region-wise processing performance.

**Report layout:** Report title, data coverage period, generated time, selected filters, clear definitions of key metrics, table/chart and export/print action.

**Rules:**
- Show data timestamp and filter scope.
- Give charts accessible labels and an equivalent table or summary.
- Distinguish counts from rates and show the denominator when presenting a percentage.
- Do not show sample data as official statistics.
- Export only records the current role is permitted to access.

### 8.16 Audit trail

**Purpose:** Provide a readable history of who did what and when.

**Filters:** Event type, actor, date range, application/obligation ID and outcome.

**Event row:** Timestamp, actor/system process, action, affected record, previous/current status, reason and event integrity indicator where supported.

**Detail view:** Structured event payload with sensitive fields redacted where necessary, linked event history and a hash-chain validation outcome.

**Terminology:** Use “Integrity check passed” or “Integrity check failed”. A hash chain helps detect modification; it does not alone prove non-repudiation or prevent an administrator from rewriting every record and hash.

### 8.17 Administration — Rulebook

**Purpose:** Allow authorised administrators to manage configurable prototype routes, timelines, notification rules and escalation recipients.

**List view:** Rule name, route/category, version, effective date, status, last edited by and last edited time.

**Rule detail/editor:**
- Rule identity and description.
- Application categories/routes to which it applies.
- Ordered stage sequence and optional/conditional stages.
- Allowed transitions and return paths.
- Timer definition and calendar basis.
- Reminder thresholds and escalation path.
- Effective date and version note.
- Validation results before save.

**Safety behaviour:**
- Editing an active rule creates a new version; it must not silently rewrite the historic rule for completed case events.
- Show a preview of affected future cases where technically possible.
- Require confirmation for activation.
- Record administrator, timestamp, previous version, new version and change reason.
- Clearly mark all sample rule values as demonstration configuration until validated by authorised subject-matter experts.

### 8.18 Administration — Users and roles

**Table columns:** User, role, organisation/region scope, account status, last activity and actions.

**Actions:** Create/invite demo user, change role/scope, deactivate/reactivate and view access history, based on permissions.

Role changes require confirmation and an audit entry. Do not display passwords, access tokens or secrets.

### 8.19 Help, settings and empty states

- Help content explains status labels, workflow steps, evidence requirements and where to seek support.
- Settings include language, notification preferences if supported and profile information.
- Every empty state gives a useful next step: “No overdue obligations” is preferable to an empty chart.
- Every error state states what happened, what is safe to do next and whether the user's previous data was saved.

## 9. Interaction patterns and component rules

### 9.1 Buttons

- One primary action per main page section.
- Secondary actions are outlined or quiet text buttons.
- Destructive or irreversible actions use a clearly labelled confirmation dialog.
- Button labels use verbs: `Submit evidence`, `Return for correction`, `Confirm schedule`, `Verify document`.
- Do not use vague buttons such as `Go`, `Proceed` or `Do it` when the outcome matters.

### 9.2 Forms

- Labels remain visible when the user starts typing; do not rely on placeholders as labels.
- Required fields are marked consistently and explained.
- Validation appears next to the field and in an accessible form summary when needed.
- Preserve entered values after a correctable validation error.
- Use native/select controls for known lists; use searchable comboboxes only where lists are long.
- Dates must have an unambiguous display and keyboard-editable entry. Show the applicable timezone/context if relevant.
- For deadlines, show both the date and the human-readable urgency.

### 9.3 Tables

- Dense operational information belongs in tables, with sticky headers only where they improve long-list navigation.
- Keep the first identifying column visible on very wide tables if feasible.
- Avoid rendering every column as a badge or making each row a large card.
- Provide sortable columns, filters, pagination and an understandable empty state.
- On mobile, switch to a compact row summary with details on selection rather than shrinking every column beyond readability.

### 9.4 Modals and drawers

- Use a modal for a short decision that requires focus, such as a transition confirmation.
- Use a side drawer for quick inspection of notification details or an obligation summary.
- Use a full page for complex tasks such as application review, large forms and rule editing.
- Ensure focus returns to the triggering control after a modal closes.

### 9.5 Feedback states

- Success messages confirm what happened and link to the updated record.
- Warning messages explain a pending consequence.
- Errors distinguish validation failure, permission denial, network error and server failure.
- Long-running actions show progress and prevent accidental duplicate submission.
- Use toasts for low-risk confirmation only; important decisions and errors must remain visible in the page or activity log.

## 10. Accessibility, bilingual UI and responsive behaviour

### 10.1 Accessibility target

Design and test towards WCAG 2.1 AA and applicable GIGW 3.0 criteria.

- Semantic HTML and a single clear page-level H1.
- Skip-to-content link.
- Full keyboard operation and visible focus indicator.
- Sufficient text and non-text contrast; do not encode status by colour alone.
- Meaningful accessible names for icon-only buttons.
- Alternative text for meaningful images; decorative graphics ignored by screen readers.
- Screen-reader-friendly table headers, form labels, validation and dynamic status messages.
- Support zoom/reflow and avoid horizontal scrolling for normal page content; large data tables may use a purposeful responsive alternative.
- Respect reduced-motion preferences; avoid gratuitous animation.
- Automated accessibility scans plus manual keyboard and screen-reader checks.

### 10.2 English/Hindi

- Keep a language switch in the global header when both languages are implemented.
- Translate navigation, buttons, core statuses, validation and primary help text—not only the landing page.
- Use a font with clear Devanagari rendering.
- Do not machine-translate legal/regulatory wording without review.
- Allow for longer translated labels without clipping or overlapping controls.

### 10.3 Responsive breakpoints

Suggested breakpoints (adjust during implementation):
- Mobile: below 640 px.
- Tablet: 640–1023 px.
- Desktop: 1024 px and above.

Desktop: full navigation and operational tables.  
Tablet: collapsible side navigation and fewer visible table columns.  
Mobile: prioritise action queue, obligation details and evidence submission; place advanced filters in an accessible panel.

## 11. Prototype data and visual realism

### 11.1 Synthetic-data policy

Use realistic, internally consistent demo records with fictional institution names and clear synthetic IDs. A suggested dataset contains 100–500 synthetic applications if the team can maintain consistency, but a smaller curated dataset is sufficient for a live demonstration.

Include scenarios that cover:
- Only Scrutiny.
- Scrutiny + EVC.
- Only EVC.
- EVC + SAC/SHC where configured.
- A case currently within its expected timeline.
- A case approaching a deadline.
- A case overdue and escalated.
- A deficiency return awaiting institutional response.
- An undertaking submitted and pending review.
- A lease renewal uploaded but not yet verified.
- A document with a confirmed upcoming expiry.
- A failed/retried notification.

Use names, dates and identifiers consistently across dashboards, detail pages, audit history and notifications. Random values that contradict one another make the prototype look fabricated and undermine trust.

### 11.2 Make the product feel real—not AI-generated

- Start inside the application, not with a dramatic hero section or a generic “reimagine the future with AI” headline.
- Use domain-specific labels: `Application ID`, `Current stage`, `Days in stage`, `Next deadline`, `Assigned officer`, `Verification status`.
- Prefer specific empty states, concrete tables, realistic filter controls, meaningful date formats and clear update times.
- Use restrained typography and a consistent spacing rhythm.
- Limit metric tiles to the few that drive decisions.
- Avoid generic copy such as “Unlock insights”, “AI-powered excellence”, “Transform your workflow” or “Your intelligent workspace”.
- Do not use random avatar circles, fake testimonials, decorative gradients, glass cards or charts without a real question they answer.
- Use no fake “live AICTE data” indicators or fabricated integration status.
- Add small, useful operational details: last updated timestamp, current filter context, source rule version and activity trail.
- Show both normal and failure states. A polished interface includes empty, denied, invalid, loading and retry states—not only the ideal scenario.
- Every key control should be functional in the demo; do not present dead buttons as completed functionality.

## 12. Functional acceptance criteria by user journey

### Journey A: Application routing
1. An authorised user creates or opens a synthetic application.
2. The UI shows the configured application category and active rule version.
3. The route displays only applicable stages.
4. A valid transition updates current stage/status and creates a workflow event.
5. An invalid transition is rejected with an understandable message.

### Journey B: Return for deficiency
1. An authorised reviewer selects `Return for correction`.
2. The dialog requires the reason and any configured response deadline.
3. Submission updates the case to the configured waiting state.
4. Institution view shows the deficiency notice, deadline and upload/respond action.
5. Audit history records the actor, reason and timestamp.

### Journey C: Deadline and escalation
1. A seeded obligation is due soon or overdue.
2. Dashboard and obligation list show consistent status and remaining/overdue time.
3. The notification centre displays the relevant scheduled/sent/failed result.
4. An overdue obligation shows the configured escalation level and responsible role.
5. Re-running a scheduler/demo action does not create a duplicate reminder for the same reminder window.

### Journey D: Compliance evidence
1. Institution uploads evidence and receives a visible submission confirmation.
2. Status changes to `Submitted`/`Under review`, not automatically `Verified`.
3. An authorised reviewer opens the evidence and records acceptance or a request for correction.
4. The institution sees the result and next action.
5. The obligation closes or remains open according to the configured verification outcome.

### Journey E: Audit history
1. After a transition, notification, upload or verification, the detail page displays a corresponding event.
2. The event shows who/what acted, when, which record changed and the reason/outcome where appropriate.
3. The audit integrity screen reports a clear pass/fail status for the stored chain.
4. The UI does not claim that a passing hash-chain check proves all possible forms of tampering are impossible.

### Journey F: Role boundaries
1. Institution user opens an application list and sees only their own records.
2. Regional officer sees only the permitted region/cases.
3. Committee user sees assigned cases.
4. Direct navigation to an unauthorised record results in access denial without exposing its contents.

## 13. Non-functional UI requirements

- Responsive, usable on current desktop and mobile browsers.
- No horizontal layout shift when charts or tables load.
- Optimised assets and no unnecessary autoplay media.
- Loading, error and empty states for all data-driven screens.
- User input preserved after correctable validation errors.
- Search and filters can be combined and reset.
- Important actions confirmed and represented in activity history.
- Error messages do not expose stack traces, internal endpoint details or sensitive information.
- Dates and times are displayed consistently and stored/handled with an agreed timezone strategy.
- Core interface navigation should remain usable if an optional chart or external integration fails.
- Support a stable demo reset so the team can repeat the judge-facing journey.

## 14. Frontend implementation guidance

Suggested hackathon UI stack:
- React + TypeScript + Vite.
- Tailwind CSS or a consistent component system with design tokens.
- React Router for page navigation.
- TanStack Table or an equivalent accessible table pattern for operational grids.
- Recharts only for charts that answer a clearly stated monitoring question.
- React Hook Form + schema validation, or another consistent form approach.
- A central typed mock-data layer that can later be replaced by API calls.

Recommended frontend structure:

```text
src/
  app/
    router.tsx
    providers.tsx
  components/
    shell/
      AppHeader.tsx
      SideNavigation.tsx
      Breadcrumbs.tsx
    data-display/
      DataTable.tsx
      StatusBadge.tsx
      MetricSummary.tsx
      Timeline.tsx
      EmptyState.tsx
      ErrorState.tsx
    forms/
      FormField.tsx
      DateField.tsx
      FileUpload.tsx
      ConfirmDialog.tsx
  features/
    auth/
    dashboard/
    applications/
    workflow/
    evc/
    compliance/
    documents/
    obligations/
    notifications/
    reports/
    audit/
    admin/
  data/
    demoApplications.ts
    demoObligations.ts
    demoNotifications.ts
    demoRules.ts
  i18n/
  styles/
    tokens.css
    globals.css
```

Keep components reusable but do not over-abstract simple pages. The application should have a consistent shell and domain-oriented modules. When connected to a backend, use typed API contracts and handle permissions, loading and error states centrally.

## 15. Demo narrative and recommended run order

Target a 4–5 minute demonstration. The interface should make each step visible without lengthy narration.

1. **Open the dashboard:** point to the due-soon and overdue queues.
2. **Open an application:** show its configured route and active rule version.
3. **Complete scrutiny:** demonstrate transition to the next applicable stage.
4. **Return a second case:** show the mandatory reason and institution-facing deficiency notice.
5. **Trigger an overdue obligation:** use a seeded scenario or explicit demo clock; show the notification record and escalation owner.
6. **Submit compliance evidence:** switch to institution role; upload/submit evidence.
7. **Verify as officer:** accept or request correction; show the updated obligation status.
8. **Open audit trail:** show linked events and an integrity-check result.
9. **Close with safeguards:** explain that the system supports administration but does not replace competent human decisions.

Ensure demo data can be reset quickly and that the application remains coherent if the live network is unavailable.

## 16. Evaluation plan

### UI evaluation
- Can a first-time user identify the most urgent action quickly?
- Are status labels, deadlines and owners immediately understandable?
- Can a user complete the core journey without instructions from the developer?
- Are errors recoverable and specific?
- Does each role see the correct navigation and information?
- Are pages consistent in typography, spacing, tables, buttons and status treatments?

### Accessibility evaluation
- Keyboard-only completion of core journeys.
- Visible focus and skip link.
- Automated WCAG checks plus manual checks.
- Contrast verification.
- Screen-reader labels and form errors.
- Zoom/reflow tests on common viewport sizes.

### Functional UI tests
- Route-dependent stages render correctly.
- Return reason is mandatory.
- Dates/status are consistent across pages.
- Upload confirmation and verification are distinct.
- Table filters/sorting/pagination work.
- Role-scoped screens and denied states work.
- Notification states accurately reflect mock adapter outcomes.
- Audit events update after critical interactions.

## 17. Risks and mitigations

| Risk | Mitigation |
|---|---|
| UI suggests that all applications follow the same route | Render stages from the configured route, not a hard-coded universal timeline |
| Demo is visually attractive but actions are fake | Connect buttons to a coherent mock-state store and demonstrate state changes end to end |
| Synthetic and official data are confused | Persistent prototype banner, explicit labels and fictional demo identifiers |
| Overloaded dashboards | Prioritise work queue and four key metrics; move detailed analysis to reports |
| Colour-only status communication | Text labels, icons and accessible contrast |
| OCR error leads to a false deadline | Mark extracted values as unconfirmed and require human review |
| Rule edits silently alter old cases | Version rules and preserve the applied version in history |
| Too many features reduce quality | Complete MVP journeys before adding co-pilot, prediction or integrations |
| Interface falsely appears officially endorsed | Use NIGRANI branding and no unauthorised official seal; add prototype disclaimer |
| Mobile tables become unusable | Responsive row summaries and details view rather than tiny columns |

## 18. Definition of done

The UI MVP is ready for a hackathon presentation when:

- [ ] Role-aware sign-in/demo entry works.
- [ ] All required MVP pages are reachable through consistent navigation.
- [ ] Application routes render the correct applicable stages.
- [ ] Valid transition and mandatory-reason return journeys work.
- [ ] EVC, undertaking and document obligations use a common visual and interaction pattern.
- [ ] Evidence submission and reviewer verification are separate steps.
- [ ] Due-soon, overdue and escalated states are consistent across pages.
- [ ] Notification log displays honest outcomes, including failures where simulated.
- [ ] Audit history updates after important actions.
- [ ] Synthetic records are clearly labelled.
- [ ] No primary button is decorative or non-functional.
- [ ] Loading, empty, error and access-denied states are implemented.
- [ ] The layout works on desktop and mobile widths.
- [ ] Keyboard navigation and contrast have been checked.
- [ ] The main demo can be repeated from a clean state in 4–5 minutes.
- [ ] Any unimplemented feature is labelled as planned or simulated rather than complete.

## 19. Reference wireframes — how the UI should look

These are structural wireframes, not final pixel designs. They define layout, hierarchy and information density. The final UI should use the design tokens and component rules above.

### 19.1 Regional officer dashboard (desktop)

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ NIGRANI  Approval Workflow & Compliance Monitoring   DEMO • SYNTHETIC DATA   EN | हिन्दी  ▾ │
├───────────────────┬──────────────────────────────────────────────────────────────────────────┤
│ OVERVIEW          │ Overview                                                                  │
│ Applications      │ Cases and obligations requiring attention in your authorised region.       │
│ EVC Scheduling    │ Region [All permitted ▼]  Date [Last 30 days ▼]  [Reset filters]            │
│ Compliance        │                                                                          │
│ Documents         │  Open cases        Due in 7 days       Overdue           EVC pending       │
│ Obligations       │  128               19                  11                14                │
│ Notifications     │                                                                          │
│ Reports           │  NEEDS ATTENTION                                          [View all →]     │
│ Audit Trail       │  Priority  Application  Institution       Stage    Due       Owner        │
│                   │  HIGH      AI-260184    North Valley Inst. Scrutiny  22 Oct    R. Sharma    │
│ ─────────────     │  HIGH      AI-260201    Central Tech Inst. EVC       23 Oct    EVC Cell     │
│ Administration   │  MEDIUM    AI-260219    Pioneer College    Evidence  27 Oct    Institution │
│                   │                                                                          │
│ Help              │  CASE AGEING                                  RECENT ACTIVITY              │
│                   │  0–7 days  42                            14:32  EVC date proposed          │
│                   │  8–15 days 25                            13:58  Evidence submitted          │
│                   │  16–30 days 18                           12:41  Application returned        │
│                   │  31+ days  31                                                            │
├───────────────────┴──────────────────────────────────────────────────────────────────────────┤
│ Prototype v0.1 • Data last updated: 21 Oct 2026 • Help / Accessibility / Sign out             │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Design intent:** Left navigation is quiet and consistent. The case queue is the focal point. Metric tiles are compact and directly useful. Charts are secondary. A user can open the urgent case from the table without visiting a separate analytics page first.

The counts and dates in this wireframe are illustrative only and must be replaced with a consistent seeded dataset in the prototype.

### 19.2 Application list

```text
Applications                                                       [+ Create demo application]
Track application stage, ownership and next required action.

[Search ID or institution…] [Stage ▼] [Status ▼] [Region ▼] [Due date ▼] [Overdue □] [Clear]
Active filters: Stage: Scrutiny ×     Status: In progress ×

┌────────────┬────────────────────┬─────────────┬────────────┬──────────────┬──────────┬─────────┐
│ App ID     │ Institution        │ Type        │ Stage      │ Days in stage│ Next due │ Status  │
├────────────┼────────────────────┼─────────────┼────────────┼──────────────┼──────────┼─────────┤
│ AI-260184  │ North Valley Inst. │ Renewal     │ Scrutiny   │ 8            │ 22 Oct   │ In prog. │
│ AI-260201  │ Central Tech Inst.  │ New         │ EVC         │ 12           │ 23 Oct   │ Due soon │
│ AI-260219  │ Pioneer College     │ Renewal     │ Evidence    │ 4            │ 27 Oct   │ Pending  │
└────────────┴────────────────────┴─────────────┴────────────┴──────────────┴──────────┴─────────┘
Showing 1–25 of 128 results                                      [Previous] [1] [2] [3] [Next]
```

**Design intent:** This is an operational table, not a set of cards. Filters are visible, active filters can be removed individually, the status includes text, and pagination communicates how many records match the query.

### 19.3 Application detail

```text
Applications / AI-260201
AI-260201  Central Tech Institute                                  [Return for correction ▼]
Scrutiny + EVC  •  Current stage: EVC  •  Rule version: ROUTE-2026.1

[Overview] [Workflow] [Documents] [Obligations] [Activity & audit]

NEXT ACTION
Confirm EVC schedule                                  Deadline: 23 Oct 2026 (Due in 2 days)
Assigned to: Regional EVC Coordinator                 [Propose visit date]

WORKFLOW
✓ Application received       14 Oct 2026 09:12
✓ Scrutiny completed         17 Oct 2026 15:40
● EVC scheduling             In progress
○ EVC report                 After visit, if applicable
○ Competent authority        Human decision, as prescribed

OPEN OBLIGATIONS                               RECENT ACTIVITY
EVC scheduling deadline • Due in 2 days        21 Oct 10:16 • EVC queue entry created
Lease verification • Under review              20 Oct 16:48 • Lease evidence submitted
```

**Design intent:** The primary next action is visible without scrolling. Workflow and obligations are linked. The rule version and human-decision boundary are explicit. Only stages in this application's configured route appear.

### 19.4 Return-for-correction dialog

```text
Return application for correction
This action will notify the institution and record the reason in the case history.

Reason for return *
┌────────────────────────────────────────────────────────────────┐
│ Specify the missing information or correction required…        │
└────────────────────────────────────────────────────────────────┘

Institution response due date *   [DD / MM / YYYY]
Supporting note (optional)         [Attach file]

[Cancel]                                             [Confirm return]
```

The reason and response deadline are required when configured by the applicable rule. No return action can be submitted with an empty reason.

### 19.5 Visual quality bar

A screen is ready when it looks like the wireframes in spirit: aligned, restrained and information-led. Replace the example values with coherent demo data. Use charts only if they help answer a real operational question. Avoid decorative gradients, oversized headlines, fake AI status widgets, random card grids and non-functional buttons.

---

## 20. Reference sources

1. **AICTE Approval Process Handbook 2024–25 to 2026–27** — applicable process baseline: https://www.aicte.gov.in/sites/default/files/APH%20Final.pdf
2. **Guidelines for Indian Government Websites and Apps (GIGW 3.0)** — government website/application quality and compliance guidance: https://guidelines.india.gov.in/
3. **GIGW 3.0 — Scope and Objective**: https://guidelines.india.gov.in/scope-and-objective/
4. **GIGW 3.0 — New Features**: https://guidelines.india.gov.in/new-features-of-gigw-3-0/
5. **GIGW 3.0 — Quick Tips**: https://guidelines.india.gov.in/quick-tips/
6. **W3C — Web Content Accessibility Guidelines (WCAG) 2.1**: https://www.w3.org/TR/WCAG21/
7. **SIH Problem Statement 26262 — Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System** — provided project brief.

---

## 21. Final product direction

NIGRANI should feel like a well-designed government operations platform: restrained, consistent, accessible and built around the work officials and institutions need to complete. Its credibility should come from accurate workflow states, clear deadlines, accountable actions and a complete history—not from visual effects or a large number of AI features.
