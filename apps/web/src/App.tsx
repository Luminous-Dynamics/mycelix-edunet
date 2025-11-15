import { useState } from 'react'
import './App.css'

function App() {
  const [connected, setConnected] = useState(false)

  return (
    <div className="app">
      <header className="header">
        <h1>Mycelix EduNet</h1>
        <p className="tagline">
          Decentralized education powered by Holochain and Federated Learning
        </p>
      </header>

      <main className="main">
        <section className="status">
          <h2>Status</h2>
          <p>
            Holochain: <span className={connected ? 'connected' : 'disconnected'}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </p>
          <button onClick={() => setConnected(!connected)}>
            {connected ? 'Disconnect' : 'Connect'}
          </button>
        </section>

        <section className="features">
          <h2>Features</h2>
          <ul>
            <li>Agent-centric learning (Holochain hApp, offline-friendly)</li>
            <li>Privacy-first Federated Learning (clipped updates, optional DP)</li>
            <li>Verifiable Credentials (W3C VC) tied to model provenance</li>
            <li>Community governance (DAO) for curricula and quality</li>
          </ul>
        </section>

        <section className="coming-soon">
          <h2>Coming Soon</h2>
          <ul>
            <li>Course discovery and enrollment</li>
            <li>Federated learning round participation</li>
            <li>Credential issuance and verification</li>
            <li>DAO governance and voting</li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>Built with ❤️ by Luminous Dynamics</p>
        <p>
          <a href="https://github.com/Luminous-Dynamics/mycelix-edunet" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
