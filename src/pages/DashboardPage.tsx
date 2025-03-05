import React from 'react';
import { PageContainer } from '../components/PageContainer';
import Sidebar from '../components/layout/Sidebar';

export default function DashboardPage() {
  return (
    <div className="flex h-screen" style={{ backgroundColor: '#131314' }}>
      <Sidebar userName="User" isDarkMode={true} activePage="dashboard" />
      
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#131314' }}>
        <PageContainer>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-md p-4">
                <h2 className="text-lg font-medium mb-2">Recent Activity</h2>
                <p className="text-gray-400">No recent activity.</p>
              </div>
              
              <div className="bg-gray-800 rounded-md p-4">
                <h2 className="text-lg font-medium mb-2">Tasks</h2>
                <p className="text-gray-400">No pending tasks.</p>
              </div>
              
              <div className="bg-gray-800 rounded-md p-4">
                <h2 className="text-lg font-medium mb-2">Quick Links</h2>
                <ul className="list-disc pl-5 text-gray-400">
                  <li className="mb-1"><a href="#" className="text-blue-400 hover:underline">Computer Use Guide</a></li>
                  <li className="mb-1"><a href="#" className="text-blue-400 hover:underline">Settings</a></li>
                  <li className="mb-1"><a href="#" className="text-blue-400 hover:underline">Help Center</a></li>
                </ul>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
} 