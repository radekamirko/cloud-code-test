import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Task Automation Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Automate your Product/Project Management work with AI-powered task
            prioritization, workflow automation, and intelligent insights.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
            >
              Sign In
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold mb-2">AI Style Learning</h3>
              <p className="text-gray-600">
                Upload documents and voice notes. The platform learns your
                writing and management style.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">Smart Prioritization</h3>
              <p className="text-gray-600">
                AI-powered task prioritization based on deadlines, dependencies,
                and your patterns.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Workflow Automation</h3>
              <p className="text-gray-600">
                Build custom workflows with visual builder. Automate repetitive
                processes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold mb-2">Integrations</h3>
              <p className="text-gray-600">
                Connect with Jira, Slack, Notion, Google Calendar, and more.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-xl font-semibold mb-2">Voice Input</h3>
              <p className="text-gray-600">
                Record voice notes and meetings. Automatically transcribed and
                analyzed.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">
                Track productivity, identify patterns, and get actionable
                insights.
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 bg-white rounded-xl shadow-md text-left">
            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span>
                  <strong>Knowledge Base:</strong> Upload PDFs, DOCX, voice
                  notes to build your personalized repository
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span>
                  <strong>Task Management:</strong> Full CRUD with custom
                  fields, tags, and dependencies
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span>
                  <strong>Workflow Engine:</strong> Visual builder with
                  triggers, actions, and conditions
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span>
                  <strong>Real-time Updates:</strong> Live collaboration and
                  notifications
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span>
                  <strong>Secure & Private:</strong> Row-level security, your
                  data stays yours
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
