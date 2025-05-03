import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import BlogCard from '../components/blog/BlogCard';
import { fetchAllPosts, BlogPost } from '../api/blog';

const HomePage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchAllPosts();
        setPosts(data);
      } catch (err: any) {
        if (err?.response?.status) {
          setError(`Failed to load blog posts (Status: ${err.response.status}). Please try again later.`);
        } else {
          setError('Failed to load blog posts due to a network error. Please check your connection and try again.');
        }
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPosts();
  }, []);
  
  // Filter posts based on search term
  const filteredPosts = searchTerm
    ? posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.subtitle && post.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Where Stories Come to Life</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            Discover insightful articles, share your ideas, and connect with readers around the world.
          </p>
          <div className="flex justify-center">
            <Link 
              to="/register" 
              className="px-8 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-blue-50 transition-colors shadow-md"
            >
              Start Writing Today
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search bar */}
        <div className="max-w-3xl mx-auto mb-12 relative">
          <input
            type="text"
            placeholder="Search articles, topics, or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-12 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          <Search className="absolute left-4 top-4 text-gray-400 h-6 w-6" />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">No posts found</h2>
                <p className="text-gray-600">
                  {searchTerm 
                    ? `No posts matching "${searchTerm}"`
                    : "There are no blog posts yet. Be the first to share your story!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;