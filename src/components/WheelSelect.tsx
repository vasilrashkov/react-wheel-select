import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { createPortal } from 'react-dom'

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Represents a single option in the select dropdown
 */
export interface WheelSelectOption<T extends string = string> {
  /** Unique value for the option */
  value: T
  /** Display label for the option */
  label: string
  /** Optional disabled state */
  disabled?: boolean
  /** Optional custom data attached to the option */
  data?: Record<string, unknown>
}

/**
 * Theme configuration for the wheel select
 */
export interface WheelSelectTheme {
  /** Color scheme: 'dark' | 'light' | 'auto' */
  colorScheme?: 'dark' | 'light' | 'auto'
  /** Custom colors */
  colors?: {
    /** Text color */
    text?: string
    /** Text color when inactive/faded */
    textMuted?: string
    /** Background color for active item pill */
    activeBg?: string
    /** Background color for hover states */
    hoverBg?: string
    /** Backdrop overlay color */
    backdropBg?: string
    /** Focus ring color */
    focusRing?: string
  }
  /** Border radius for pill shapes */
  borderRadius?: number | string
  /** Font settings */
  font?: {
    /** Font family */
    family?: string
    /** Font size for options */
    size?: number | string
    /** Font weight for options */
    weight?: number | string
    /** Font size for trigger */
    triggerSize?: number | string
  }
  /** Animation settings */
  animation?: {
    /** Duration in ms */
    duration?: number
    /** Easing function */
    easing?: string
    /** Disable all animations */
    disabled?: boolean
  }
  /** Spacing settings */
  spacing?: {
    /** Gap between trigger text and icon */
    triggerGap?: number | string
    /** Padding for trigger button */
    triggerPadding?: string
    /** Gap between option text and icon */
    optionGap?: number | string
    /** Padding for options */
    optionPadding?: string
  }
}

/**
 * Sizing configuration for the wheel
 */
export interface WheelSelectSizing {
  /** Height of the wheel viewport */
  wheelHeight?: number | string
  /** Minimum width of the wheel */
  wheelMinWidth?: number | string
  /** Height of each option item */
  optionHeight?: number | string
  /** Icon size */
  iconSize?: number
}

/**
 * Behavior configuration
 */
export interface WheelSelectBehavior {
  /** Close on outside click (default: true) */
  closeOnOutsideClick?: boolean
  /** Close on Escape key (default: true) */
  closeOnEscape?: boolean
  /** Close on selection (default: true) */
  closeOnSelect?: boolean
  /** Scroll debounce delay in ms (default: 50) */
  scrollDebounceMs?: number
  /** Enable keyboard navigation (default: true) */
  keyboardNavigation?: boolean
  /** Portal target element (default: document.body) */
  portalTarget?: HTMLElement | null
  /** Focus trigger after close (default: true) */
  focusTriggerOnClose?: boolean
}

/**
 * Custom icon components
 */
export interface WheelSelectIcons {
  /** Custom chevron icon for closed state */
  chevron?: ReactNode
  /** Custom arrow icon for active item */
  arrow?: ReactNode
  /** Hide chevron icon */
  hideChevron?: boolean
  /** Hide arrow icon on active item */
  hideArrow?: boolean
}

/**
 * Accessibility configuration
 */
export interface WheelSelectA11y {
  /** Aria label for the trigger button */
  triggerLabel?: string
  /** Aria label for the picker dialog */
  pickerLabel?: string
  /** Custom aria-describedby id */
  describedBy?: string
}

/**
 * Event callbacks
 */
export interface WheelSelectCallbacks<T extends string = string> {
  /** Called when the picker opens */
  onOpen?: () => void
  /** Called when the picker closes */
  onClose?: () => void
  /** Called when value changes */
  onChange?: (value: T, option: WheelSelectOption<T>) => void
  /** Called when active (highlighted) item changes during scroll */
  onActiveChange?: (index: number, option: WheelSelectOption<T>) => void
  /** Called on keyboard navigation */
  onKeyDown?: (event: KeyboardEvent) => void
}

/**
 * Ref handle for imperative control
 */
export interface WheelSelectRef {
  /** Open the picker programmatically */
  open: () => void
  /** Close the picker programmatically */
  close: () => void
  /** Toggle the picker */
  toggle: () => void
  /** Focus the trigger */
  focus: () => void
  /** Get current open state */
  isOpen: () => boolean
  /** Scroll to a specific option by index */
  scrollToIndex: (index: number) => void
  /** Get the underlying native select element */
  getNativeSelect: () => HTMLSelectElement | null
}

