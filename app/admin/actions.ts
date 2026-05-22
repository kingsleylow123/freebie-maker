'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE_NAME = 'admin_token'
const COOKIE_VALUE = 'authenticated'

export async function login(
  previousState: { error: string } | null,
  formData: FormData,
) {
  const password = formData.get('password') as string

  const validPasswords = [
    process.env.ADMIN_PASSWORD,
    process.env.ADMIN_PASSWORD_TOM,
  ].filter(Boolean)

  if (!validPasswords.includes(password)) {
    return { error: 'Invalid password' }
  }

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7200, // 2 hours
    path: '/',
  })

  const redirectTo = (formData.get('redirectTo') as string) || '/admin/responses'
  redirect(redirectTo)
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  redirect('/admin')
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value === COOKIE_VALUE
}
