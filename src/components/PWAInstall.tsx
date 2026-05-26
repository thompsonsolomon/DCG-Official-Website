import { useEffect, useState } from 'react'

export default function PWAInstall() {
  const [prompt, setPrompt] = useState<any>(null)

  useEffect(() => {
    window.addEventListener(
      'beforeinstallprompt',
      (e: any) => {
        e.preventDefault()
        setPrompt(e)
      }
    )
  }, [])

  const installApp = async () => {
    if (!prompt) return

    prompt.prompt()

    const choice = await prompt.userChoice

    if (choice.outcome === 'accepted') {
      console.log('App installed')
    }
  }

  if (!prompt) return null

  return (
    <button
      onClick={installApp}
      className="fixed bottom-5 right-5 bg-[#008080] text-white px-5 py-3 rounded-2xl shadow-xl z-50"
    >
      Install App
    </button>
  )
}