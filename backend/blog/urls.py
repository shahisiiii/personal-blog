from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserCreateView,
    ProfileViewSet,
    BlogPostViewSet,
    BlogImageViewSet
)

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet)
router.register(r'posts', BlogPostViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserCreateView.as_view(), name='register'),
    path('posts/<int:blog_post_pk>/images/', BlogImageViewSet.as_view({'get': 'list', 'post': 'create'}), name='blog-images-list'),
    path('posts/<int:blog_post_pk>/images/<int:pk>/', BlogImageViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='blog-images-detail'),
]