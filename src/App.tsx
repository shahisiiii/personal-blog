import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BlogDetailPage from './pages/BlogDetailPage';
import NewBlogPostPage from './pages/NewBlogPostPage';
import EditBlogPostPage from './pages/EditBlogPostPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import MyBlogsPage from './pages/MyBlogsPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/auth/PrivateRoute';
import { isAuthenticated, getCurrentUsername } from './api/auth';

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setLoggedIn(authenticated);
      if (authenticated) {
        setUsername(getCurrentUsername());
      } else {
        setUsername(null);
      }
    };
    
    checkAuth();
    
    // Set up interval to check auth status
    const interval = setInterval(checkAuth, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar isLoggedIn={loggedIn} username={username} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage onLogin={() => setLoggedIn(true)} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            
            {/* Protected routes */}
            <Route 
              path="/new-post" 
              element={
                <PrivateRoute>
                  <NewBlogPostPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/edit-post/:id" 
              element={
                <PrivateRoute>
                  <EditBlogPostPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/my-blogs" 
              element={
                <PrivateRoute>
                  <MyBlogsPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/edit-profile" 
              element={
                <PrivateRoute>
                  <EditProfilePage />
                </PrivateRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;