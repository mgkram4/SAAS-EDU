// src/app/test/page.tsx
'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function TestPage() {
  const [status, setStatus] = useState<string>('Checking connection...')
  const [version, setVersion] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function checkConnection() {
      try {
        // Test database connection
        const { data, error } = await supabase
          .from('_prisma_migrations')
          .select('*')
          .limit(1)

        if (error) throw error

        // Get Supabase version
        const { data: versionData } = await supabase
          .rpc('version')
          .single()

        setVersion(versionData)
        setStatus('Connected successfully!')

        // Check current user
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

      } catch (err: any) {
        setError(err.message)
        setStatus('Connection failed')
      }
    }

    checkConnection()
  }, [])

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: 'test@test.com',
      password: 'test123456',
    })
    
    if (error) setError(error.message)
    else setStatus('User created successfully!')
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto space-y-6 bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold">Supabase Connection Test</h1>
        
        <div className="space-y-2">
          <p className="font-semibold">Status:</p>
          <p className={`${status.includes('success') ? 'text-green-600' : 'text-blue-600'}`}>
            {status}
          </p>
        </div>

        {version && (
          <div className="space-y-2">
            <p className="font-semibold">Supabase Version:</p>
            <p className="text-gray-600">{version}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded">
            <p className="font-semibold">Error:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {user && (
          <div className="space-y-2">
            <p className="font-semibold">Current User:</p>
            <pre className="bg-gray-50 p-2 rounded">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}

        <button
          onClick={handleSignUp}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Sign Up
        </button>
      </div>
    </div>
  )
}