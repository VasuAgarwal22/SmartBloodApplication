import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiClient } from '../lib/api'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  // Profile operations
  const profileOperations = {
    clear() {
      setUserProfile(null)
      setProfileLoading(false)
    }
  }

  useEffect(() => {
    // Initial session check from localStorage
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }

    setLoading(false);
  }, [])

  // Auth methods
  const signIn = async (email, password) => {
    try {
      const response = await apiClient.login(email, password);
      if (response.token && response.user) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
        setUser(response.user);
        return { data: response, error: null };
      } else {
        return { data: null, error: { message: response.message || 'Login failed' } };
      }
    } catch (error) {
      return { data: null, error: { message: error.message || 'Network error. Please try again.' } };
    }
  }

  const signUp = async (email, password) => {
    try {
      const response = await apiClient.register(email, password);
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message || 'Network error. Please try again.' } };
    }
  }

  const signOut = async () => {
    try {
      await apiClient.logout();
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
      setUserProfile(null);
      return { error: null };
    } catch (error) {
      // Even if logout fails on server, clear local state
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
      setUserProfile(null);
      return { error: null };
    }
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: { message: 'No user logged in' } }

    try {
      // For now, we'll update local state
      // This can be expanded to call a profile update endpoint
      const updatedProfile = { ...userProfile, ...updates };
      setUserProfile(updatedProfile);
      return { data: updatedProfile, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message || 'Network error. Please try again.' } };
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}