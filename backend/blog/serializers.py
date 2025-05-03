from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, BlogPost, BlogImage

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = ['id', 'user', 'bio', 'avatar', 'website']

class BlogImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogImage
        fields = ['id', 'image', 'caption', 'order']

class BlogPostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    images = BlogImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'subtitle', 'content', 'author', 'created_at', 'updated_at', 'images']
        read_only_fields = ['author', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

class BlogPostCreateUpdateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        required=False,
        write_only=True
    )
    image_captions = serializers.ListField(
        child=serializers.CharField(max_length=200, allow_blank=True),
        required=False,
        write_only=True
    )
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'subtitle', 'content', 'images', 'image_captions']
    
    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        captions_data = validated_data.pop('image_captions', [])
        
        validated_data['author'] = self.context['request'].user
        blog_post = BlogPost.objects.create(**validated_data)
        
        for i, image_data in enumerate(images_data):
            caption = captions_data[i] if i < len(captions_data) else ''
            BlogImage.objects.create(
                blog_post=blog_post,
                image=image_data,
                caption=caption,
                order=i
            )
        
        return blog_post
    
    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])
        captions_data = validated_data.pop('image_captions', [])
        
        instance.title = validated_data.get('title', instance.title)
        instance.subtitle = validated_data.get('subtitle', instance.subtitle)
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        
        # Only add new images if provided
        if images_data:
            # Get the current highest order
            last_order = instance.images.aggregate(models.Max('order'))['order__max'] or -1
            
            for i, image_data in enumerate(images_data):
                caption = captions_data[i] if i < len(captions_data) else ''
                BlogImage.objects.create(
                    blog_post=instance,
                    image=image_data,
                    caption=caption,
                    order=last_order + i + 1
                )
        
        return instance