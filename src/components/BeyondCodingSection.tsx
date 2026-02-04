import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface BeyondCodingSectionProps {
  paragraphs: string[];
}

const BeyondCodingSection = ({ paragraphs }: BeyondCodingSectionProps) => {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <h2 className="section-title">
          <Sparkles className="w-5 h-5" />
          Beyond Coding
        </h2>
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BeyondCodingSection;
