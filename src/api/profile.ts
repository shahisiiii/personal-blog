import authApi from './auth';
import { User } from '../types/user';

// Types
export interface Profile {
  id: number;
  user: User;
  bio: string;
  avatar: string | null;
  website: string;
}

export interface UpdateProfileData {
  bio?: string;
  avatar?: File;
  website?: string;
}

// API endpoints
export const fetchMyProfile = async (): Promise<Profile> => {
  const response = await authApi.get('/v1/profiles/me/');
  return response.data;
};

export const fetchProfileByUsername = async (username: string): Promise<Profile> => {
  const response = await authApi.get(`/v1/profiles/?username=${username}`);
  return response.data[0];
};

export const updateProfile = async (id: number, profileData: UpdateProfileData): Promise<Profile> => {
  if (profileData.avatar) {
    const formData = new FormData();
    
    if (profileData.bio !== undefined) {
      formData.append('bio', profileData.bio);
    }
    
    if (profileData.website !== undefined) {
      formData.append('website', profileData.website);
    }
    
    formData.append('avatar', profileData.avatar);
    
    const response = await authApi.patch(`/v1/profiles/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } else {
    const response = await authApi.patch(`/v1/profiles/${id}/`, profileData);
    return response.data;
  }
};