import { MapPin, Calendar, Mail, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  name: string;
  location: string;
  roles: string[];
  avatarUrl: string;
  email: string;
  calendlyUrl?: string;
  blogUrl?: string;
}

const ProfileHeader = ({
  name,
  location,
  roles,
  avatarUrl,
  email,
  calendlyUrl,
  blogUrl,
}: ProfileHeaderProps) => {
  return (
    <header className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
      <img
        src={avatarUrl}
        alt={name}
        className="w-32 h-32 md:w-36 md:h-36 rounded-2xl object-cover shadow-sm"
      />
      
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
          <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
          <CheckCircle2 className="w-5 h-5 text-accent fill-accent/20" />
        </div>
        
        <div className="flex items-center justify-center md:justify-start gap-1.5 text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>
        
        <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-4">
          {roles.map((role, index) => (
            <span key={role} className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{role}</span>
              {index < roles.length - 1 && <span className="text-border">|</span>}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          {calendlyUrl && (
            <Button asChild size="sm" className="gap-2">
              <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
                <Calendar className="w-4 h-4" />
                Schedule a Call
              </a>
            </Button>
          )}
          
          <Button asChild variant="outline" size="sm" className="gap-2">
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
    </header>
  );
};

export default ProfileHeader;
