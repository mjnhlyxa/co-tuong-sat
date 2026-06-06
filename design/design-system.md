# co-tuong-sat — Design System

> Vietnamese lacquerware-inspired aesthetic. Dark wood textures, gold accents, traditional dignity.

## Colors

### Primary Palette

| Name | Hex | Usage |
|------|-----|-------|
| Background (Dark Wood) | `#1A1210` | Page background |
| Surface (Wood Panel) | `#2C1810` | Cards, panels, board base |
| Board (Light Wood) | `#8B5A2B` | Board surface |
| Board Lines | `#5C3D1E` | Grid lines on board |
| Gold Accent | `#D4AF37` | Primary buttons, highlights, borders |
| Gold Hover | `#E5C145` | Button hover states |
| Red (Đỏ) | `#C41E3A` | Red pieces, red team |
| Red Dark | `#8B1528` | Red piece shadows |
| Black (Đen) | `#1A1A1A` | Black pieces |
| Black Light | `#3A3A3A` | Black piece border |

### River & Special

| Name | Hex | Usage |
|------|-----|-------|
| River Blue | `#4A90D9` | River line background |
| River Blue Light | `#6BB3F0` | River highlight |
| Palace Corner | `#6B4423` | Palace diagonal markers |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success | `#4CAF50` | Valid moves, win state |
| Warning | `#FFC107` | Check state, caution |
| Error | `#F44336` | Invalid move, error toast |
| Info | `#2196F3` | Information, links |

### Text

| Name | Hex | Usage |
|------|-----|-------|
| Text Primary | `#F5E6D3` | Main text (warm off-white) |
| Text Secondary | `#A89080` | Subtitles, hints |
| Text Muted | `#6B5D50` | Disabled, placeholder |
| Text On Gold | `#1A1210` | Text on gold buttons |

---

## Typography

### Font Families

```css
/* Headings - Vietnamese lacquerware feel */
font-family: 'Playfair Display', 'Noto Serif', Georgia, serif;

/* Body / UI - Clean and readable */
font-family: 'Inter', 'Noto Sans', system-ui, sans-serif;

/* Move notation, coordinates - Monospace */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Name | Size | Weight | Usage |
|------|------|--------|-------|
| xs | 12px | 400 | Labels, captions |
| sm | 14px | 400 | Secondary text |
| base | 16px | 400 | Body text |
| lg | 18px | 500 | Subheadings |
| xl | 24px | 600 | Section titles |
| 2xl | 32px | 700 | Page titles |
| 3xl | 48px | 700 | Hero text, winner announcement |

### Line Heights
- Headings: 1.2
- Body: 1.5
- Tight: 1.1

---

## Spacing

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| 1 | 4px | Tight spacing, icon gap |
| 2 | 8px | Component internal spacing |
| 3 | 12px | Related element spacing |
| 4 | 16px | Standard spacing |
| 5 | 20px | Section spacing |
| 6 | 24px | Major section spacing |
| 8 | 32px | Layout gaps |
| 10 | 40px | Large gaps |
| 12 | 48px | Page section spacing |
| 16 | 64px | Major page divisions |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| none | 0px | Board lines, sharp edges |
| sm | 4px | Badges, small chips |
| md | 8px | Cards, inputs, buttons |
| lg | 12px | Modals, large containers |
| xl | 16px | Large panels |
| full | 9999px | Avatars, circular buttons |

---

## Shadows

```css
/* Card shadow - subtle depth */
--shadow-card: 0 2px 8px rgba(0, 0, 0, 0.4);

/* Modal shadow - lifted above content */
--shadow-modal: 0 8px 32px rgba(0, 0, 0, 0.6);

/* Button shadow - tactile feel */
--shadow-button: 0 2px 4px rgba(0, 0, 0, 0.3);

/* Glow for selected/valid states */
--shadow-glow-gold: 0 0 12px rgba(212, 175, 55, 0.5);
--shadow-glow-green: 0 0 8px rgba(76, 175, 80, 0.5);
```

---

## Breakpoints

| Name | Min Width | Usage |
|------|-----------|-------|
| mobile | 0px | 320px - 639px |
| tablet | 640px | 640px - 1023px |
| desktop | 1024px | 1024px+ |

---

## Motion & Animation

### Durations

| Token | Value | Usage |
|-------|-------|-------|
| fast | 150ms | Hover, micro-interactions |
| normal | 300ms | Standard transitions |
| slow | 500ms | Modal, major state changes |

### Easing

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);      /* Smooth deceleration */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);  /* Balanced */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1); /* Playful */
```

### Key Animations

```css
/* Piece movement - slide */
@keyframes piece-move {
  from { transform: translate(var(--dx), var(--dy)); }
  to { transform: translate(0, 0); }
}

/* Valid move indicator - pulse */
@keyframes valid-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

/* Check warning - glow pulse */
@keyframes check-pulse {
  0%, 100% { box-shadow: 0 0 8px rgba(244, 67, 54, 0.5); }
  50% { box-shadow: 0 0 16px rgba(244, 67, 54, 0.8); }
}

/* Win celebration - confetti particles */
@keyframes confetti-fall {
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

/* Sâm sacrifice - golden glow */
@keyframes sam-glow {
  0%, 100% { box-shadow: 0 0 10px #D4AF37; }
  50% { box-shadow: 0 0 30px #FFD700, 0 0 60px #D4AF37; }
}
```

---

## Visual Assets

### Piece Design
- Circular shape with gradient fill
- Red pieces: gradient from `#C41E3A` to `#8B1528`, gold border
- Black pieces: gradient from `#1A1A1A` to `#3A3A3A`, silver border
- Vietnamese label centered: CT, S, X, M, P, T
- Size: 40px diameter desktop, 32px mobile

### Board Design
- Wood texture background (`#8B5A2B`)
- Dark grid lines (`#5C3D1E`)
- River: horizontal band with subtle blue tint
- Palace: diagonal corner lines in palace squares
- Coordinate labels: a-i (files), 1-10 (ranks)

### Icons
- Use Lucide icons (open source, consistent style)
- Size: 20px default, 24px for emphasis

---

## Component Patterns

### Card
```css
background: var(--surface);
border: 1px solid rgba(212, 175, 55, 0.2);
border-radius: var(--radius-md);
box-shadow: var(--shadow-card);
```

### Button Primary
```css
background: var(--gold);
color: var(--text-on-gold);
border-radius: var(--radius-md);
font-weight: 600;
transition: all var(--duration-fast) var(--ease-out);

&:hover {
  background: var(--gold-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-button);
}
```

### Input
```css
background: rgba(0, 0, 0, 0.3);
border: 1px solid var(--board-lines);
border-radius: var(--radius-md);
color: var(--text-primary);
padding: var(--space-2) var(--space-3);

&:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
}
```

### Modal
```css
backdrop-filter: blur(4px);
background: rgba(0, 0, 0, 0.7);

.modal-content {
  background: var(--surface);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-modal);
}
```

---

## Responsive Behavior

### Mobile (< 640px)
- Single column layout
- Board scales to full width (min 320px)
- Player panels stack horizontally above/below board
- Move history as collapsible bottom drawer
- Touch targets minimum 44x44px
- Font sizes reduce by ~10%

### Tablet (640-1023px)
- Two column layout where space allows
- Board remains prominent
- Side panels visible

### Desktop (> 1024px)
- Full layout with side panels
- Board centered with adequate margins
- Move history in dedicated panel
- Maximum content width: 1200px