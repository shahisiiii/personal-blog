from django.contrib import admin
from .models import Profile, BlogPost, BlogImage

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'website')
    search_fields = ('user__username', 'user__email')

class BlogImageInline(admin.TabularInline):
    model = BlogImage
    extra = 1

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('title', 'content', 'author__username')
    inlines = [BlogImageInline]
    date_hierarchy = 'created_at'

@admin.register(BlogImage)
class BlogImageAdmin(admin.ModelAdmin):
    list_display = ('blog_post', 'caption', 'order')
    list_filter = ('blog_post',)