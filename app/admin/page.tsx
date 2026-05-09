'use client'

import React, { useActionState } from 'react'
import { login } from './actions'

function FromField() {
  const [from, setFrom] = React.useState('')
  React.useEffect(() => {
    const f = new URLSearchParams(window.location.search).get('from') ?? ''
    setFrom(f)
  }, [])
  if (!from) return null
  return <input type="hidden" name="redirectTo" value={from} />
}

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, null)

  return (
    <main
      style={{
        background: '#0a0a0a',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: '360px', width: '100%', padding: '20px' }}>
        <h1
          style={{
            color: '#ededed',
            fontSize: '24px',
            fontWeight: 600,
            margin: '0 0 32px 0',
            textAlign: 'center',
          }}
        >
          Admin Login
        </h1>
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FromField />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            autoComplete="current-password"
            disabled={pending}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              color: '#ededed',
              fontSize: '16px',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
            }}
          />
          {state?.error && (
            <p
              style={{
                color: '#ff6b6b',
                fontSize: '14px',
                margin: '0',
                textAlign: 'center',
              }}
            >
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#E8760A',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: pending ? 'not-allowed' : 'pointer',
              opacity: pending ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!pending) e.currentTarget.style.background = '#d06800'
            }}
            onMouseLeave={(e) => {
              if (!pending) e.currentTarget.style.background = '#E8760A'
            }}
          >
            {pending ? 'Logging in...' : 'Login →'}
          </button>
        </form>
      </div>
    </main>
  )
}
