import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16 px-lg gap-md">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                <Icon className="size-8 text-muted-foreground" />
            </div>
            <div className="space-y-1 w-full max-w-[24rem]">
                <h3 className="text-headline-sm text-foreground">{title}</h3>
                <p className="text-body-md text-muted-foreground">{description}</p>
            </div>
            {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
        </div>
    );
}