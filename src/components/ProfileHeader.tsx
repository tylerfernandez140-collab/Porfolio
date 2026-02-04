import { MapPin, Calendar, Mail, FileText, CheckCircle2, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  name: string;
  location: string;
  roles: string[];
  avatarUrl: string;
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
  return (
    <header className="flex flex-col md:flex-row items-center md:items-start gap-6">
      <img
        src={avatarUrl}
        alt={name}
        className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover"
      />
      
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
          <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
          <CheckCircle2 className="w-5 h-5 text-[#1d9bf0] fill-[#1d9bf0]" strokeWidth={0} />
        </div>
        
        <div className="flex items-center justify-center md:justify-start gap-1.5 text-muted-foreground mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>
        
        <div className="flex items-center justify-center md:justify-start gap-1 text-foreground mb-4">
          {roles.map((role, index) => (
            <span key={role} className="flex items-center">
              <span className="text-sm font-medium">{role}</span>
              {index < roles.length - 1 && <span className="text-muted-foreground mx-2">\</span>}
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
