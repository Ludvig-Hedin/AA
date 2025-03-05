import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/layout/Sidebar';
import { PageContainer } from '../components/PageContainer';

const Collections: React.FC = () => {
  const { theme } = useTheme();
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);

  // Mock collections data
  const collections = [
    { 
      id: 1, 
      name: 'Work Documents', 
      description: 'Important work-related files and documents',
      items: 15,
      lastModified: '2023-09-28',
      icon: 'work'
    },
    { 
      id: 2, 
      name: 'Research Papers', 
      description: 'Collection of AI research papers and notes',
      items: 8,
      lastModified: '2023-10-12',
      icon: 'auto_stories'
    },
    { 
      id: 3, 
      name: 'Project Alpha', 
      description: 'Files related to Project Alpha development',
      items: 23,
      lastModified: '2023-11-05',
      icon: 'rocket_launch'
    },
    { 
      id: 4, 
      name: 'Client Presentations', 
      description: 'Presentations for various client meetings',
      items: 7,
      lastModified: '2023-11-18',
      icon: 'slideshow'
    },
    { 
      id: 5, 
      name: 'Personal Notes', 
      description: 'Personal notes and ideas',
      items: 19,
      lastModified: '2023-12-01',
      icon: 'note'
    }
  ];

  // Mock collection items (only displayed when a collection is selected)
  const collectionItems = [
    { id: 101, name: 'Project Proposal.docx', type: 'Document', size: '2.3 MB', modified: '2023-11-10' },
    { id: 102, name: 'Budget Forecast.xlsx', type: 'Spreadsheet', size: '1.5 MB', modified: '2023-11-12' },
    { id: 103, name: 'Meeting Notes.md', type: 'Markdown', size: '45 KB', modified: '2023-11-15' },
    { id: 104, name: 'Product Roadmap.pdf', type: 'PDF', size: '3.7 MB', modified: '2023-11-18' },
    { id: 105, name: 'Client Feedback.docx', type: 'Document', size: '1.2 MB', modified: '2023-11-20' },
  ];

  const handleCreateCollection = () => {
    alert('Creating a new collection - this would open a dialog in a real application.');
  };

  return (
    <div className="flex h-screen">
      <Sidebar userName="John Doe" isDarkMode={theme === 'dark'} />
      <PageContainer>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Collections</h1>
            <button 
              onClick={handleCreateCollection}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center"
            >
              <span className="material-icons mr-1">add</span>
              Create Collection
            </button>
          </div>
          
          {selectedCollection === null ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((collection) => (
                <div 
                  key={collection.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedCollection(collection.id)}
                >
                  <div className="flex items-start">
                    <span className="material-icons text-blue-500 text-3xl mr-3">{collection.icon}</span>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">{collection.name}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{collection.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{collection.items} items</span>
                    <span>Last modified: {collection.lastModified}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-6">
                <button 
                  onClick={() => setSelectedCollection(null)}
                  className="mr-4 text-blue-500 hover:text-blue-700 flex items-center"
                >
                  <span className="material-icons mr-1">arrow_back</span>
                  Back to Collections
                </button>
                <h2 className="text-xl font-semibold">
                  {collections.find(c => c.id === selectedCollection)?.name}
                </h2>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-md shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Modified</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {collectionItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.modified}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 mr-3">
                            <span className="material-icons text-sm">visibility</span>
                          </button>
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 mr-3">
                            <span className="material-icons text-sm">edit</span>
                          </button>
                          <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200">
                            <span className="material-icons text-sm">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
};

export default Collections; 