import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { User } from 'lucide-react';
import { BlogPost } from '../../api/blog';

interface BlogCardProps {
  post: BlogPost;
  compact?: boolean;
}

const BlogCard = ({ post, compact = false }: BlogCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  const featuredImage = post.images && post.images.length > 0 ? post.images[0].image : null;
  
  // Truncate content for preview
  const contentPreview = post.content.length > 150 
    ? post.content.substring(0, 150) + '...' 
    : post.content;
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg ${compact ? '' : 'hover:-translate-y-1'}`}>
      {featuredImage && !compact && (
        <Link to={`/blog/${post.id}`}>
          <img 
            src={featuredImage} 
            alt={post.title} 
            className="w-full h-48 object-cover"
          />
        </Link>
      )}
      
      <div className="p-5">
        <Link to={`/blog/${post.id}`}>
          <h2 className={`font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors ${compact ? 'text-lg' : 'text-xl'}`}>
            {post.title}
          </h2>
        </Link>
        
        {post.subtitle && (
          <p className="text-gray-600 mb-3 italic">{post.subtitle}</p>
        )}
        
        {!compact && (
          <p className="text-gray-700 mb-4">{contentPreview}</p>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <Link to={`/profile/${post.author.username}`} className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
            {!post.author.avatar ? (
              <div className="bg-gray-200 rounded-full p-1 mr-2">
                <User className="h-4 w-4 text-gray-500" />
              </div>
            ) : (
              <img 
                src={post.author.avatar} 
                alt={post.author.username} 
                className="w-6 h-6 rounded-full mr-2"
              />
            )}
            <span>{post.author.username}</span>
          </Link>
          
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;