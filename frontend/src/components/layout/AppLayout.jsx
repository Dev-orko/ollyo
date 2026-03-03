import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
        <footer className="border-t border-gray-200 bg-white px-4 py-3 text-center text-xs text-gray-500">
          Developed by{' '}
          <a
            href="https://www.fiverr.com/ui_byte"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
          >
            Jasmin (ui_byte)
          </a>
        </footer>
      </div>
    </div>
  );
}
