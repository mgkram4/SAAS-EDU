"use client"


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2, LogOut, Mail, User2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState({
      full_name: '',
      email: '',
      avatar_url: ''
    });
    const [editForm, setEditForm] = useState({
      full_name: '',
      avatar_url: ''
    });
  
    const router = useRouter();
    const supabase = createClientComponentClient();
  
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/auth/login');
          return;
        }
  
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
  
        if (error) throw error;
  
        setProfile({
          full_name: data.full_name || '',
          email: session.user.email || '',
          avatar_url: data.avatar_url || ''
        });
  
        setEditForm({
          full_name: data.full_name || '',
          avatar_url: data.avatar_url || ''
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile');
      }
    };
  
    const handleEdit = () => {
      setIsEditing(true);
    };
  
    const handleCancel = () => {
      setIsEditing(false);
      setEditForm({
        full_name: profile.full_name,
        avatar_url: profile.avatar_url
      });
    };
  
    const handleSave = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/auth/login');
          return;
        }
  
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: editForm.full_name,
            avatar_url: editForm.avatar_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', session.user.id);
  
        if (error) throw error;
  
        setProfile({
          ...profile,
          full_name: editForm.full_name,
          avatar_url: editForm.avatar_url
        });
        setIsEditing(false);
        router.refresh();
      } catch (error) {
        console.error('Error updating profile:', error);
        setError('Failed to update profile');
      } finally {
        setLoading(false);
      }
    };
  
    const handleLogout = async () => {
      try {
        await supabase.auth.signOut();
        router.push('/auth/login');
      } catch (error) {
        console.error('Error logging out:', error);
        setError('Failed to log out');
      }
    };
  
    // Load profile data on mount
    useState(() => {
      loadProfile();
    });
  
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <User2 className="w-6 h-6" />
                  Profile Settings
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}
  
              <div className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </div>
                </div>
  
                {/* Full Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        full_name: e.target.value
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="text-gray-600">
                      {profile.full_name || 'Not set'}
                    </div>
                  )}
                </div>
  
                {/* Avatar URL Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.avatar_url}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        avatar_url: e.target.value
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="text-gray-600">
                      {profile.avatar_url || 'Not set'}
                    </div>
                  )}
                </div>
  
                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4">
                  {isEditing ? (
                    <div className="flex gap-4">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleEdit}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Edit Profile
                    </button>
                  )}
              
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  export default ProfilePage;