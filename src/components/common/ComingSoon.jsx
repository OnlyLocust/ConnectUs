"use client";

import { Clock, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function ComingSoonBox({
  featureName = "This feature",
  expectedDate = "soon",
  className = "",
}) {
  return (
    <Card className={`max-w-md mx-auto text-center ${className}`}>
      <CardHeader className="pb-2">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Construction className="h-8 w-8 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-semibold tracking-tight">
          {featureName} is coming soon!
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We're working hard to bring you this exciting new feature. Stay tuned
          for updates!
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-600">
          <Clock className="h-4 w-4" />
          <span>Expected: {expectedDate}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="outline" className="rounded-full">
          Notify me when available
        </Button>
      </CardFooter>
    </Card>
  );
}

// Example usage:
// <ComingSoonBox featureName="Dark Mode" expectedDate="Q3 2024" />