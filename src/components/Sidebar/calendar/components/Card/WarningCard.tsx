import type { WarningCardProps } from "@/components/Sidebar/calendar/components/Card/types/warning-card.types";
import { Card } from "@/components/ui/card";

/**
 * Displays a warning message in the calendar when there are no events or when the user is not logged in to Microsoft.
 *
 * @param message - The warning message to display.
 *
 * @returns A styled card component containing the warning message.
 */
export function WarningCard({ message }: WarningCardProps) {
  return (
    <Card className="text-center border-2 border-dashed">
      <p className="p-1 text-sm text-muted-foreground">{message}</p>
    </Card>
  );
}
