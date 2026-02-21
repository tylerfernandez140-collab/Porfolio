import { MapPin, Calendar, Mail, FileText, ChevronRight, ChevronDown, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState } from "react";

interface ProfileHeaderProps {
  name: string;
  location: string;
  roles: string[];
  avatarUrl: {
    light: string;
    dark: string;
    hoverLight: string;
    hoverDark: string;
    clickLight: string;
    clickDark: string;
  };
  email: string;
  calendlyUrl?: string;
  blogUrl?: string;
  achievement?: {
    text: string;
    link: string;
  };
}

const ProfileHeader = ({
  name,
  location,
  roles,
  avatarUrl,
  email,
  calendlyUrl,
  blogUrl,
  achievement,
}: ProfileHeaderProps) => {
  const { theme = "light", setTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  return (
    <header className="flex flex-row items-start gap-6">
      <div 
        className="w-40 h-40 md:w-40 md:h-40 relative border-0 border-none outline-none overflow-hidden rounded-lg cursor-pointer select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsClicked(false);
        }}
        onClick={() => setIsClicked(!isClicked)}
        style={{
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        {/* All images are rendered simultaneously, only one is visible at a time */}
        {/* Base images (lowest z-index) */}
        <img
          src={avatarUrl.light}
          alt={`${name} - light`}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-150 ease-out ${theme === "light" && !isHovered && !isClicked ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          fetchPriority="high"
          decoding="async"
        />
        <img
          src={avatarUrl.dark}
          alt={`${name} - dark`}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-150 ease-out ${theme === "dark" && !isHovered && !isClicked ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          fetchPriority="high"
          decoding="async"
        />
        
        {/* Hover images (middle z-index) */}
        <img
          src={avatarUrl.hoverLight}
          alt={`${name} - hover light`}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-150 ease-out ${theme === "light" && isHovered && !isClicked ? "opacity-100 z-20" : "opacity-0 z-0"}`}
          fetchPriority="high"
          decoding="async"
        />
        <img
          src={avatarUrl.hoverDark}
          alt={`${name} - hover dark`}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-150 ease-out ${theme === "dark" && isHovered && !isClicked ? "opacity-100 z-20" : "opacity-0 z-0"}`}
          fetchPriority="high"
          decoding="async"
        />
        
        {/* Click images (highest z-index) */}
        <img
          src={avatarUrl.clickLight}
          alt={`${name} - click light`}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-150 ease-out ${theme === "light" && isClicked ? "opacity-100 z-30" : "opacity-0 z-0"}`}
          fetchPriority="high"
          decoding="async"
        />
        <img
          src={avatarUrl.clickDark}
          alt={`${name} - click dark`}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-150 ease-out ${theme === "dark" && isClicked ? "opacity-100 z-30" : "opacity-0 z-0"}`}
          fetchPriority="high"
          decoding="async"
        />
      </div>
      
      <div className="flex-1 flex flex-col items-start">
        <div className="flex items-center justify-center md:justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
            <svg viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" aria-label="Verified user">
              <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" fill="#1d9bf0"></path>
            </svg>
          </div>
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-0 min-w-0 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
            aria-label="Toggle theme"
          >
            <div className={`absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`}>
              {theme === "light" ? (
                <Sun className="h-3 w-3 text-gray-500" fill="currentColor" />
              ) : (
                <Moon className="h-3 w-3 text-gray-500" fill="currentColor" />
              )}
            </div>
          </button>
        </div>
        
        <div className="flex items-center justify-center md:justify-start gap-1.5 text-muted-foreground mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>
        
        <div className="flex items-center justify-center md:justify-start gap-1 text-foreground mb-4">
          {roles.map((role, index) => (
            <span key={role} className="flex items-center">
              <span className="text-sm font-medium">{role}</span>
              {index < roles.length - 1 && <span className="text-muted-foreground px-1">|</span>}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          {calendlyUrl && (
            <Button asChild size="sm" className="gap-2 rounded-full">
              <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
                <Calendar className="w-4 h-4" />
                Schedule a Call
                <ChevronRight className="w-4 h-4" />
              </a>
            </Button>
          )}
          
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <a href={`mailto:${email}`}>
              <Mail className="w-4 h-4" />
              Send Email
            </a>
          </Button>
          
          {blogUrl && (
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <a href={blogUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4" />
                Read my blog
              </a>
            </Button>
          )}
        </div>
      </div>

      {achievement && (
        <a
          href={achievement.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
        >
          <span className="text-yellow-400">🏆</span>
          {achievement.text}
          <ChevronDown className="w-4 h-4" />
        </a>
      )}
    </header>
  );
};

export default ProfileHeader;
