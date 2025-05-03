import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, MapPin, Link as LinkIcon, Edit, AlertCircle } from 'lucide-react';
import BlogCard from '../components/blog/BlogCard';
import { fetchProfileByUsername, Profile } from '../api/profile';
import { fetchPostsByAuthor, BlogPost } from '../api/blog';
import { getCurrentUsername } from '../api/auth';

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const currentUsername = getCurrentUsername();
  const isOwnProfile = username === currentUsername;
  
  useEffect(() => {
    const loadProfile = async () => {
      if (!username) return;
      
      try {
        const profileData = await fetchProfileByUsername(username);
        setProfile(profileData);
        
        const postsData = await fetchPostsByAuthor(username);
        setPosts(postsData);
      } catch (err) {
        setError('Failed to load profile. User may not exist.');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [username]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{error || 'User not found'}</p>
              <div className="mt-4">
                <Link to="/" className="text-sm font-medium text-red-700 hover:text-red-600">
                  Go back to homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile header */}
      <div className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            {/* Avatar */}
            <div className="mb-4 md:mb-0 md:mr-6">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.user.username} 
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-500" />
                </div>
              )}
            </div>
            
            {/* Profile info */}
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {profile.user.first_name && profile.user.last_name
                    ? `${profile.user.first_name} ${profile.user.last_name}`
                    : profile.user.username}
                </h1>
                
                {isOwnProfile && (
                  <Link 
                    to="/edit-profile" 
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2 md:mt-0"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                )}
              </div>
              
              <p className="text-gray-500 mb-4">@{profile.user.username}</p>
              
              {profile.bio && (
                <p className="text-gray-700 mb-4 max-w-2xl">{profile.bio}</p>
              )}
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {profile.website && (
                  <a 
                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blog posts */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {posts.length > 0 
            ? `${isOwnProfile ? 'Your' : `${profile.user.username}'s`} Blog Posts`
            : `${isOwnProfile ? 'You haven\'t' : `${profile.user.username} hasn't`} written any posts yet`}
        </h2>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          isOwnProfile && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-6">Share your thoughts with the world by creating your first blog post.</p>
              <Link 
                to="/new-post" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-2" />
                Create Your First Post
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProfilePage;