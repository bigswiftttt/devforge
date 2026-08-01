import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-lg relative overflow-hidden">
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(at 0% 0%, oklch(0.87 0.15 195 / 6%) 0px, transparent 50%), radial-gradient(at 100% 100%, oklch(0.87 0.15 195 / 6%) 0px, transparent 50%)",
                }}
            />
            <Suspense fallback={null}>
                <LoginForm />
            </Suspense>
        </div>
    );
}