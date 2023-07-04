import { Inter } from 'next/font/google'
import Chat from './chat'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (

    <main>
      <Chat />
    </main>
  )
}
