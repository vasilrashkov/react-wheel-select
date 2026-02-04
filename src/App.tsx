import { useState, useRef } from 'react'
import { WheelSelect, type WheelSelectRef } from './components'
import './components/WheelSelect.css'

// Example options
const actionOptions = [
  { value: 'cook', label: 'cook' },
  { value: 'ship', label: 'ship' },
  { value: 'prompt', label: 'prompt' },
  { value: 'collaborate', label: 'collaborate' },
  { value: 'create', label: 'create' },
  { value: 'design', label: 'design' },
  { value: 'build', label: 'build' },
]

function App() {
  const [selectedValue, setSelectedValue] = useState('create')
  const selectRef = useRef<WheelSelectRef>(null)

  return (
    <div className="app">
      <p className="demo-text">
        you{' '}
        <WheelSelect
          ref={selectRef}
          options={actionOptions}
          value={selectedValue}
          onChange={setSelectedValue}
          name="action-type"
          theme={{
            colorScheme: 'dark',
          }}
          callbacks={{
            onChange: (value, option) => {
              console.log('Selected:', value, option)
            },
          }}
        />
      </p>
    </div>
  )
}

export default App
