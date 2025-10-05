import { useState } from 'react'
import { Button, Card, GlowContainer } from './components'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 style={{ 
        fontFamily: 'var(--font-primary)', 
        fontSize: 'var(--font-size-4xl)', 
        fontWeight: 'var(--font-weight-bold)',
        color: 'var(--color-text-primary)',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        Pools - UI Components Test
      </h1>

      {/* Button Examples */}
      <Card variant="glass" padding="lg">
        <h2 style={{ fontFamily: 'var(--font-primary)', marginBottom: '1rem' }}>Button Components</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" size="lg">
            Connect Wallet
          </Button>
          <Button variant="secondary" size="md">
            Secondary Action
          </Button>
          <Button variant="ghost" size="sm">
            Ghost Button
          </Button>
          <Button variant="primary" size="md" isLoading>
            Loading...
          </Button>
        </div>
      </Card>

      {/* Card Examples */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        <Card variant="default">
          <h3>Default Card</h3>
          <p>This is a default card with standard styling and hover effects.</p>
        </Card>
        
        <Card variant="glass">
          <h3>Glass Card</h3>
          <p>This card uses glassmorphism effects with backdrop blur and transparency.</p>
        </Card>
        
        <Card variant="elevated">
          <h3>Elevated Card</h3>
          <p>This card has enhanced shadows and elevation effects.</p>
        </Card>
      </div>

      {/* Glow Container Examples */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <GlowContainer glowColor="blue" intensity="medium">
          <Card variant="glass">
            <h4>Blue Glow</h4>
            <p>Container with blue glow effect</p>
          </Card>
        </GlowContainer>
        
        <GlowContainer glowColor="cyan" intensity="high" animated>
          <Card variant="glass">
            <h4>Animated Cyan Glow</h4>
            <p>Pulsing cyan glow animation</p>
          </Card>
        </GlowContainer>
        
        <GlowContainer glowColor="green" intensity="medium">
          <Card variant="glass">
            <h4>Success Green</h4>
            <p>Green glow for success states</p>
          </Card>
        </GlowContainer>
      </div>

      {/* Interactive Counter */}
      <Card variant="elevated">
        <h3 style={{ marginBottom: '1rem' }}>Interactive Counter</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button variant="primary" onClick={() => setCount(count + 1)}>
            Count: {count}
          </Button>
          <Button variant="secondary" onClick={() => setCount(0)}>
            Reset
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default App
