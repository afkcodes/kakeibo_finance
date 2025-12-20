import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Tailwind v4 POC</h1>
        <p className="text-lg text-gray-600 mb-8">Web App with TanStack Router</p>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <p className="text-sm text-gray-500 mb-6">Click the buttons to test</p>
        </div>

        <div className="text-sm text-gray-500">
          <p>
            Edit <code className="bg-gray-100 px-2 py-1 rounded">src/routes/index.tsx</code> and
            save to reload.
          </p>
        </div>
      </div>
    </div>
  );
}
