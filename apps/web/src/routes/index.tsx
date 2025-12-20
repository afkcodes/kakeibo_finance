import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { TestButton } from '../components/TestButton';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Tailwind v4 POC</h1>
        <p className="text-lg text-gray-600 mb-8">Web App with TanStack Router</p>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <p className="text-6xl font-bold text-primary-600 mb-4">{count}</p>
          <p className="text-sm text-gray-500 mb-6">Click the buttons to test</p>

          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <TestButton variant="primary" onPress={() => setCount(count + 1)}>
              Increment
            </TestButton>
            <TestButton variant="secondary" onPress={() => setCount(count - 1)}>
              Decrement
            </TestButton>
            <TestButton variant="secondary" onPress={() => setCount(0)}>
              Reset
            </TestButton>
          </div>
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
