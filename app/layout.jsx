import './globals.css'
import { TestProvider } from '../contexts/TestContext'

export const metadata = {
  title: 'Culture Test App',
  description: 'Create behavioral and cultural assessments for your team',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <TestProvider>
          {children}
        </TestProvider>
      </body>
    </html>
  )
}
