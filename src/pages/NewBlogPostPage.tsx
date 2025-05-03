import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogEditor from '../components/blog/BlogEditor';
import { createPost, CreateBlogPostData } from '../api/blog';

const NewBlogPostPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleSubmit = async (data: CreateBlogPostData) => {
    setSubmitting(true);
    setError(null);
    
    try {
      const newPost = await createPost(data);
      navigate(`/blog/${newPost.id}`, { state: { message: 'Blog post published successfully!' } });
    } catch (err) {
      setError('Failed to publish blog post. Please try again.');
      console.error('Error creating post:', err);
      setSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Blog Post</h1>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
              {error}
            </div>
          )}
          
          <BlogEditor onSubmit={handleSubmit} submitting={submitting} />
        </div>
      </div>
    </div>
  );
};

export default NewBlogPostPage;