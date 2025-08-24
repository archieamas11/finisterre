import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

import { Button } from "@/components/ui/button";

type ErrorMessageProps = {
  message?: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
};

export function ErrorMessage({ message = "Something went wrong while loading the data.", onRetry, showRetryButton = true }: ErrorMessageProps) {
  return (
    <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 rounded-full bg-red-100 p-3">
        <FaExclamationTriangle className="text-4xl text-red-500" aria-hidden="true" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-800">Oops! Error</h3>
      <p className="mb-6 text-gray-600">{message}</p>

      {showRetryButton && onRetry && (
        <Button onClick={onRetry} variant={"destructive"}>
          <FaRedo />
          Try Again
        </Button>
      )}
      <p className="mt-4 text-sm text-gray-500">If this problem persists, please contact support.</p>
    </div>
  );
}
