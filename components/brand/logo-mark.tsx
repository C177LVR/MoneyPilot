import Image from "next/image";
import { cn } from "@/lib/utils";

/** The Money Pilot compass mark (icon only, no wordmark), transparent background. */
export function LogoMark({
  size = 36,
  priority = false,
  className,
}: {
  size?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src="/logo-icon.png"
      alt="Money Pilot"
      width={size}
      height={size}
      priority={priority}
      className={cn("shrink-0", className)}
    />
  );
}
