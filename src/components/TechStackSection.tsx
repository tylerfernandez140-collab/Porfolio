import { Layers, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TechCategory {
  name: string;
  items: string[];
}

interface TechStackSectionProps {
  categories: TechCategory[];
  className?: string;
  showAll?: boolean;
  onToggle?: () => void;
}

const TechStackSection = ({ 
  categories, 
  className, 
  showAll = false, 
  onToggle 
}: TechStackSectionProps) => {
  const getVisibleItems = (category: TechCategory) => {
    return category.items;
  };

  const shouldShowViewAll = () => {
    return categories.some(category => 
      (category.name === "Frontend" || category.name === "Backend") && 
      category.items.length > 5 && 
      !showAll
    );
  };

  return (
    <Card className={`border border-gray-300 shadow-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:-translate-y-1 ${className || ''}`}>
      <CardContent className="p-5 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">
            <Layers className="w-5 h-5" />
            Tech Stack
          </h2>
          {shouldShowViewAll() && (
            <button 
              onClick={onToggle}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-start gap-y-2">
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getVisibleItems(category).map((item) => (
                    <span key={item} className="tech-badge">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechStackSection;
