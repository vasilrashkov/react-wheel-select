/**
 * @wheel-select/react - iOS-style Wheel Picker for React
 *
 * A beautiful, accessible, and fully customizable wheel select component
 * inspired by iOS picker wheels.
 *
 * @example
 * ```tsx
 * import { WheelSelect } from '@wheel-select/react'
 * import '@wheel-select/react/styles.css'
 *
 * const options = [
 *   { value: 'apple', label: 'Apple' },
 *   { value: 'banana', label: 'Banana' },
 * ]
 *
 * function App() {
 *   const [value, setValue] = useState('apple')
 *   return <WheelSelect options={options} value={value} onChange={setValue} />
 * }
 * ```
 */

// Main component export
export { WheelSelect, default } from './WheelSelect'

// Legacy component (deprecated - use WheelSelect instead)
export { BaseSelectCompat } from './BaseSelectCompat'

// Type exports
export type {
  WheelSelectProps,
  WheelSelectOption,
  WheelSelectRef,
  WheelSelectTheme,
  WheelSelectSizing,
  WheelSelectBehavior,
  WheelSelectIcons,
  WheelSelectA11y,
  WheelSelectCallbacks,
} from './WheelSelect'

// Legacy types (deprecated)
export type { BaseSelectCompatProps, SelectOption } from './BaseSelectCompat'
