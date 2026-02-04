import { useState, useRef } from 'react'
import { WheelSelect, type WheelSelectRef } from './components'
import './components/WheelSelect.css'

// Example option sets
const actionOptions = [
  { value: 'cook', label: 'cook' },
  { value: 'ship', label: 'ship' },
  { value: 'prompt', label: 'prompt' },
  { value: 'collaborate', label: 'collaborate' },
  { value: 'create', label: 'create' },
  { value: 'design', label: 'design' },
  { value: 'build', label: 'build' },
]

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'strawberry', label: 'Strawberry' },
]

const planOptions = [
  { value: 'free', label: 'Free' },
  { value: 'starter', label: 'Starter' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise', disabled: true },
]

const timeOptions = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
]

const colorOptions = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'purple', label: 'Purple' },
  { value: 'orange', label: 'Orange' },
  { value: 'pink', label: 'Pink' },
]

function App() {
  const [action, setAction] = useState('create')
  const [fruit, setFruit] = useState('mango')
  const [plan, setPlan] = useState('pro')
  const [time, setTime] = useState('30')
  const [color, setColor] = useState('blue')
  const [controlled, setControlled] = useState('apple')
  const controlledRef = useRef<WheelSelectRef>(null)

  return (
    <div className="app">
      <div className="demo-container">
        <header className="demo-header">
          <h1>react-wheel-select</h1>
          <p className="subtitle">A beautiful, accessible iOS-style wheel picker for React</p>
          <div className="badges">
            <a href="https://www.npmjs.com/package/react-wheel-select" target="_blank" rel="noopener noreferrer">
              <img src="https://img.shields.io/npm/v/react-wheel-select" alt="npm version" />
            </a>
            <a href="https://github.com/vasilrashkov/react-wheel-select" target="_blank" rel="noopener noreferrer">
              <img src="https://img.shields.io/github/stars/vasilrashkov/react-wheel-select?style=social" alt="GitHub stars" />
            </a>
          </div>
        </header>

        {/* Example 1: Inline Text */}
        <section className="example-section">
          <h2>Inline Text Integration</h2>
          <p className="example-description">Seamlessly embed the picker within sentences.</p>
          <div className="example-card">
            <p className="demo-text">
              Today I want to{' '}
              <WheelSelect
                options={actionOptions}
                value={action}
                onChange={setAction}
                theme={{ colorScheme: 'dark' }}
              />
              {' '}something amazing.
            </p>
          </div>
        </section>

        {/* Example 2: Light Theme */}
        <section className="example-section">
          <h2>Light Theme</h2>
          <p className="example-description">Clean light appearance for bright interfaces.</p>
          <div className="example-card light">
            <p className="demo-text dark-text">
              My favorite fruit is{' '}
              <WheelSelect
                options={fruitOptions}
                value={fruit}
                onChange={setFruit}
                theme={{ colorScheme: 'light' }}
              />
            </p>
          </div>
        </section>

        {/* Example 3: Disabled Options */}
        <section className="example-section">
          <h2>Disabled Options</h2>
          <p className="example-description">Some options can be disabled to prevent selection.</p>
          <div className="example-card">
            <p className="demo-text">
              Selected plan:{' '}
              <WheelSelect
                options={planOptions}
                value={plan}
                onChange={setPlan}
                theme={{ colorScheme: 'dark' }}
              />
            </p>
          </div>
        </section>

        {/* Example 4: Custom Colors */}
        <section className="example-section">
          <h2>Custom Colors</h2>
          <p className="example-description">Fully customizable color scheme to match your brand.</p>
          <div className="example-card gradient">
            <p className="demo-text">
              Choose:{' '}
              <WheelSelect
                options={colorOptions}
                value={color}
                onChange={setColor}
                theme={{
                  colorScheme: 'dark',
                  colors: {
                    activeBg: 'rgba(139, 92, 246, 0.3)',
                    hoverBg: 'rgba(139, 92, 246, 0.15)',
                    focusRing: 'rgba(139, 92, 246, 0.5)',
                  },
                }}
              />
            </p>
          </div>
        </section>

        {/* Example 5: Custom Sizing */}
        <section className="example-section">
          <h2>Custom Sizing</h2>
          <p className="example-description">Adjust dimensions to fit your design needs.</p>
          <div className="example-card">
            <p className="demo-text small-text">
              Meeting duration:{' '}
              <WheelSelect
                options={timeOptions}
                value={time}
                onChange={setTime}
                theme={{
                  colorScheme: 'dark',
                  font: { size: 20, triggerSize: 16 },
                }}
                sizing={{
                  wheelHeight: 300,
                  optionHeight: 48,
                }}
              />
            </p>
          </div>
        </section>

        {/* Example 6: Controlled with Ref */}
        <section className="example-section">
          <h2>Programmatic Control</h2>
          <p className="example-description">Control the picker imperatively using refs.</p>
          <div className="example-card">
            <p className="demo-text">
              Value:{' '}
              <WheelSelect
                ref={controlledRef}
                options={fruitOptions}
                value={controlled}
                onChange={setControlled}
                theme={{ colorScheme: 'dark' }}
              />
            </p>
            <div className="button-row">
              <button onClick={() => controlledRef.current?.open()}>Open</button>
              <button onClick={() => controlledRef.current?.close()}>Close</button>
              <button onClick={() => controlledRef.current?.scrollToIndex(0)}>First</button>
              <button onClick={() => controlledRef.current?.scrollToIndex(fruitOptions.length - 1)}>Last</button>
            </div>
          </div>
        </section>

        <footer className="demo-footer">
          <p>
            <a href="https://github.com/vasilrashkov/react-wheel-select" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            {' · '}
            <a href="https://www.npmjs.com/package/react-wheel-select" target="_blank" rel="noopener noreferrer">
              npm
            </a>
            {' · '}
            MIT License
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
