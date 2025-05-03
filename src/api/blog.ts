import authApi from './auth';
import { User } from '../types/user';

// Types
export interface BlogPost {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  author: User;
  created_at: string;
  updated_at: string;
  images: BlogImage[];
}

export interface BlogImage {
  id: number;
  image: string;
  caption?: string;
  order: number;
}

export interface CreateBlogPostData {
  title: string;
  subtitle?: string;
  content: string;
  images?: File[];
  image_captions?: string[];
}

// API endpoints - Using authApi which already has the correct baseURL
export const fetchAllPosts = async (): Promise<BlogPost[]> => {
  const response = await authApi.get('/v1/posts/');
  return response.data;
};

export const fetchPostById = async (id: number): Promise<BlogPost> => {
  const response = await authApi.get(`/v1/posts/${id}/`);
  return response.data;
};

export const fetchPostsByAuthor = async (username: string): Promise<BlogPost[]> => {
  const response = await authApi.get(`/v1/posts/?author=${username}`);
  return response.data;
};

export const fetchMyPosts = async (): Promise<BlogPost[]> => {
  const response = await authApi.get('/v1/posts/my_posts/');
  return response.data;
};

export const createPost = async (postData: CreateBlogPostData): Promise<BlogPost> => {
  // If there are images, we need to use FormData
  if (postData.images && postData.images.length > 0) {
    const formData = new FormData();
    
    formData.append('title', postData.title);
    
    if (postData.subtitle) {
      formData.append('subtitle', postData.subtitle);
    }
    
    formData.append('content', postData.content);
    
    // Add images
    postData.images.forEach((image, index) => {
      formData.append(`images`, image);
    });
    
    // Add captions if available
    if (postData.image_captions) {
      postData.image_captions.forEach((caption, index) => {
        formData.append(`image_captions`, caption);
      });
    }
    
    const response = await authApi.post('/v1/posts/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } else {
    // No images, regular JSON request
    const response = await authApi.post('/v1/posts/', postData);
    return response.data;
  }
};

export const updatePost = async (id: number, postData: CreateBlogPostData): Promise<BlogPost> => {
  // If there are images, we need to use FormData
  if (postData.images && postData.images.length > 0) {
    const formData = new FormData();
    
    formData.append('title', postData.title);
    
    if (postData.subtitle) {
      formData.append('subtitle', postData.subtitle);
    }
    
    formData.append('content', postData.content);
    
    // Add images
    postData.images.forEach((image) => {
      formData.append('images', image);
    });
    
    // Add captions if available
    if (postData.image_captions) {
      postData.image_captions.forEach((caption) => {
        formData.append('image_captions', caption);
      });
    }
    
    const response = await authApi.patch(`/v1/posts/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } else {
    // No images, regular JSON request
    const response = await authApi.patch(`/v1/posts/${id}/`, postData);
    return response.data;
  }
};

export const deletePost = async (id: number): Promise<void> => {
  await authApi.delete(`/v1/posts/${id}/`);
};

// Image handling
export const deleteImage = async (postId: number, imageId: number): Promise<void> => {
  await authApi.delete(`/v1/posts/${postId}/images/${imageId}/`);
};

export const updateImageOrder = async (
  postId: number,
  imageId: number,
  order: number
): Promise<BlogImage> => {
  const response = await authApi.patch(`/v1/posts/${postId}/images/${imageId}/`, {
    order,
  });
  return response.data;
};