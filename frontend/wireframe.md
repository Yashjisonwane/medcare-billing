# Frontend Wireframe Specification

## Medical Practice Billing & Clinical Documentation Platform

---

## 1. Document Information

| Field | Value |
|---|---|
| Document | Frontend Wireframe Specification |
| Version | 0.9.0 |
| Status | Draft — Awaiting Stitch Codebase Audit and Internal Review |
| Current Phase | Phase 1 — Frontend Documentation and Planning |
| Related Document | `PRD.md` |
| Approved Frontend Stack | React.js, JavaScript, Tailwind CSS, React Router DOM |
| Backend Status | Not started |
| Database Status | Not started |
| Last Updated | 04 August 2026 |

---

## 2. Purpose

This document defines the frontend structure of the medical practice billing and clinical documentation platform.

It documents:

- Application layout
- Proposed routes
- Screens
- Tabs
- Forms
- Tables
- Cards
- Modals
- Drawers
- Buttons
- Filters
- Search
- Pagination
- Loading states
- Empty states
- Error states
- Permission-denied states
- Responsive behaviour
- Accessibility expectations
- Mock-service dependencies
- Role-based screen visibility
- Existing and missing Stitch UI screens

This document is frontend-only.

It does not define:

- Backend APIs
- Database schemas
- Real authentication
- Real AI integration
- Real SMS or email delivery
- Real PDF generation
- Electronic claim submission
- Cloud infrastructure

---

## 3. Stitch Design Preservation Rule

The existing Google Stitch-exported UI is the approved visual reference.

The development team must not:

- Redesign existing screens
- Replace existing layouts
- Change existing colours
- Change existing typography
- Change approved spacing
- Replace existing icons
- Replace existing cards
- Replace existing forms
- Replace existing tables
- Replace existing buttons
- Replace the existing sidebar
- Replace the existing top header
- Modify existing images or illustrations
- Regenerate images
- Change image cropping or aspect ratio
- Create a different design system
- Remove existing components
- Replace an existing screen with a newly designed alternative

When a required component or screen is missing, it must reuse the visual pattern of the closest existing Stitch screen.

Any visual change must be listed under:

> Proposed UI Changes Requiring Approval

No proposed visual change may be applied automatically.

---

## 4. Stitch Audit Status

The actual Stitch project must be inspected before implementation.

Do not invent actual component paths or existing route names.

The following fields must be completed after scanning the project:

| Audit Item | Current Status |
|---|---|
| Frontend framework detected | TBD after codebase inspection |
| Build tool detected | TBD after codebase inspection |
| Existing route count | TBD |
| Existing page count | TBD |
| Existing modal count | TBD |
| Existing reusable components | TBD |
| Existing design tokens | TBD |
| Existing mock-data files | TBD |
| Existing state-management approach | TBD |
| Existing form libraries | TBD |
| Existing validation libraries | TBD |
| Existing icons and assets | TBD |
| Build errors | TBD |
| Missing screens | TBD |
| Duplicate screens | TBD |
| Incomplete interactions | TBD |

After the audit, every screen in this document must be marked as:

- Existing and Complete
- Existing but Incomplete
- Missing
- Duplicate
- Not Required for Frontend MVP

---

## 5. Wireframe Status Definitions

| Status | Meaning |
|---|---|
| Existing and Complete | Screen already exists and covers the required layout |
| Existing but Incomplete | Screen exists but is missing fields, states, or interactions |
| Missing | Screen or view is not present in the Stitch project |
| Duplicate | More than one screen performs the same function |
| Pending Audit | Existing status cannot be confirmed until the codebase is inspected |
| Configuration Pending | Provider-specific information has not been supplied |
| Future Backend | Frontend can display the interface, but real functionality requires backend integration |

---

# 6. Global Application Shell

## 6.1 Desktop Layout

The main application layout should contain:

```text
┌───────────────────────────────────────────────────────────────┐
│ Sidebar │ Top Header                                          │
│         ├─────────────────────────────────────────────────────┤
│         │                                                     │
│         │ Main Page Content                                   │
│         │                                                     │
│         │                                                     │
└───────────────────────────────────────────────────────────────┘