/**
 * Main component props
 */
export interface WheelSelectProps<T extends string = string> {
  /** Array of options */
  options: WheelSelectOption<T>[]
  /** Currently selected value */
  value: T
  /** Change handler */
  onChange: (value: T) => void
  /** Placeholder text when no value selected */
  placeholder?: string
  /** Disabled state */
  disabled?: boolean
  /** Required field indicator */
  required?: boolean
  /** Name attribute for form submission */
  name?: string
  /** ID attribute */
  id?: string
  /** Additional CSS class */
  className?: string
  /** Inline styles */
  style?: CSSProperties
  /** Theme configuration */
  theme?: WheelSelectTheme
  /** Sizing configuration */
  sizing?: WheelSelectSizing
  /** Behavior configuration */
  behavior?: WheelSelectBehavior
  /** Custom icons */
  icons?: WheelSelectIcons
  /** Accessibility configuration */
  a11y?: WheelSelectA11y
  /** Event callbacks */
  callbacks?: WheelSelectCallbacks<T>
  /** Custom trigger renderer */
  renderTrigger?: (props: {
    value: T
    label: string
    isOpen: boolean
    disabled: boolean
    onClick: () => void
  }) => ReactNode
  /** Custom option renderer */
  renderOption?: (props: {
    option: WheelSelectOption<T>
    index: number
    isActive: boolean
    isSelected: boolean
  }) => ReactNode
  /** Z-index for the picker overlay */
  zIndex?: number
}

// ============================================================================
// Default Values
// ============================================================================

const defaultTheme: Required<WheelSelectTheme> = {
  colorScheme: 'dark',
  colors: {
    text: 'inherit',
    textMuted: 'inherit',
    activeBg: 'rgba(255, 255, 255, 0.12)',
    hoverBg: 'rgba(255, 255, 255, 0.12)',
    backdropBg: 'rgba(0, 0, 0, 0.5)',
    focusRing: 'rgba(255, 255, 255, 0.5)',
  },
  borderRadius: 12,
  font: {
    family: 'inherit',
    size: 28,
    weight: 500,
    triggerSize: 'inherit',
  },
  animation: {
    duration: 200,
    easing: 'ease',
    disabled: false,
  },
  spacing: {
    triggerGap: 16,
    triggerPadding: '8px 16px',
    optionGap: 16,
    optionPadding: '0 20px',
  },
}

const defaultSizing: Required<WheelSelectSizing> = {
  wheelHeight: 320,
  wheelMinWidth: 220,
  optionHeight: 56,
  iconSize: 20,
}

const defaultBehavior: Required<WheelSelectBehavior> = {
  closeOnOutsideClick: true,
  closeOnEscape: true,
  closeOnSelect: true,
  scrollDebounceMs: 50,
  keyboardNavigation: true,
  portalTarget: null,
  focusTriggerOnClose: true,
}

// ============================================================================
// Icon Components
// ============================================================================

interface IconProps {
  size?: number
  className?: string
}

const DefaultChevronIcon = ({ size = 20, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <polyline points="8 9 12 5 16 9" />
    <polyline points="8 15 12 19 16 15" />
  </svg>
)

const DefaultArrowIcon = ({ size = 20, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

// ============================================================================
// Utility Functions
// ============================================================================

const toCssValue = (value: number | string | undefined, defaultValue: string = '0'): string => {
  if (value === undefined) return defaultValue
  return typeof value === 'number' ? `${value}px` : value
}

const mergeDeep = <T extends Record<string, unknown>>(target: T, source: Partial<T>): T => {
  const result = { ...target }
  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        result[key] = mergeDeep(
          target[key] as Record<string, unknown>,
          source[key] as Record<string, unknown>
        ) as T[Extract<keyof T, string>]
      } else {
        result[key] = source[key] as T[Extract<keyof T, string>]
      }
    }
  }
  return result
}

// ============================================================================
// Main Component
// ============================================================================

