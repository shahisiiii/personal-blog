from rest_framework import viewsets, generics, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import Profile, BlogPost, BlogImage
from .serializers import (
    UserSerializer, 
    UserCreateSerializer,
    ProfileSerializer, 
    BlogPostSerializer,
    BlogPostCreateUpdateSerializer,
    BlogImageSerializer
)
from .permissions import IsAuthorOrReadOnly

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create profile for new user
        Profile.objects.create(user=user)
        
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED
        )

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    
    def get_queryset(self):
        queryset = Profile.objects.all()
        username = self.request.query_params.get('username', None)
        if username is not None:
            queryset = queryset.filter(user__username=username)
        return queryset
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"detail": "You do not have permission to edit this profile."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return BlogPostCreateUpdateSerializer
        return BlogPostSerializer
    
    def get_queryset(self):
        queryset = BlogPost.objects.all()
        author = self.request.query_params.get('author', None)
        if author is not None:
            queryset = queryset.filter(author__username=author)
        return queryset
    
    @action(detail=False, methods=['get'])
    def my_posts(self, request):
        queryset = BlogPost.objects.filter(author=request.user)
        serializer = BlogPostSerializer(queryset, many=True)
        return Response(serializer.data)

class BlogImageViewSet(viewsets.ModelViewSet):
    queryset = BlogImage.objects.all()
    serializer_class = BlogImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    
    def get_queryset(self):
        return BlogImage.objects.filter(blog_post__id=self.kwargs.get('blog_post_pk'))
    
    def perform_create(self, serializer):
        blog_post = BlogPost.objects.get(id=self.kwargs.get('blog_post_pk'))
        if blog_post.author != self.request.user:
            raise permissions.PermissionDenied("You can only add images to your own blog posts.")
        serializer.save(blog_post=blog_post)