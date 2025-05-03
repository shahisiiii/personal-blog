# BlogMedium - Personal Blogging Platform

A full-stack web application built with Django and React for creating and sharing blog posts.

## Features

- User authentication (sign up, log in, log out)
- Create, edit, and delete blog posts
- Upload and manage images in blog posts
- User profiles with customization options
- Responsive design for all device sizes

## Tech Stack

### Backend
- Django
- Django REST Framework
- JWT Authentication
- SQLite (default database)

### Frontend
- React
- TypeScript
- React Router
- Tailwind CSS
- Axios for API requests

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.8+ and pip

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/blog-medium.git
cd blog-medium
```

2. Set up the backend
```
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

3. Set up the frontend
```
cd ../
npm install
npm run dev
```

## Project Structure

```
/
├── backend/                # Django backend
│   ├── blog/               # Blog app
│   │   ├── models.py       # Database models
│   │   ├── serializers.py  # API serializers
│   │   ├── views.py        # API views
│   │   └── urls.py         # API routes
│   ├── blog_project/       # Django project settings
│   └── manage.py           # Django management script
├── src/                    # React frontend
│   ├── api/                # API client functions
│   ├── components/         # Reusable components
│   ├── pages/              # Page components
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
└── README.md               # Project documentation
```

## API Endpoints

### Authentication
- `POST /api/register/` - Register a new user
- `POST /api/token/` - Get JWT token
- `POST /api/token/refresh/` - Refresh JWT token

### Blog Posts
- `GET /api/v1/posts/` - List all blog posts
- `POST /api/v1/posts/` - Create a new blog post
- `GET /api/v1/posts/<id>/` - Get a specific blog post
- `PUT /api/v1/posts/<id>/` - Update a blog post
- `DELETE /api/v1/posts/<id>/` - Delete a blog post
- `GET /api/v1/posts/my_posts/` - Get current user's blog posts

### User Profiles
- `GET /api/v1/profiles/` - List all profiles
- `GET /api/v1/profiles/<id>/` - Get a specific profile
- `PUT /api/v1/profiles/<id>/` - Update a profile
- `GET /api/v1/profiles/me/` - Get current user's profile

## License

This project is licensed under the MIT License.