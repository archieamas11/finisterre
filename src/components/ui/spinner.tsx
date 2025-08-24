import { LoaderIcon } from "lucide-react";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return <LoaderIcon className={className ? `animate-spin ${className}` : "animate-spin"} />;
}

export default Spinner;
