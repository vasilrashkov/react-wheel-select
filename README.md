# react-wheel-select

<div align="center">

![npm version](https://img.shields.io/npm/v/react-wheel-select)
![bundle size](https://img.shields.io/bundlephobia/minzip/react-wheel-select)
![license](https://img.shields.io/npm/l/react-wheel-select)
![typescript](https://img.shields.io/badge/TypeScript-Ready-blue)

**A beautiful, accessible iOS-style wheel picker component for React**

[Demo](https://wheel-select.dev) · [Documentation](#documentation) · [Examples](#examples) · [Contributing](#contributing)

</div>

---

## ✨ Features

- 🎡 **Smooth Wheel Scrolling** — CSS scroll-snap powered picker with momentum scrolling
- ♿ **Fully Accessible** — ARIA compliant with full keyboard navigation
- 🎨 **Highly Customizable** — 30+ CSS variables for complete visual control
- 📱 **Touch Optimized** — Works beautifully on mobile devices
- 🔧 **TypeScript First** — Complete type definitions with generics support
- 🪶 **Lightweight** — ~4KB minified + gzipped, zero dependencies
- 🌙 **Theme Support** — Built-in dark/light modes with auto-detection
- 🎯 **Render Props** — Custom trigger and option rendering
- 📋 **Form Compatible** — Hidden native select for form submission
- 🔄 **Controlled & Uncontrolled** — Works both ways with ref API

---

## 📦 Installation

```bash
# npm
npm install react-wheel-select

# yarn
yarn add react-wheel-select

# pnpm
pnpm add react-wheel-select

# bun
bun add react-wheel-select
```

---

## 🚀 Quick Start

```tsx
import { useState } from 'react'
import { WheelSelect } from 'react-wheel-select'
import 'react-wheel-select/styles.css'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
]

function App() {
  const [fruit, setFruit] = useState('apple')

  return (
    <p>
      I love to eat{' '}
      <WheelSelect
        options={fruits}
        value={fruit}
        onChange={setFruit}
      />
    </p>
  )
}
```

---

## 📖 Documentation

### Table of Contents

- [Props Reference](#props-reference)
- [Theme Configuration](#theme-configuration)
- [Sizing Configuration](#sizing-configuration)
- [Behavior Configuration](#behavior-configuration)
- [Custom Icons](#custom-icons)
- [Accessibility](#accessibility)
- [Event Callbacks](#event-callbacks)
- [Imperative API](#imperative-api)
- [CSS Customization](#css-customization)
- [TypeScript](#typescript)

---

### Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `WheelSelectOption[]` | **required** | Array of options to display |
| `value` | `string` | **required** | Currently selected value |
| `onChange` | `(value: string) => void` | **required** | Called when selection changes |
| `placeholder` | `string` | `'Select...'` | Placeholder when no value |
| `disabled` | `boolean` | `false` | Disable the component |
| `required` | `boolean` | `false` | Mark as required for forms |
| `name` | `string` | — | Form field name |
| `id` | `string` | — | Element ID |
| `className` | `string` | — | Additional CSS class |
| `style` | `CSSProperties` | — | Inline styles |
| `theme` | `WheelSelectTheme` | — | Theme configuration |
| `sizing` | `WheelSelectSizing` | — | Sizing configuration |
| `behavior` | `WheelSelectBehavior` | — | Behavior configuration |
| `icons` | `WheelSelectIcons` | — | Custom icons |
| `a11y` | `WheelSelectA11y` | — | Accessibility options |
| `callbacks` | `WheelSelectCallbacks` | — | Event callbacks |
| `renderTrigger` | `Function` | — | Custom trigger renderer |
| `renderOption` | `Function` | — | Custom option renderer |
| `zIndex` | `number` | `10001` | Overlay z-index |

#### Option Shape

```typescript
interface WheelSelectOption<T extends string = string> {
  value: T        // Unique identifier
  label: string   // Display text
  disabled?: boolean  // Disable this option
  data?: Record<string, unknown>  // Custom data
}
```

---

### Theme Configuration

Customize colors, typography, animations, and spacing:

```tsx
<WheelSelect
  theme={{
    // Color scheme
    colorScheme: 'dark', // 'dark' | 'light' | 'auto'

    // Custom colors
    colors: {
      text: '#ffffff',
      textMuted: '#888888',
      activeBg: 'rgba(255, 255, 255, 0.15)',
      hoverBg: 'rgba(255, 255, 255, 0.1)',
      backdropBg: 'rgba(0, 0, 0, 0.6)',
      focusRing: 'rgba(59, 130, 246, 0.5)',
    },

    // Border radius
    borderRadius: 16,

    // Typography
    font: {
      family: 'Inter, sans-serif',
      size: 24,
      weight: 600,
      triggerSize: 18,
    },

    // Animations
    animation: {
      duration: 250,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      disabled: false, // Set true to disable all animations
    },

    // Spacing
    spacing: {
      triggerGap: 12,
      triggerPadding: '10px 20px',
      optionGap: 12,
      optionPadding: '0 24px',
    },
  }}
/>
```

---

### Sizing Configuration

Control dimensions of the wheel and options:

```tsx
<WheelSelect
  sizing={{
    wheelHeight: 400,      // Height of the scroll container
    wheelMinWidth: 280,    // Minimum width
    optionHeight: 64,      // Height of each option
    iconSize: 24,          // Size of icons
  }}
/>
```

---

### Behavior Configuration

Fine-tune interaction behavior:

```tsx
<WheelSelect
  behavior={{
    closeOnOutsideClick: true,   // Close when clicking backdrop
    closeOnEscape: true,         // Close on Escape key
    closeOnSelect: true,         // Close after selection
    scrollDebounceMs: 50,        // Scroll detection delay
    keyboardNavigation: true,    // Enable keyboard nav
    focusTriggerOnClose: true,   // Return focus after close
    portalTarget: document.body, // Portal mount point
  }}
/>
```

---

### Custom Icons

Replace default icons with your own:

```tsx
import { ChevronDown, ArrowLeft } from 'lucide-react'

<WheelSelect
  icons={{
    chevron: <ChevronDown size={20} />,
    arrow: <ArrowLeft size={20} />,
    hideChevron: false,  // Hide chevron icon
    hideArrow: false,    // Hide arrow on active item
  }}
/>
```

---

### Accessibility

Full ARIA support with customizable labels:

```tsx
<WheelSelect
  a11y={{
    triggerLabel: 'Select a fruit',
    pickerLabel: 'Fruit options',
    describedBy: 'fruit-helper-text',
  }}
/>
```

**Keyboard Support:**

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Open picker / Select option |
| `Escape` | Close picker |
| `↑` / `↓` | Navigate options |
| `Home` | Jump to first option |
| `End` | Jump to last option |

---

### Event Callbacks

Subscribe to component events:

```tsx
<WheelSelect
  callbacks={{
    onOpen: () => console.log('Picker opened'),
    onClose: () => console.log('Picker closed'),
    onChange: (value, option) => {
      console.log('Selected:', value, option)
    },
    onActiveChange: (index, option) => {
      console.log('Highlighted:', index, option)
    },
    onKeyDown: (event) => {
      console.log('Key pressed:', event.key)
    },
  }}
/>
```

---

### Imperative API

Control the component programmatically using refs:

```tsx
import { useRef } from 'react'
import { WheelSelect, WheelSelectRef } from 'react-wheel-select'

function App() {
  const selectRef = useRef<WheelSelectRef>(null)

  return (
    <>
      <WheelSelect ref={selectRef} {...props} />

      <button onClick={() => selectRef.current?.open()}>
        Open Picker
      </button>

      <button onClick={() => selectRef.current?.close()}>
        Close Picker
      </button>

      <button onClick={() => selectRef.current?.scrollToIndex(5)}>
        Scroll to Item 5
      </button>
    </>
  )
}
```

**Ref Methods:**

| Method | Description |
|--------|-------------|
| `open()` | Open the picker |
| `close()` | Close the picker |
| `toggle()` | Toggle open state |
| `focus()` | Focus the trigger |
| `isOpen()` | Get current open state |
| `scrollToIndex(n)` | Scroll to specific index |
| `getNativeSelect()` | Get native select element |

---

### CSS Customization

#### Using CSS Variables

Override any variable at the root or component level:

```css
/* Global overrides */
:root {
  --ws-color-active-bg: rgba(59, 130, 246, 0.2);
  --ws-border-radius: 8px;
  --ws-font-size: 20px;
}

/* Scoped overrides */
.my-custom-select {
  --ws-color-text: #1a1a1a;
  --ws-animation-duration: 300ms;
}
```

#### Available CSS Variables

```css
/* Colors */
--ws-color-text              /* Text color */
--ws-color-text-muted        /* Muted text color */
--ws-color-active-bg         /* Active item background */
--ws-color-hover-bg          /* Hover state background */
--ws-color-backdrop-bg       /* Backdrop overlay color */
--ws-color-focus-ring        /* Focus ring color */

/* Typography */
--ws-font-family             /* Font family */
--ws-font-size               /* Option font size */
--ws-font-weight             /* Option font weight */
--ws-font-size-trigger       /* Trigger font size */

/* Spacing */
--ws-border-radius           /* Border radius */
--ws-trigger-gap             /* Gap in trigger */
--ws-trigger-padding         /* Trigger padding */
--ws-option-gap              /* Gap in options */
--ws-option-padding          /* Option padding */

/* Sizing */
--ws-wheel-height            /* Wheel viewport height */
--ws-wheel-min-width         /* Minimum wheel width */
--ws-option-height           /* Option item height */
--ws-icon-size               /* Icon dimensions */
--ws-spacer-height           /* Top/bottom spacer */

/* Animation */
--ws-animation-duration      /* Transition duration */
--ws-animation-easing        /* Easing function */

/* Internal */
--ws-inactive-opacity        /* Inactive items opacity */
--ws-hover-opacity           /* Hover state opacity */
--ws-backdrop-blur           /* Backdrop blur amount */
--ws-z-index                 /* Overlay z-index */
```

#### Custom Class Names

Target specific elements:

```css
.ws-root { }           /* Root container */
.ws-trigger { }        /* Trigger button */
.ws-trigger.ws-open { } /* Trigger when open */
.ws-trigger-text { }   /* Trigger text */
.ws-chevron { }        /* Chevron icon */
.ws-backdrop { }       /* Fullscreen backdrop */
.ws-picker { }         /* Picker container */
.ws-wheel { }          /* Scrollable wheel */
.ws-spacer { }         /* Top/bottom spacers */
.ws-option { }         /* Option item */
.ws-option.ws-active { } /* Active/centered option */
.ws-option.ws-disabled { } /* Disabled option */
.ws-option-text { }    /* Option label text */
.ws-arrow { }          /* Active item arrow */
```

---

### TypeScript

Full generic support for type-safe values:

```tsx
// Define your value type
type Fruit = 'apple' | 'banana' | 'cherry'

// Options with typed values
const options: WheelSelectOption<Fruit>[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

// Component with type inference
function App() {
  const [fruit, setFruit] = useState<Fruit>('apple')

  return (
    <WheelSelect<Fruit>
      options={options}
      value={fruit}
      onChange={setFruit} // Type-safe!
    />
  )
}
```

---

## 🎨 Examples

### Inline Text Integration

```tsx
<p className="sentence">
  I want to{' '}
  <WheelSelect
    options={actions}
    value={action}
    onChange={setAction}
    theme={{ font: { triggerSize: 'inherit' } }}
  />
  {' '}with my team.
</p>
```

### Custom Styled Trigger

```tsx
<WheelSelect
  renderTrigger={({ label, isOpen, onClick }) => (
    <button
      onClick={onClick}
      className={`custom-trigger ${isOpen ? 'active' : ''}`}
    >
      {label}
      <ChevronIcon />
    </button>
  )}
/>
```

### Custom Option Rendering

```tsx
<WheelSelect
  renderOption={({ option, isActive, isSelected }) => (
    <div className="custom-option">
      <img src={option.data?.icon} alt="" />
      <span>{option.label}</span>
      {isSelected && <CheckIcon />}
    </div>
  )}
/>
```

### With Form Integration

```tsx
<form onSubmit={handleSubmit}>
  <WheelSelect
    name="country"
    required
    options={countries}
    value={country}
    onChange={setCountry}
  />
  <button type="submit">Submit</button>
</form>
```

### Disabled Options

```tsx
const options = [
  { value: 'free', label: 'Free Plan' },
  { value: 'pro', label: 'Pro Plan' },
  { value: 'enterprise', label: 'Enterprise', disabled: true },
]
```

---

## 🌐 Browser Support

- Chrome 88+
- Firefox 84+
- Safari 14+
- Edge 88+

Requires CSS `scroll-snap-type` and `backdrop-filter` support.

---

## 📄 License

MIT © [Vasil Rashkov](https://github.com/vasilrashkov)

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 💖 Support

If you find this project useful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 📖 Improving documentation

---

<div align="center">

Made with ❤️ for the React community

</div>
