import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, AlertCircle } from 'lucide-react';
import { fetchMyProfile, updateProfile, Profile } from '../api/profile';
import { getCurrentUsername } from '../api/auth';

interface ProfileFormData {
  bio: string;
  website: string;
}

const EditProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProfileFormData>();
  const navigate = useNavigate();
  
  const username = getCurrentUsername();
  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchMyProfile();
        setProfile(profileData);
        
        // Set form values
        setValue('bio', profileData.bio || '');
        setValue('website', profileData.website || '');
        
        // Set avatar preview if exists
        if (profileData.avatar) {
          setAvatarPreview(profileData.avatar);
        }
      } catch (err) {
        setError('Failed to load your profile. Please try again.');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [setValue]);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };
  
  const onSubmit = async (data: ProfileFormData) => {
    if (!profile) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const updateData = {
        bio: data.bio,
        website: data.website,
        ...(avatarFile && { avatar: avatarFile }),
      };
      
      await updateProfile(profile.id, updateData);
      navigate(`/profile/${username}`);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">Failed to load profile data.</p>
              <button
                onClick={() => navigate(-1)}
                className="mt-4 text-sm font-medium text-red-700 hover:text-red-600"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Your Profile</h1>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center">
                <div className="mr-4">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt={profile.user.username}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-gray-500" />
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <label 
                  htmlFor="avatar"
                  className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Change Picture
                </label>
              </div>
            </div>
            
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bio">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell others about yourself..."
                {...register('bio')}
              ></textarea>
            </div>
            
            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="website">
                Website
              </label>
              <input
                id="website"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://yourwebsite.com"
                {...register('website')}
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => navigate(`/profile/${username}`)}
                className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;