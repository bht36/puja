import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const getInitials = () => {
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  const handleEditProfile = () => {
    setIsOpen(false);
    navigate('/edit-profile');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:opacity-80 transition-opacity"
      >
        {user?.profile_image_url ? (
          <img
            src={user.profile_image_url}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className="w-8 h-8 bg-[#C28142] rounded-full flex items-center justify-center text-white text-sm font-semibold"
          style={{ display: user?.profile_image_url ? 'none' : 'flex' }}
        >
          {getInitials()}
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border z-20 p-4">
            <div className="flex items-center justify-between mb-3 pb-3 border-b">
              <div className="flex items-center space-x-3">
                {user?.profile_image_url ? (
                  <img
                    src={user.profile_image_url}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-[#C28142] rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-[#1E1C25]">{user.first_name} {user.last_name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleEditProfile}
                className="p-1 text-gray-500 hover:text-[#C28142] transition-colors"
                title="Edit Profile"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Member since:</span>
                <span className="ml-2 text-[#1E1C25]">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 text-green-600">
                  {user.is_verified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t space-y-2">
              <button
                onClick={handleEditProfile}
                className="w-full text-left px-3 py-2 text-sm text-[#C28142] hover:bg-[#C28142] hover:text-white rounded transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={() => { setIsOpen(false); navigate('/review'); }}
                className="w-full text-left px-3 py-2 text-sm text-[#C28142] hover:bg-[#C28142] hover:text-white rounded transition-colors"
              >
                Write a Review ⭐
              </button>
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
