import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/layout/Sidebar';
import { PageContainer } from '../components/PageContainer';

const Search: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search results for demonstration
  const mockResults = [
    { id: 1, title: 'How to use Browser Controls', type: 'Document', date: '2023-05-10' },
    { id: 2, title: 'AI Assistant Guide', type: 'Document', date: '2023-06-15' },
    { id: 3, title: 'Meeting Notes - Project Planning', type: 'Note', date: '2023-07-22' },
    { id: 4, title: 'Product Development Roadmap', type: 'Spreadsheet', date: '2023-08-05' },
    { id: 5, title: 'Client Presentation', type: 'Presentation', date: '2023-09-12' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Filter mock results based on search query
      const filteredResults = mockResults.filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="flex h-screen">
      <Sidebar userName="John Doe" isDarkMode={theme === 'dark'} />
      <PageContainer>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Search</h1>
          
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for documents, files, or content..."
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-r-md transition-colors"
              >
                <span className="material-icons">search</span>
              </button>
            </div>
          </form>
          
          {isSearching ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <h2 className="text-lg font-medium mb-4">Search Results ({searchResults.length})</h2>
              <div className="bg-white dark:bg-gray-800 rounded-md shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {searchResults.map((result) => (
                      <tr key={result.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{result.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {result.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {result.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 mr-3">
                            <span className="material-icons text-sm">visibility</span>
                          </button>
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200">
                            <span className="material-icons text-sm">download</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : searchQuery ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">No results found for "{searchQuery}"</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Try different keywords or check your spelling</p>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">Enter a search term to find documents, files, and more</p>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
};

export default Search; 