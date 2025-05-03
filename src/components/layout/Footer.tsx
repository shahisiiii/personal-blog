import { Book, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Book className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold">BlogMedium</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Links</h3>
              <ul className="space-y-1">
                <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-2">Connect</h3>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Github className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} BlogMedium. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;