// frontend/app/api/upload/route.ts
import { NextResponse } from 'next/server'
import { customAlphabet } from 'nanoid'

export const runtime = 'edge'

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
) // 7-character random string

export async function POST(req: Request) {
  const file = req.body || ''
  const contentType = req.headers.get('content-type') || 'text/plain'
  const filename = `${nanoid()}.${contentType.split('/')[1]}`
  console.log('filename', filename)
  const response = await fetch('http://localhost:3333/upload', {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
    },
    body: file,
  })

  if (!response.ok) {
    throw new Error(`Failed to upload file: ${response.statusText}`)
  }
  console.log('response', response)

  const data = await response.json()
  console.log
  return NextResponse.json(data)
}