function WheelSelectInner<T extends string = string>(
  props: WheelSelectProps<T>,
  ref: React.ForwardedRef<WheelSelectRef>
) {
  const {
    options,
    value,
    onChange,
    placeholder = 'Select...',
    disabled = false,
    required = false,
    name,
    id,
    className = '',
    style,
    theme: themeProp,
    sizing: sizingProp,
    behavior: behaviorProp,
    icons,
    a11y,
    callbacks,
    renderTrigger,
    renderOption,
    zIndex = 10001,
  } = props

  // Merge configurations with defaults
  const theme = useMemo(
    () => mergeDeep(defaultTheme, themeProp || {}),
    [themeProp]
  )
  const sizing = useMemo(
    () => mergeDeep(defaultSizing, sizingProp || {}),
    [sizingProp]
  )
  const behavior = useMemo(
    () => mergeDeep(defaultBehavior, behaviorProp || {}),
    [behaviorProp]
  )

  // State
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.findIndex(o => o.value === value))
  )
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)

  // Refs
  const triggerRef = useRef<HTMLButtonElement>(null)
  const selectRef = useRef<HTMLSelectElement>(null)
  const wheelRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const initialScrollIndexRef = useRef<number | null>(null)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isScrollingRef = useRef(false)

  // Computed values
  const selectedOption = useMemo(
    () => options.find(o => o.value === value),
    [options, value]
  )
  const displayLabel = selectedOption?.label ?? placeholder

  // Keep active index in sync when value changes externally
  useEffect(() => {
    const idx = options.findIndex(o => o.value === value)
    if (idx !== -1) {
      setActiveIndex(idx)
    }
  }, [value, options])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Calculate spacer height based on wheel and option heights
  const spacerHeight = useMemo(() => {
    const wheelH = typeof sizing.wheelHeight === 'number' ? sizing.wheelHeight : 320
    const optionH = typeof sizing.optionHeight === 'number' ? sizing.optionHeight : 56
    return (wheelH / 2) - (optionH / 2)
  }, [sizing.wheelHeight, sizing.optionHeight])

  // Open picker
  const openPicker = useCallback(() => {
    if (disabled) return
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect())
    }
    const idx = options.findIndex(o => o.value === value)
    const targetIndex = idx !== -1 ? idx : 0
    initialScrollIndexRef.current = targetIndex
    setActiveIndex(targetIndex)
    setIsOpen(true)
    callbacks?.onOpen?.()
  }, [disabled, options, value, callbacks])

  // Close picker
  const closePicker = useCallback(() => {
    setIsOpen(false)
    if (behavior.focusTriggerOnClose) {
      triggerRef.current?.focus()
    }
    callbacks?.onClose?.()
  }, [behavior.focusTriggerOnClose, callbacks])

  // Commit selection
  const commitSelection = useCallback((newValue: T) => {
    const option = options.find(o => o.value === newValue)
    if (!option || option.disabled) return

    onChange(newValue)
    callbacks?.onChange?.(newValue, option)

    if (selectRef.current) {
      selectRef.current.value = newValue
    }

    if (behavior.closeOnSelect) {
      setIsOpen(false)
      if (behavior.focusTriggerOnClose) {
        triggerRef.current?.focus()
      }
      callbacks?.onClose?.()
    }
  }, [onChange, options, behavior.closeOnSelect, behavior.focusTriggerOnClose, callbacks])

  // Scroll to selected item when picker opens
  useEffect(() => {
    if (isOpen && initialScrollIndexRef.current !== null) {
      const targetIndex = initialScrollIndexRef.current
      initialScrollIndexRef.current = null

      requestAnimationFrame(() => {
        const wheel = wheelRef.current
        const item = itemRefs.current[targetIndex]
        if (wheel && item) {
          const wheelHeight = wheel.clientHeight
          const itemHeight = item.clientHeight
          const itemTop = item.offsetTop
          const scrollTarget = itemTop - (wheelHeight / 2) + (itemHeight / 2)
          wheel.scrollTop = scrollTarget
        }
      })
    }
  }, [isOpen])

  // Focus wheel when picker opens
  useEffect(() => {
    if (isOpen && wheelRef.current) {
      wheelRef.current.focus()
    }
  }, [isOpen])

  // Calculate active index from scroll position
  const calculateActiveFromScroll = useCallback(() => {
    const wheel = wheelRef.current
    if (!wheel) return

    const wheelRect = wheel.getBoundingClientRect()
    const wheelCenter = wheelRect.top + wheelRect.height / 2

    let closestIndex = 0
    let closestDistance = Infinity

    itemRefs.current.forEach((item, index) => {
      if (!item) return
      const itemRect = item.getBoundingClientRect()
      const itemCenter = itemRect.top + itemRect.height / 2
      const distance = Math.abs(itemCenter - wheelCenter)

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    setActiveIndex(closestIndex)
    const option = options[closestIndex]
    if (option) {
      callbacks?.onActiveChange?.(closestIndex, option)
    }
  }, [options, callbacks])

  // Handle scroll with debounce
  const handleScroll = useCallback(() => {
    isScrollingRef.current = true

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false
      calculateActiveFromScroll()
    }, behavior.scrollDebounceMs)
  }, [calculateActiveFromScroll, behavior.scrollDebounceMs])

  // Keyboard navigation
  const handlePickerKeyDown = useCallback((e: KeyboardEvent) => {
    if (!behavior.keyboardNavigation) return

    callbacks?.onKeyDown?.(e)

    switch (e.key) {
      case 'Escape':
        if (behavior.closeOnEscape) {
          e.preventDefault()
          closePicker()
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => {
          let newIndex = prev - 1
          // Skip disabled options
          while (newIndex >= 0 && options[newIndex]?.disabled) {
            newIndex--
          }
          if (newIndex < 0) return prev
          const item = itemRefs.current[newIndex]
          item?.scrollIntoView({ block: 'center', behavior: 'smooth' })
          return newIndex
        })
        break
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => {
          let newIndex = prev + 1
          // Skip disabled options
          while (newIndex < options.length && options[newIndex]?.disabled) {
            newIndex++
          }
          if (newIndex >= options.length) return prev
          const item = itemRefs.current[newIndex]
          item?.scrollIntoView({ block: 'center', behavior: 'smooth' })
          return newIndex
        })
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        const option = options[activeIndex]
        if (option && !option.disabled) {
          commitSelection(option.value)
        }
        break
      case 'Home':
        e.preventDefault()
        const firstEnabled = options.findIndex(o => !o.disabled)
        if (firstEnabled !== -1) {
          setActiveIndex(firstEnabled)
          itemRefs.current[firstEnabled]?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        }
        break
      case 'End':
        e.preventDefault()
        const lastEnabled = options.findLastIndex(o => !o.disabled)
        if (lastEnabled !== -1) {
          setActiveIndex(lastEnabled)
          itemRefs.current[lastEnabled]?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        }
        break
    }
  }, [behavior.keyboardNavigation, behavior.closeOnEscape, options, activeIndex, closePicker, commitSelection, callbacks])

  // Handle item click
  const handleItemClick = useCallback((index: number) => (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = null
    }
    const option = options[index]
    if (option && !option.disabled) {
      commitSelection(option.value)
    }
  }, [options, commitSelection])

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: MouseEvent) => {
    if (behavior.closeOnOutsideClick && e.target === e.currentTarget) {
      closePicker()
    }
  }, [behavior.closeOnOutsideClick, closePicker])

  // Handle native select change
  const handleNativeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as T)
  }, [onChange])

  // Scroll to specific index
  const scrollToIndex = useCallback((index: number) => {
    const item = itemRefs.current[index]
    item?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [])

  // Imperative handle
  useImperativeHandle(ref, () => ({
    open: openPicker,
    close: closePicker,
    toggle: () => isOpen ? closePicker() : openPicker(),
    focus: () => triggerRef.current?.focus(),
    isOpen: () => isOpen,
    scrollToIndex,
    getNativeSelect: () => selectRef.current,
  }), [isOpen, openPicker, closePicker, scrollToIndex])

  // Generate CSS custom properties
  const cssVariables = useMemo((): CSSProperties => ({
    '--ws-color-text': theme.colors.text,
    '--ws-color-text-muted': theme.colors.textMuted,
    '--ws-color-active-bg': theme.colors.activeBg,
    '--ws-color-hover-bg': theme.colors.hoverBg,
    '--ws-color-backdrop-bg': theme.colors.backdropBg,
    '--ws-color-focus-ring': theme.colors.focusRing,
    '--ws-border-radius': toCssValue(theme.borderRadius),
    '--ws-font-family': theme.font.family,
    '--ws-font-size': toCssValue(theme.font.size),
    '--ws-font-weight': String(theme.font.weight),
    '--ws-font-size-trigger': toCssValue(theme.font.triggerSize),
    '--ws-animation-duration': theme.animation.disabled ? '0ms' : `${theme.animation.duration}ms`,
    '--ws-animation-easing': theme.animation.easing,
    '--ws-trigger-gap': toCssValue(theme.spacing.triggerGap),
    '--ws-trigger-padding': theme.spacing.triggerPadding,
    '--ws-option-gap': toCssValue(theme.spacing.optionGap),
    '--ws-option-padding': theme.spacing.optionPadding,
    '--ws-wheel-height': toCssValue(sizing.wheelHeight),
    '--ws-wheel-min-width': toCssValue(sizing.wheelMinWidth),
    '--ws-option-height': toCssValue(sizing.optionHeight),
    '--ws-icon-size': `${sizing.iconSize}px`,
    '--ws-spacer-height': `${spacerHeight}px`,
    '--ws-z-index': String(zIndex),
  } as CSSProperties), [theme, sizing, spacerHeight, zIndex])

  // Determine color scheme class
  const colorSchemeClass = theme.colorScheme === 'auto'
    ? ''
    : theme.colorScheme === 'light'
      ? 'ws-light'
      : 'ws-dark'

  // Render the picker portal
  const renderPicker = () => {
    if (!isOpen || !triggerRect) return null

    const portalTarget = behavior.portalTarget ?? document.body

    return createPortal(
      <div
        className="ws-backdrop"
        onClick={handleBackdropClick}
        role="presentation"
        style={cssVariables}
      >
        <div
          className="ws-picker"
          style={{
            left: triggerRect.left,
            top: triggerRect.top + triggerRect.height / 2,
          }}
          role="dialog"
          aria-modal="true"
          aria-label={a11y?.pickerLabel ?? 'Select an option'}
        >
          {/* Fixed center highlight - stays in place while scrolling */}
          <div className="ws-center-highlight" aria-hidden="true">
            {!icons?.hideArrow && (
              icons?.arrow ?? <DefaultArrowIcon size={sizing.iconSize} className="ws-arrow" />
            )}
          </div>

          <div
            ref={wheelRef}
            className="ws-wheel"
            role="listbox"
            tabIndex={0}
            onKeyDown={handlePickerKeyDown}
            onScroll={handleScroll}
            aria-activedescendant={`ws-option-${id ?? 'default'}-${activeIndex}`}
            aria-describedby={a11y?.describedBy}
          >
            <div className="ws-spacer" aria-hidden="true" />

            {options.map((option, index) => {
              const isActive = index === activeIndex
              const isSelected = option.value === value

              if (renderOption) {
                return (
                  <div
                    key={option.value}
                    ref={el => { itemRefs.current[index] = el }}
                    id={`ws-option-${id ?? 'default'}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                    className={`ws-option ${isActive ? 'ws-active' : ''} ${option.disabled ? 'ws-disabled' : ''}`}
                    onClick={handleItemClick(index)}
                  >
                    {renderOption({ option, index, isActive, isSelected })}
                  </div>
                )
              }

              return (
                <div
                  key={option.value}
                  ref={el => { itemRefs.current[index] = el }}
                  id={`ws-option-${id ?? 'default'}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  className={`ws-option ${isActive ? 'ws-active' : ''} ${option.disabled ? 'ws-disabled' : ''}`}
                  onClick={handleItemClick(index)}
                >
                  <span className="ws-option-text">{option.label}</span>
                </div>
              )
            })}

            <div className="ws-spacer" aria-hidden="true" />
          </div>
        </div>
      </div>,
      portalTarget
    )
  }

  return (
    <span
      className={`ws-root ${colorSchemeClass} ${className}`}
      style={{ ...cssVariables, ...style }}
    >
      {/* Hidden native select for form submission */}
      <select
        ref={selectRef}
        name={name}
        id={id ? `${id}-native` : undefined}
        value={value}
        onChange={handleNativeChange}
        className="ws-native-select"
        tabIndex={-1}
        aria-hidden="true"
        required={required}
        disabled={disabled}
      >
        {!selectedOption && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {/* Trigger button */}
      {renderTrigger ? (
        renderTrigger({
          value,
          label: displayLabel,
          isOpen,
          disabled,
          onClick: openPicker,
        })
      ) : (
        <button
          ref={triggerRef}
          type="button"
          id={id}
          className={`ws-trigger ${isOpen ? 'ws-open' : ''}`}
          onClick={openPicker}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={a11y?.triggerLabel}
          aria-describedby={a11y?.describedBy}
          style={{ visibility: isOpen ? 'hidden' : 'visible' }}
        >
          <span className="ws-trigger-text">{displayLabel}</span>
          {!icons?.hideChevron && (
            icons?.chevron ?? <DefaultChevronIcon size={sizing.iconSize} className="ws-chevron" />
          )}
        </button>
      )}

      {/* Picker portal */}
      {renderPicker()}
    </span>
  )
}

// Forward ref with generic support
export const WheelSelect = forwardRef(WheelSelectInner) as <T extends string = string>(
  props: WheelSelectProps<T> & { ref?: React.ForwardedRef<WheelSelectRef> }
) => ReturnType<typeof WheelSelectInner>

export default WheelSelect
