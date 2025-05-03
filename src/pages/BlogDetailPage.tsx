import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { User, Edit, Trash2, AlertCircle } from 'lucide-react';
import { fetchPostById, deletePost, BlogPost } from '../api/blog';
import { getCurrentUsername } from '../api/auth';

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const currentUsername = getCurrentUsername();
  const isAuthor = post && currentUsername === post.author.username;
  
  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      
      try {
        const data = await fetchPostById(parseInt(id));
        setPost(data);
      } catch (err) {
        setError('Failed to load blog post. It may have been deleted or you might not have permission to view it.');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPost();
  }, [id]);
  
  const handleDeleteClick = () => {
    setConfirmDelete(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!id) return;
    
    setDeleting(true);
    try {
      await deletePost(parseInt(id));
      navigate('/my-blogs', { state: { message: 'Blog post deleted successfully' } });
    } catch (err) {
      setError('Failed to delete blog post. Please try again.');
      console.error('Error deleting post:', err);
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };
  
  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };
  
  // Format dates for display
  const formattedDate = post 
    ? format(new Date(post.created_at), 'MMMM d, yyyy') 
    : '';
  
  const timeAgo = post 
    ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) 
    : '';
  
  const updatedTimeAgo = post && post.updated_at !== post.created_at
    ? formatDistanceToNow(new Date(post.updated_at), { addSuffix: true })
    : '';
  
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-2 text-sm text-red-700">{error || 'Blog post not found'}</p>
            <div className="mt-4">
              <Link to="/" className="text-sm font-medium text-red-700 hover:text-red-600">
                Go back to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white pb-12">
      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Blog Post</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Blog header */}
      <header className="bg-gray-50 py-8 border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{post.title}</h1>
          
          {post.subtitle && (
            <p className="text-xl text-gray-600 mb-4 italic">{post.subtitle}</p>
          )}
          
          <div className="flex items-center justify-between">
            <Link to={`/profile/${post.author.username}`} className="flex items-center">
              {post.author.avatar ? (
                <img 
                  src={post.author.avatar} 
                  alt={post.author.username} 
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
              )}
              <div>
                <h2 className="text-lg font-medium text-gray-900">{post.author.username}</h2>
                <p className="text-sm text-gray-500">
                  {formattedDate} ({timeAgo})
                  {updatedTimeAgo && <span> · Updated {updatedTimeAgo}</span>}
                </p>
              </div>
            </Link>
            
            {isAuthor && (
              <div className="flex space-x-2">
                <Link
                  to={`/edit-post/${post.id}`}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Edit post"
                >
                  <Edit className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleDeleteClick}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  title="Delete post"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Blog content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Main content */}
        <div className="prose max-w-none">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-800 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        
        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="mt-8 space-y-6">
            {post.images.map((image) => (
              <figure key={image.id} className="border border-gray-200 rounded-md overflow-hidden">
                <img
                  src={image.image}
                  alt={image.caption || 'Blog image'}
                  className="w-full"
                />
                {image.caption && (
                  <figcaption className="bg-gray-50 px-4 py-3 text-sm text-gray-500 italic">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogDetailPage;