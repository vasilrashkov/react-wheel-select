import {
  useState,
  useRef,
  useEffect,
  useCallback,  
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { createPortal } from 'react-dom'
import './BaseSelectCompat.css'

export interface SelectOption {
  value: string
  label: string
}

export interface BaseSelectCompatProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  name?: string
  id?: string
  className?: string
}

// Chevron up/down icon for closed state (diamond/double chevron style)
const ChevronIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="base-select-chevron"
  >
    <polyline points="8 9 12 5 16 9" />
    <polyline points="8 15 12 19 16 15" />
  </svg>
)

// Left arrow icon for active item in open state
const ArrowLeftIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="base-select-arrow"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

/**
 * BaseSelectCompat - A progressively enhanced select component
 *
 * Uses native stylable select (appearance: base-select) when supported,
 * falls back to a custom inline wheel picker for older browsers.
 */
export function BaseSelectCompat({
  options,
  value,
  onChange,
  name,
  id,
  className = '',
}: BaseSelectCompatProps) {
  // Always use fallback mode for consistent custom styling across browsers
  // The native base-select doesn't match our design requirements
  const useNative = false
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.findIndex(o => o.value === value))
  )

  const triggerRef = useRef<HTMLButtonElement>(null)
  const selectRef = useRef<HTMLSelectElement>(null)
  const wheelRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])


  // Track trigger position for inline picker placement
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)

  // Keep active index in sync when value changes externally
  useEffect(() => {
    const idx = options.findIndex(o => o.value === value)
    if (idx !== -1) {
      setActiveIndex(idx)
    }
  }, [value, options])

  // Get the current selected label
  const selectedOption = options.find(o => o.value === value)
  const displayLabel = selectedOption?.label ?? options[0]?.label ?? ''

  // Track the initial index to scroll to when opening
  const initialScrollIndexRef = useRef<number | null>(null)

  // Handle opening the picker
  const openPicker = useCallback(() => {
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect())
    }
    // Calculate and store the index to scroll to
    const idx = options.findIndex(o => o.value === value)
    const targetIndex = idx !== -1 ? idx : 0
    initialScrollIndexRef.current = targetIndex
    setActiveIndex(targetIndex)
    setIsOpen(true)
  }, [options, value])

  // Handle closing without selection
  const closePicker = useCallback(() => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [])

  // Handle selection commit
  const commitSelection = useCallback((newValue: string) => {
    onChange(newValue)
    // Sync with native select
    if (selectRef.current) {
      selectRef.current.value = newValue
    }
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [onChange])

  // Scroll to the selected item when picker opens (only once)
  useEffect(() => {
    if (isOpen && initialScrollIndexRef.current !== null) {
      const targetIndex = initialScrollIndexRef.current
      // Clear the ref so we don't scroll again
      initialScrollIndexRef.current = null

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        const wheel = wheelRef.current
        const item = itemRefs.current[targetIndex]
        if (wheel && item) {
          // Center the item in the wheel (instant scroll, no smooth)
          const wheelHeight = wheel.clientHeight
          const itemHeight = item.clientHeight
          const itemTop = item.offsetTop
          const scrollTarget = itemTop - (wheelHeight / 2) + (itemHeight / 2)
          wheel.scrollTop = scrollTarget
        }
      })
    }
  }, [isOpen])

  /**
   * Calculate which item is closest to the center of the scroll container.
   *
   * Math explanation:
   * 1. Find the vertical center of the scroll container viewport
   * 2. For each item, calculate its center position relative to scroll
   * 3. Find the item whose center is closest to the viewport center
   */
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
  }, [])

  // Track scroll state to avoid interference with clicks
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /**
   * Handle scroll events - only update visual highlight, don't auto-commit.
   * User must click an item or press Enter to commit selection.
   * Uses a timeout to detect scroll end and avoid interfering with clicks.
   */
  const handleScroll = useCallback(() => {
    isScrollingRef.current = true

    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Update active index after a short delay (scroll end detection)
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false
      calculateActiveFromScroll()
    }, 50)
  }, [calculateActiveFromScroll])


  // Handle keyboard navigation in picker
  const handlePickerKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        closePicker()
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => {
          const newIndex = Math.max(0, prev - 1)
          // Scroll the new active item into view
          const item = itemRefs.current[newIndex]
          item?.scrollIntoView({ block: 'center', behavior: 'smooth' })
          return newIndex
        })
        break
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => {
          const newIndex = Math.min(options.length - 1, prev + 1)
          const item = itemRefs.current[newIndex]
          item?.scrollIntoView({ block: 'center', behavior: 'smooth' })
          return newIndex
        })
        break
      case 'Enter':
        e.preventDefault()
        if (options[activeIndex]) {
          commitSelection(options[activeIndex].value)
        }
        break
    }
  }, [activeIndex, options, closePicker, commitSelection])

  // Handle clicking on an item
  const handleItemSelect = useCallback((index: number) => {
    if (options[index]) {
      commitSelection(options[index].value)
    }
  }, [options, commitSelection])

  // Use onClick for click detection - more reliable than pointer events
  const handleItemClick = useCallback((index: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Clear any pending scroll timeout to prevent interference
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = null
    }
    handleItemSelect(index)
  }, [handleItemSelect])

  // Fallback: handle click on wheel using event delegation
  const handleWheelClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    const optionEl = target.closest('.base-select-option') as HTMLElement
    if (optionEl) {
      const optionId = optionEl.id // e.g., "option-3"
      const index = parseInt(optionId.replace('option-', ''), 10)
      if (!isNaN(index) && options[index]) {
        handleItemSelect(index)
      }
    }
  }, [options, handleItemSelect])

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePicker()
    }
  }, [closePicker])

  // Focus trap - focus the wheel when picker opens
  useEffect(() => {
    if (isOpen && wheelRef.current) {
      wheelRef.current.focus()
    }
  }, [isOpen])

  // Cleanup scroll timeout on unmount or when picker closes
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Handle native select change (for native mode)
  const handleNativeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }, [onChange])

  // Render the fallback inline wheel picker
  const renderFallbackPicker = () => {
    if (!isOpen || !triggerRect) return null

    return createPortal(
      <div
        className="base-select-backdrop"
        onClick={handleBackdropClick}
        role="presentation"
      >
        <div
          className="base-select-picker"
          style={{
            // Position the picker so the active item aligns with the trigger
            left: triggerRect.left,
            top: triggerRect.top + triggerRect.height / 2,
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Select an option"
        >
          <div
            ref={wheelRef}
            className="base-select-wheel"
            role="listbox"
            tabIndex={0}
            onKeyDown={handlePickerKeyDown}
            onScroll={handleScroll}
            onClick={handleWheelClick}
            aria-activedescendant={`option-${activeIndex}`}
          >
            {/* Spacer to allow first item to be centered */}
            <div className="base-select-spacer" aria-hidden="true" />

            {options.map((option, index) => (
              <div
                key={option.value}
                ref={el => { itemRefs.current[index] = el }}
                id={`option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className={`base-select-option ${index === activeIndex ? 'active' : ''}`}
                onClick={handleItemClick(index)}
              >
                <span className="base-select-option-text">{option.label}</span>
                {index === activeIndex && <ArrowLeftIcon />}
              </div>
            ))}

            {/* Spacer to allow last item to be centered */}
            <div className="base-select-spacer" aria-hidden="true" />
          </div>
        </div>
      </div>,
      document.body
    )
  }

  // Native mode with appearance: base-select
  if (useNative) {
    return (
      <span className={`base-select-compat native ${className}`}>
        <select
          ref={selectRef}
          name={name}
          id={id}
          value={value}
          onChange={handleNativeChange}
          className="base-select-native"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </span>
    )
  }

  // Fallback mode with custom inline wheel picker
  return (
    <span className={`base-select-compat fallback ${className}`}>
      {/* Hidden native select for form submission and semantics */}
      <select
        ref={selectRef}
        name={name}
        id={id}
        value={value}
        onChange={handleNativeChange}
        className="base-select-hidden"
        tabIndex={-1}
        aria-hidden="true"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Text trigger with pill background on hover - hidden when picker is open */}
      <button
        ref={triggerRef}
        type="button"
        className={`base-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={openPicker}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{ visibility: isOpen ? 'hidden' : 'visible' }}
      >
        <span className="base-select-trigger-text">{displayLabel}</span>
        <ChevronIcon />
      </button>

      {/* Fallback inline picker */}
      {renderFallbackPicker()}
    </span>
  )
}

export default BaseSelectCompat
