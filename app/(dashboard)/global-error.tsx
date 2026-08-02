"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className="bg-black text-white flex items-center justify-center min-h-screen">
                <div className="text-center space-y-md p-lg">
                    <h2 className="text-2xl font-bold">Something went wrong</h2>
                    <p className="text-zinc-400">{error.message || "A critical error occurred."}</p>
                    <button
                        onClick={reset}
                        className="px-4 py-2 bg-cyan-500 text-black rounded font-bold"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}