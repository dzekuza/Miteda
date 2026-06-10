if (import.meta.env.DEV) {
  import('react-grab')
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

window.React = React
window.ReactDOM = ReactDOM

function mountApp() {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

// Load DS bundle first, then mount
const dsScript = document.createElement('script')
dsScript.src = '/_ds/miteda-design-system-acc83341-1a7c-49f3-8a5e-60b26a6891d6/_ds_bundle.js'
dsScript.onload = mountApp
dsScript.onerror = () => { console.error('DS bundle failed to load'); mountApp() }
document.head.appendChild(dsScript)
