import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckSquare, LayoutDashboard, Users } from "lucide-react";

interface FeaturesSectionProps {
  dict: {
    title: string;
    taskManagement: { title: string; description: string };
    kanban: { title: string; description: string };
    teamCollaboration: { title: string; description: string };
  };
}

const icons = [CheckSquare, LayoutDashboard, Users];

export function FeaturesSection({ dict }: FeaturesSectionProps) {
  const features = [
    dict.taskManagement,
    dict.kanban,
    dict.teamCollaboration,
  ];

  return (
    <section className="bg-muted/40 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          {dict.title}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = icons[i];
            return (
              <Card key={i} className="border-0 bg-background shadow-sm">
                <CardHeader>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
