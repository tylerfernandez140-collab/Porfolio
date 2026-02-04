import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AboutSectionProps {
  paragraphs: string[];
}

const AboutSection = ({ paragraphs }: AboutSectionProps) => {
  return (
    <Card className="border-border/50">
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
  );
};

export default AboutSection;
