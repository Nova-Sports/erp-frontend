# Styling

This project uses **Tailwind CSS v3** with a custom design token system defined in `tailwind.config.js`.  
All styling is done with Tailwind utility classes — no CSS modules or styled-components.

---

## Color Tokens

All semantic colors are defined in `tailwind.config.js` under `theme.extend.colors`.  
Each token has sub-keys: `DEFAULT`, `hover`, `light`, and `foreground`.

### Semantic Tokens (use these in new components)

| Token       | DEFAULT   | hover     | light     | foreground | Purpose                                        |
| ----------- | --------- | --------- | --------- | ---------- | ---------------------------------------------- |
| `primary`   | `#5b6af8` | `#4a59f0` | `#eef0ff` | `#ffffff`  | Brand purple — sidebar, active states, buttons |
| `secondary` | `#64748b` | `#475569` | `#f1f5f9` | `#ffffff`  | Muted grey — secondary text, borders           |
| `info`      | `#06b6d4` | `#0891b2` | `#ecfeff` | `#ffffff`  | Cyan — info notifications, highlights          |
| `success`   | `#10b981` | `#059669` | `#d1fae5` | `#ffffff`  | Green — success states                         |
| `warning`   | `#f59e0b` | `#d97706` | `#fef3c7` | `#ffffff`  | Amber — warnings                               |
| `danger`    | `#ef4444` | `#dc2626` | `#fee2e2` | `#ffffff`  | Red — errors, destructive actions              |
| `page`      | `#e8eaf3` | —         | —         | —          | Page background (behind white cards)           |

### Legacy `brand` Token (backward compat only)

| Token           | Value     | Notes                   |
| --------------- | --------- | ----------------------- |
| `brand.DEFAULT` | `#5b6af8` | Same as `primary`       |
| `brand.hover`   | `#4a59f0` | Same as `primary.hover` |
| `brand.light`   | `#eef0ff` | Same as `primary.light` |
| `brand.dark`    | `#2e2e35` | Dark text colour        |
| `brand.darker`  | `#1e1e24` | Very dark text          |

> Prefer `primary` in all new code. `brand` exists only for older components.

---

## Using Color Tokens

Tailwind generates classes for all token keys and their sub-values.

```html
<!-- Background -->
<div class="bg-primary">...</div>
<div class="bg-primary-light">...</div>
<div class="bg-page">...</div>

<!-- Text -->
<span class="text-primary">...</span>
<span class="text-danger">...</span>

<!-- Border -->
<div class="border border-success">...</div>

<!-- With opacity modifier -->
<div class="bg-primary/10">...</div>
<!-- 10% opacity -->
<div class="bg-white/15">...</div>
<!-- white at 15% – used in sidebar -->

<!-- Hover -->
<button class="hover:bg-primary-hover">...</button>
<!-- or use the Tailwind hover modifier -->
<button class="hover:bg-[#4a59f0]">...</button>
```

---

## Page Layout Conventions

| Class                         | Used for                                    |
| ----------------------------- | ------------------------------------------- |
| `bg-page`                     | Full dashboard background                   |
| `bg-white`                    | Card / panel surfaces                       |
| `bg-primary`                  | Sidebar background                          |
| `rounded-xl` or `rounded-2xl` | Cards and panels                            |
| `border border-gray-200`      | Card borders                                |
| `p-8`                         | Standard page padding (inside module pages) |
| `h-screen overflow-hidden`    | Root dashboard container                    |

---

## Font

The app uses **Inter** (loaded via system font stack fallback).

```css
/* index.css */
html {
  font-family: "Inter", system-ui, sans-serif;
}
```

Tailwind `fontFamily.sans` is also set to `Inter`.

---

## Custom Utility — `scrollbar-thin`

Defined in `index.css` under `@layer utilities`.  
Used on the sidebar nav scroll area to show a thin, styled scrollbar.

```html
<nav class="overflow-y-auto scrollbar-thin">...</nav>
```

---

## AppLogo Component

**File:** `src/components/AppLogo.jsx`

Renders `/app-logo.png`. Not a colour or tailwind config item, but relevant to visual identity.

```jsx
// Size by height (keeps aspect ratio):
<AppLogo height="h-9" />

// Size by width (more precise):
<AppLogo width="w-[70%]" />

// Centered (mx-auto + block):
<AppLogo width="w-[70%]" centered />

// Additional className:
<AppLogo height="h-7" className="mx-auto" />
```

Props:

| Prop        | Default | Description                                              |
| ----------- | ------- | -------------------------------------------------------- |
| `height`    | `"h-8"` | Tailwind height class. Used when no `width` is provided. |
| `width`     | —       | Tailwind width class. Takes priority over `height`.      |
| `centered`  | `false` | Adds `mx-auto block` for centering.                      |
| `className` | `""`    | Extra Tailwind classes appended to the image.            |

---

## Tips for New Components

1. **Always use semantic tokens** (`primary`, `success`, `danger`) — not hardcoded hex values.
2. **Use `bg-page`** as the background for full-page layouts; `bg-white` for cards.
3. **For hover states**, use the corresponding `hover:bg-{token}-hover` or `hover:bg-{token}/10` for soft backgrounds.
4. **For icon buttons in the sidebar**, use `text-white/75 hover:text-white hover:bg-white/20`.
5. **For icon buttons in the TopBar**, use `text-gray-500 hover:text-gray-700 hover:bg-gray-100`.
