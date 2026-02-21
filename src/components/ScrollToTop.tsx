import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { useTheme } from "next-themes";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollY = window.scrollY;
      const showArrow = scrollY > 300;
      setIsVisible(showArrow);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 right-6 z-40 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
        theme === 'dark' 
          ? 'bg-gray-800 text-white hover:bg-gray-700' 
          : 'bg-white text-gray-800 hover:bg-gray-100'
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
};

export default ScrollToTop;
