import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/layout/Sidebar';
import { PageContainer } from '../components/PageContainer';

const Files: React.FC = () => {
  const { theme } = useTheme();
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Mock folder structure
  const folders = {
    root: [
      { id: 1, name: 'Documents', type: 'folder', items: 8, modified: '2023-11-10' },
      { id: 2, name: 'Images', type: 'folder', items: 15, modified: '2023-11-15' },
      { id: 3, name: 'Projects', type: 'folder', items: 5, modified: '2023-11-20' },
      { id: 4, name: 'Annual Report.pdf', type: 'pdf', size: '4.2 MB', modified: '2023-11-05' },
      { id: 5, name: 'Meeting Notes.docx', type: 'docx', size: '1.8 MB', modified: '2023-11-12' },
      { id: 6, name: 'Budget.xlsx', type: 'xlsx', size: '2.5 MB', modified: '2023-11-18' },
      { id: 7, name: 'Presentation.pptx', type: 'pptx', size: '5.7 MB', modified: '2023-11-22' },
      { id: 8, name: 'Logo.png', type: 'png', size: '0.8 MB', modified: '2023-11-08' },
    ],
    Documents: [
      { id: 11, name: 'Research', type: 'folder', items: 3, modified: '2023-11-10' },
      { id: 12, name: 'Contracts', type: 'folder', items: 4, modified: '2023-11-15' },
      { id: 13, name: 'Report Draft.docx', type: 'docx', size: '2.3 MB', modified: '2023-11-05' },
      { id: 14, name: 'Client Proposal.pdf', type: 'pdf', size: '3.1 MB', modified: '2023-11-12' },
      { id: 15, name: 'Requirements.md', type: 'md', size: '0.5 MB', modified: '2023-11-18' },
    ],
    Images: [
      { id: 21, name: 'Product Photos', type: 'folder', items: 12, modified: '2023-11-10' },
      { id: 22, name: 'Team Photos', type: 'folder', items: 8, modified: '2023-11-15' },
      { id: 23, name: 'Cover Image.jpg', type: 'jpg', size: '1.7 MB', modified: '2023-11-05' },
      { id: 24, name: 'Banner.png', type: 'png', size: '2.2 MB', modified: '2023-11-12' },
      { id: 25, name: 'Logo Vector.svg', type: 'svg', size: '0.3 MB', modified: '2023-11-18' },
    ],
    Projects: [
      { id: 31, name: 'Project Alpha', type: 'folder', items: 7, modified: '2023-11-10' },
      { id: 32, name: 'Project Beta', type: 'folder', items: 5, modified: '2023-11-15' },
      { id: 33, name: 'Project Overview.docx', type: 'docx', size: '1.5 MB', modified: '2023-11-05' },
      { id: 34, name: 'Timeline.xlsx', type: 'xlsx', size: '1.2 MB', modified: '2023-11-12' },
      { id: 35, name: 'Resources.pdf', type: 'pdf', size: '2.8 MB', modified: '2023-11-18' },
    ]
  };

  // Get files for current folder
  const currentFiles = folders[currentFolder as keyof typeof folders] || [];

  // Sort files
  const sortedFiles = [...currentFiles].sort((a, b) => {
    // Always put folders first
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;

    // Then sort by selected field
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'modified') {
      comparison = new Date(a.modified).getTime() - new Date(b.modified).getTime();
    } else if (sortBy === 'type') {
      comparison = a.type.localeCompare(b.type);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleFolderClick = (folder: string) => {
    setCurrentFolder(folder);
  };

  const handleBackClick = () => {
    if (currentFolder !== 'root') {
      setCurrentFolder('root');
    }
  };

  const handleUploadClick = () => {
    alert('Upload functionality would be implemented here in a real application.');
  };

  const handleNewFolderClick = () => {
    alert('New folder functionality would be implemented here in a real application.');
  };

  // Function to get icon for file type
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder': return 'folder';
      case 'pdf': return 'picture_as_pdf';
      case 'docx': return 'description';
      case 'xlsx': return 'table_chart';
      case 'pptx': return 'slideshow';
      case 'png': 
      case 'jpg': 
      case 'svg': return 'image';
      case 'md': return 'article';
      default: return 'insert_drive_file';
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar userName="John Doe" isDarkMode={theme === 'dark'} />
      <PageContainer>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Files</h1>
              {currentFolder !== 'root' && (
                <div className="ml-4 flex items-center">
                  <button 
                    onClick={handleBackClick}
                    className="text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    <span className="material-icons mr-1">arrow_back</span>
                    Back
                  </button>
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="font-medium">{currentFolder}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleUploadClick}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center"
              >
                <span className="material-icons mr-1">upload</span>
                Upload
              </button>
              <button
                onClick={handleNewFolderClick}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-colors flex items-center"
              >
                <span className="material-icons mr-1">create_new_folder</span>
                New Folder
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="bg-white dark:bg-gray-800 rounded-md shadow px-3 py-2 flex items-center">
                <span className="text-gray-500 dark:text-gray-400 mr-2">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'modified' | 'type')}
                  className="bg-transparent border-none outline-none text-gray-800 dark:text-white"
                >
                  <option value="name">Name</option>
                  <option value="modified">Modified</option>
                  <option value="type">Type</option>
                </select>
                <button 
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="ml-2 text-gray-500 dark:text-gray-400"
                >
                  <span className="material-icons">
                    {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                  </span>
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
              >
                <span className="material-icons">grid_view</span>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
              >
                <span className="material-icons">view_list</span>
              </button>
            </div>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {sortedFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => file.type === 'folder' ? handleFolderClick(file.name) : null}
                >
                  <span className={`material-icons text-4xl mb-2 ${
                    file.type === 'folder' ? 'text-yellow-500' : 'text-blue-500'
                  }`}>
                    {getFileIcon(file.type)}
                  </span>
                  <p className="text-sm font-medium text-center truncate w-full">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {file.type === 'folder' ? `${file.items} items` : file.size}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-md shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size/Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Modified</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedFiles.map((file) => (
                    <tr 
                      key={file.id}
                      className={file.type === 'folder' ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
                      onClick={() => file.type === 'folder' ? handleFolderClick(file.name) : null}
                    >
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <span className={`material-icons mr-2 ${
                          file.type === 'folder' ? 'text-yellow-500' : 'text-blue-500'
                        }`}>
                          {getFileIcon(file.type)}
                        </span>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {file.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {file.type === 'folder' ? `${file.items} items` : file.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {file.modified}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {file.type !== 'folder' && (
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 mr-3">
                            <span className="material-icons text-sm">download</span>
                          </button>
                        )}
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 mr-3">
                          <span className="material-icons text-sm">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
};

export default Files; 