import { FaExclamationTriangle, FaRedo } from "react-icons/fa";
import { Button } from '@/components/ui/button';

type ErrorMessageProps = {
    message?: string;
    onRetry?: () => void;
    showRetryButton?: boolean;
};

export function ErrorMessage({
    message = "Something went wrong while loading the data.",
    onRetry,
    showRetryButton = true
}: ErrorMessageProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center max-w-md mx-auto">
            <div className="mb-4 p-3 bg-red-100 rounded-full">
                <FaExclamationTriangle className="text-4xl text-red-500" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Oops! Error</h3>
            <p className="text-gray-600 mb-6">{message}</p>

            {showRetryButton && onRetry && (
                <Button
                    onClick={onRetry}
                    variant={"destructive"}
                >
                    <FaRedo />
                    Try Again
                </Button>
            )}
            <p className="mt-4 text-sm text-gray-500">
                If this problem persists, please contact support.
            </p>
        </div>
    );
}