import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Image, X } from 'lucide-react';
import { BlogPost, CreateBlogPostData } from '../../api/blog';

interface BlogEditorProps {
  onSubmit: (data: CreateBlogPostData) => Promise<void>;
  initialData?: BlogPost;
  submitting: boolean;
}

const BlogEditor = ({ onSubmit, initialData, submitting }: BlogEditorProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateBlogPostData>({
    defaultValues: initialData
      ? {
          title: initialData.title,
          subtitle: initialData.subtitle || '',
          content: initialData.content,
        }
      : undefined,
  });
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageCaptions, setImageCaptions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...newFiles]);
    
    // Create previews
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    
    // Add empty captions
    setImageCaptions((prev) => [...prev, ...newFiles.map(() => '')]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const removeImage = (index: number) => {
    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageCaptions((prev) => prev.filter((_, i) => i !== index));
  };
  
  const updateCaption = (index: number, caption: string) => {
    const newCaptions = [...imageCaptions];
    newCaptions[index] = caption;
    setImageCaptions(newCaptions);
  };
  
  const handleFormSubmit = async (data: CreateBlogPostData) => {
    const formData: CreateBlogPostData = {
      ...data,
      images: selectedImages,
      image_captions: imageCaptions,
    };
    
    await onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
          Title*
        </label>
        <input
          id="title"
          type="text"
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Your blog title"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="subtitle">
          Subtitle <span className="text-gray-500">(optional)</span>
        </label>
        <input
          id="subtitle"
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="A brief subtitle for your blog"
          {...register('subtitle')}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="content">
          Content*
        </label>
        <textarea
          id="content"
          rows={12}
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Write your blog content here..."
          {...register('content', { required: 'Content is required' })}
        ></textarea>
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images <span className="text-gray-500">(optional)</span>
        </label>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
          id="image-upload"
        />
        
        <div className="flex flex-wrap gap-4 mt-2">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-32 h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Caption (optional)"
                value={imageCaptions[index]}
                onChange={(e) => updateCaption(index, e.target.value)}
                className="w-32 mt-1 px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
            <Image className="h-8 w-8 mb-1" />
            <span className="text-sm">Add Image</span>
          </button>
        </div>
      </div>
      
      {initialData ? (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-4">
            Note: Existing images will be preserved. Any new images you upload here will be added to the blog post.
          </p>
        </div>
      ) : null}
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving...' : initialData ? 'Update Post' : 'Publish Post'}
        </button>
      </div>
    </form>
  );
};

export default BlogEditor;