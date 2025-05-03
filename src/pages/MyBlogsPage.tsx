import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertCircle, PlusCircle, BookX } from 'lucide-react';
import BlogCard from '../components/blog/BlogCard';
import { fetchMyPosts, BlogPost } from '../api/blog';

interface LocationState {
  message?: string;
}

const MyBlogsPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const location = useLocation();
  const state = location.state as LocationState;
  
  useEffect(() => {
    // Check for success message in location state
    if (state?.message) {
      setSuccessMessage(state.message);
      
      // Clear the message after a few seconds
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [state]);
  
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchMyPosts();
        setPosts(data);
      } catch (err) {
        setError('Failed to load your blog posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">My Blog Posts</h1>
          <Link 
            to="/new-post" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </div>
        
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4 text-green-700">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
            <div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <BookX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">You haven't written any posts yet</h2>
            <p className="text-gray-600 mb-6">Create your first blog post to share your thoughts with the world.</p>
            <Link 
              to="/new-post" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogsPage;