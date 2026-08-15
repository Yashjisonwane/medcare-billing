---
name: Clinical Operations System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#44474e'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#75777f'
  outline-variant: '#c5c6cf'
  surface-tint: '#4e5e81'
  primary: '#031635'
  on-primary: '#ffffff'
  primary-container: '#1a2b4b'
  on-primary-container: '#8293b8'
  inverse-primary: '#b6c6ef'
  secondary: '#0040df'
  on-secondary: '#ffffff'
  secondary-container: '#2d5bff'
  on-secondary-container: '#efefff'
  tertiary: '#101820'
  on-tertiary: '#ffffff'
  tertiary-container: '#252c36'
  on-tertiary-container: '#8c939f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#b6c6ef'
  on-primary-fixed: '#081b3a'
  on-primary-fixed-variant: '#364768'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b8c3ff'
  on-secondary-fixed: '#001355'
  on-secondary-fixed-variant: '#0035bd'
  tertiary-fixed: '#dce3f0'
  tertiary-fixed-dim: '#c0c7d3'
  on-tertiary-fixed: '#151c25'
  on-tertiary-fixed-variant: '#404751'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  tabular-nums:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1440px
  gutter: 16px
---

## Brand & Style
The design system is engineered for high-density clinical environments where precision and speed of information processing are paramount. The brand personality is **secure, efficient, and professional**, leaning into a **Corporate / Modern** aesthetic with subtle influences of **Minimalism**.

The UI avoids decorative elements that could distract from patient data. Instead, it utilizes clear structural hierarchy and ample whitespace to reduce cognitive load. The emotional response should be one of "calm control"—reassuring the practitioner that the platform is a reliable extension of their professional workflow. High-end internal operations are reflected through refined typography and a deliberate lack of "consumer-grade" visual noise.

## Colors
The palette is rooted in medical authority and trust. 

- **Deep Navy (#1A2B4B):** Used for persistent structural elements like sidebars, headers, and primary navigation to ground the application.
- **Bright Clinical Blue (#2D5BFF):** Reserved for primary functional actions (Save, Submit, New Record). This high-energy blue creates a clear "action layer" over the neutral interface.
- **Soft Healthcare Blue (#EBF2FF):** Utilized for large surface areas and background groupings to provide a softer alternative to pure white, reducing eye strain during long shifts.
- **Status Colors:**
    - **Success:** #10B981 (Clinical Green)
    - **Warning:** #F59E0B (Alert Amber)
    - **Error:** #EF4444 (Emergency Red)
- **Neutrals:** A range of grays from #F8FAFC (Surface) to #0F172A (Text) ensures WCAG AA compliance is met for all text-on-background combinations.

## Typography
This design system utilizes **Inter** for its exceptional legibility and comprehensive support for tabular numerals, which are essential for billing and dosage data.

- **Data Density:** Use `body-md` (14px) as the default size for table content and form labels to allow for more information visibility without sacrificing readability.
- **Numerical Data:** For all billing amounts, ICD-10 codes, and clinical measurements, enable the `tabular-nums` OpenType feature to ensure columns align perfectly for easy scanning.
- **Hierarchy:** Use the `label-md` style for section headers within cards to clearly categorize complex medical records.

## Layout & Spacing
The layout follows a **Fluid Grid** model with strict adherence to a 4px baseline shift. 

- **Desktop (1280px+):** 12-column grid. Side navigation is fixed at 240px. Main content area uses 32px padding for high-level dashboards and 16px padding for dense data entry views.
- **Tablet (768px - 1279px):** 8-column grid. Side navigation collapses to an icon rail (64px). 
- **Mobile (<768px):** 4-column grid. 16px horizontal margins. Use stacked layouts for form fields.

Spacing between related form fields should be `sm` (8px), while spacing between unrelated sections or cards should be `lg` (24px) to create clear mental grouping.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** and **Ambient Shadows** to create a structured "Work Surface" metaphor.

1.  **Base Layer:** The `Soft Healthcare Blue` background acts as the canvas.
2.  **Surface Layer:** White containers (cards) sit on the base layer.
3.  **Low Elevation (Resting Cards):** A very soft, diffused shadow (0px 2px 4px rgba(26, 43, 75, 0.05)) distinguishes cards from the background.
4.  **Mid Elevation (Dropdowns/Modals):** A more pronounced shadow (0px 10px 15px -3px rgba(26, 43, 75, 0.1)) used for interactive overlays.
5.  **Interactions:** Elements do not use heavy shadows on hover; instead, they use subtle border color shifts to the `Bright Clinical Blue` to signal interactivity without breaking the clean aesthetic.

## Shapes
The shape language uses **Rounded** corners to balance clinical sterile-ness with a modern, approachable feel. 

- **Standard Elements:** 8px (`0.5rem`) for buttons, input fields, and small cards.
- **Large Containers:** 16px (`1rem`) for main dashboard panels and modals.
- **Badges/Chips:** Full pill-shape for status indicators to differentiate them from interactive buttons.
- **Focus States:** A 2px offset border in `Bright Clinical Blue` should be used for accessibility, mirroring the component's corner radius.

## Components
Consistent application of the following component rules is required:

- **Primary Buttons:** Solid `Bright Clinical Blue` with white text. Height is 40px for standard, 32px for compact (within tables).
- **Secondary Buttons:** Ghost style with `Deep Navy` borders and text.
- **Input Fields:** Use 1px #CBD5E1 borders. On focus, the border shifts to `Bright Clinical Blue` with a subtle glow. Error states use `Emergency Red` text and a 1px solid border.
- **Data Tables:** High-density with 8px vertical cell padding. Header rows use `Soft Healthcare Blue` backgrounds with `label-md` typography for column titles.
- **Status Badges:** Use light tinted backgrounds (10% opacity of the status color) with high-contrast text for maximum legibility (e.g., Success uses a pale green background with dark green text).
- **Clinical Cards:** Use 16px padding and a 1px #E2E8F0 border. The header of the card should be separated by a subtle horizontal rule.
- **Progress Indicators:** Linear steppers for multi-step billing processes, using `Deep Navy` for completed steps and `Bright Clinical Blue` for active steps.