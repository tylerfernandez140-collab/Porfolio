import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AboutSectionProps {
  paragraphs: string[];
  featuredImage?: {
    src: string;
    alt: string;
    link?: string;
  };
}

const AboutSection = ({ paragraphs, featuredImage }: AboutSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 border-border/50">
        <CardContent className="p-6">
          <h2 className="section-title">
            <User className="w-5 h-5" />
            About
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      {featuredImage && (
        <div className="lg:col-span-1">
          {featuredImage.link ? (
            <a href={featuredImage.link} target="_blank" rel="noopener noreferrer">
              <img
                src={featuredImage.src}
                alt={featuredImage.alt}
                className="w-full h-auto rounded-xl shadow-sm hover:shadow-md transition-shadow"
              />
            </a>
          ) : (
            <img
              src={featuredImage.src}
              alt={featuredImage.alt}
              className="w-full h-auto rounded-xl shadow-sm"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AboutSection;
