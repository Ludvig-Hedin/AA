import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/supabase';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const Profile: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [userInitials, setUserInitials] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Profiluppdateringsform states
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const userData = await getCurrentUser();
        if (userData) {
          setUsername(userData.email || 'User');
          setEmail(userData.email || '');
          
          // Generera initialer från användarnamn/email
          if (userData.email) {
            const parts = userData.email.split('@')[0].split('.');
            let initials = '';
            if (parts.length >= 2) {
              initials = (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
            } else {
              initials = parts[0].substring(0, 2).toUpperCase();
            }
            setUserInitials(initials);
            
            // Förifyll displayName med användarnamnet
            setDisplayName(userData.email.split('@')[0].replace('.', ' '));
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, []);
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementera API-anrop för att spara profilinformationen
    console.log('Saving profile:', { displayName, bio, website, location });
    alert('Profile updated successfully!');
  };
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0f1011]">
      {/* Full width navbar */}
      <div className="bg-[#181819] h-16 w-full flex items-center justify-between px-6 border-b border-[#232425]">
        <div className="flex items-center">
          <h1 className="text-white text-xl font-semibold">Profile</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="text-[#A5A5A6] hover:text-white p-2">
            <span className="material-icons">help_outline</span>
          </button>
          <button className="text-[#A5A5A6] hover:text-white p-2">
            <span className="material-icons">notifications</span>
          </button>
          
          {/* Profilbild med initialer */}
          <Link 
            to="/profile" 
            className="w-10 h-10 rounded-full bg-[#2383E2] flex items-center justify-center text-white font-medium cursor-pointer hover:bg-[#1a6fc0] transition-colors"
          >
            {userInitials}
          </Link>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar userName={username} isDarkMode={isDarkMode} />
        
        {/* Profil-innehåll */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-[#2383E2] flex items-center justify-center text-white text-2xl font-medium">
                {userInitials}
              </div>
              
              <div>
                <h1 className="text-white text-2xl font-bold">{displayName || username}</h1>
                <p className="text-[#A5A5A6]">{email}</p>
              </div>
            </div>
            
            <div className="bg-[#181819] rounded-[24px] shadow-lg border border-[#404141] p-6 mb-8">
              <h2 className="text-white text-xl font-semibold mb-6">Edit Profile</h2>
              
              <form onSubmit={handleSaveProfile}>
                <div className="mb-4">
                  <label className="block text-[#A5A5A6] mb-2">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-[#1E1F20] border border-[#404141] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#2383E2]"
                    placeholder="Your name"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-[#A5A5A6] mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-[#1E1F20] border border-[#404141] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#2383E2] min-h-[100px]"
                    placeholder="Tell us about yourself"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-[#A5A5A6] mb-2">Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-[#1E1F20] border border-[#404141] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#2383E2]"
                    placeholder="https://your-website.com"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-[#A5A5A6] mb-2">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#1E1F20] border border-[#404141] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#2383E2]"
                    placeholder="City, Country"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="bg-[#2383E2] text-white px-6 py-2 rounded-lg hover:bg-[#1a6fc0] transition-colors"
                >
                  Save Profile
                </button>
              </form>
            </div>
            
            <div className="bg-[#181819] rounded-[24px] shadow-lg border border-[#404141] p-6">
              <h2 className="text-white text-xl font-semibold mb-6">Account Settings</h2>
              
              <div className="mb-6">
                <h3 className="text-white font-medium mb-2">Email Address</h3>
                <p className="text-[#A5A5A6]">{email}</p>
              </div>
              
              <div className="border-t border-[#404141] pt-6">
                <button className="text-red-500 hover:text-red-400 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 