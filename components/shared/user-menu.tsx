"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function UserMenu() {
    const { user, signOut } = useAuth();

    if (!user) return null;

    return (
        <div className="flex items-center gap-3">
            <img
                src={user.user_metadata?.avatar_url}
                alt={user.user_metadata?.full_name ?? "User avatar"}
                className="size-8 rounded-full"
            />
            <span className="text-body-sm text-foreground">
                {user.user_metadata?.full_name ?? user.email}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
                Log out
            </Button>
        </div>
    );
}