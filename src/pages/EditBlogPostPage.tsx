import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import BlogEditor from '../components/blog/BlogEditor';
import { fetchPostById, updatePost, CreateBlogPostData, BlogPost } from '../api/blog';
import { getCurrentUsername } from '../api/auth';

const EditBlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      
      try {
        const data = await fetchPostById(parseInt(id));
        
        // Check if current user is the author
        const currentUsername = getCurrentUsername();
        if (data.author.username !== currentUsername) {
          navigate('/');
          return;
        }
        
        setPost(data);
      } catch (err) {
        setError('Failed to load blog post. It may have been deleted or you might not have permission to edit it.');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPost();
  }, [id, navigate]);
  
  const handleSubmit = async (data: CreateBlogPostData) => {
    if (!id || !post) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const updatedPost = await updatePost(parseInt(id), data);
      navigate(`/blog/${updatedPost.id}`, { state: { message: 'Blog post updated successfully!' } });
    } catch (err) {
      setError('Failed to update blog post. Please try again.');
      console.error('Error updating post:', err);
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
  
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{error || 'Blog post not found'}</p>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Blog Post</h1>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
              {error}
            </div>
          )}
          
          <BlogEditor onSubmit={handleSubmit} initialData={post} submitting={submitting} />
        </div>
      </div>
    </div>
  );
};

export default EditBlogPostPage;