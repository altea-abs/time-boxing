# Design System Strategy: AlteaON

## 1. Overview & Creative North Star
**Creative North Star: The Precision Architect**

This design system is built to transform complex back-office automation into a high-trust, editorial experience. We are moving away from the cluttered "dashboard fatigue" common in enterprise software. Instead, we embrace **The Precision Architect**: a philosophy where every element is intentional, surfaces are deep and layered, and the interface breathes through generous white space and sharp, authoritative typography.

The system breaks the "template" look by using **intentional asymmetry**. Hero elements may be offset, and secondary information is tucked into sophisticated tonal layers. We use the contrast between the deep `Midnight Blue` (#081928) and the electric `Green Rio Grande` (#b2d600) to signal professional energy and absolute clarity.

---

## 2. Colors: Tonal Depth & Atmospheric UI
Our palette is rooted in a "Sleek Dark" aesthetic, prioritizing ocular comfort without sacrificing the high-tech edge of automation.

### The Palette
- **Background (`#041423`)**: The canvas. A deep, midnight void that provides the foundation for trust.
- **Primary (`#b2d600`)**: The "Green Rio Grande." This is our pulse. It is used exclusively for action, progress, and highlights.
- **Neutral Tones**: We utilize the `surface-container` tiers to create hierarchy.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section off areas of the UI. Separation must be achieved through:
1.  **Background Shifts:** Placing a `surface-container-high` card on a `surface` background.
2.  **Vertical Space:** Using the spacing scale (e.g., `16` or `20`) to create clear thematic groups.
3.  **Soft Tonal Transitions:** Subtle shifts in hex value to define zones.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
- **Base:** `surface`
- **Modules:** `surface-container-low`
- **Active Cards/Modals:** `surface-container-high`
  By "nesting" these tiers, we create a sense of three-dimensional depth that feels premium and architectural rather than flat and digital.

### The "Glass & Gradient" Rule
To add "soul" to the automation platform, floating elements (like hover tooltips or global navigation) should use **Glassmorphism**. Apply `surface-container-highest` with a 70% opacity and a `20px` backdrop-blur.
For CTAs, use a subtle linear gradient from `primary` (#cdf332) to `primary_container` (#b2d600) at a 135-degree angle to give buttons a tactile, "lit-from-within" quality.

---

## 3. Typography: Editorial Authority
We utilize **Halyard Display** (and Manrope for displays) to evoke a sense of modern engineering.

- **Display (Manrope, 3.5rem - 2.25rem):** Used for data "hero" numbers and high-level section headers. It should feel massive, confident, and slightly airy.
- **Headline (Manrope, 2rem - 1.5rem):** The primary organizational anchor.
- **Title & Body (Inter/Halyard, 1.375rem - 0.75rem):** High-readability sans-serifs. Use `title-lg` for card titles to maintain an editorial feel.
- **Labels (0.75rem - 0.6875rem):** Always in `on-surface-variant` to keep secondary metadata from distracting the eye.

**Hierarchy Strategy:** Use extreme scale contrast. A `display-lg` metric next to a `label-sm` metadata point creates a professional, curated look that mimics high-end financial reports.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are largely forbidden. We define importance through **Tonal Layering**.

- **The Layering Principle:** Place a `surface-container-lowest` card inside a `surface-container-low` section. This "recessed" look implies stability and containment for data-heavy tables.
- **Ambient Shadows:** For floating elements (Modals/Popovers), use a shadow color of `#000000` at `12%` opacity with a `40px` blur and `10px` Y-offset. It should feel like an ambient glow, not a hard shadow.
- **The "Ghost Border" Fallback:** If a divider is required for accessibility, use the `outline-variant` token at **15% opacity**. It should be felt, not seen.
- **Glassmorphism:** Use the `surface-tint` sparingly behind glass layers to give a faint green "tint" to the blur, reinforcing the AlteaON brand identity in the Z-axis.

---

## 5. Components: The Building Blocks

### Buttons
- **Primary:** Gradient (`primary` to `primary_container`), `rounded-md` (0.375rem). Text: `on_primary` (Dark).
- **Secondary:** Outline-only using `outline` at 30% opacity. Hover state fills to `secondary_container`.
- **Tertiary:** Text-only in `primary`, no background. Used for low-priority actions like "Cancel" or "Learn More."

### Input Fields
- **Style:** `surface-container-highest` background. No border. A 2px bottom-accent in `primary` appears only on focus.
- **States:** Error states use `error` text and a subtle `error_container` glow.

### Cards & Lists
- **Rule:** Forbid divider lines. Use `8` (1.75rem) or `10` (2.25rem) spacing between list items.
- **Background:** Use `surface-container-low` for list items to distinguish them from the `surface` background.

### Data Chips
- **Status Chips:** High-contrast backgrounds (`primary_container` for Success, `error_container` for Alert) with `label-md` typography. Always `rounded-full`.

### Back-Office Specifics: "The Automation Rail"
- **The Process Timeline:** A vertical component using `primary_fixed_dim` dots connected by a `ghost-border` dashed line. This tracks background automation tasks without cluttering the main view.

---

## 6. Do’s and Don’ts

### Do
- **Do** use `20` (4.5rem) spacing for major section breathing room.
- **Do** use `Green Rio Grande` for "Success" states and "Submit" actions to reinforce the brand.
- **Do** use intentional asymmetry—align headlines to the far left while keeping data summaries slightly offset to the right.

### Don't
- **Don't** use pure white (#FFFFFF). All "white" text should be `on_surface` (#d4e4f9) to maintain the dark-mode's tonal depth.
- **Don't** use 90-degree corners. Always use the `md` (0.375rem) or `lg` (0.5rem) roundedness scale to soften the professional feel.
- **Don't** use "Alert Red" for everything. Reserve high-saturation colors for critical system failures; use `tertiary` (purple/lavender) for informational alerts.