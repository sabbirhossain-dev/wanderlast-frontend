"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EditDestination from "./EditDestination";
import DeleteDestination from "./DeleteDestination";

type DestinationActionsProps = {
  destinationId: string;
  /** "row" = buttons side by side, "stack" = full-width stacked (pricing card). */
  layout?: "row" | "stack";
};

type DeleteState = "idle" | "deleting";

function DestinationActions({
  destinationId,
  layout = "row",
}: DestinationActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState<DeleteState>("idle");
  const [error, setError] = useState<string | null>(null);

  const isDeleting = status === "deleting";
  const wrapperClass =
    layout === "stack"
      ? "flex w-full flex-col gap-3"
      : "flex w-full flex-wrap items-center gap-3";
  const itemClass = layout === "stack" ? "w-full justify-center" : "";

  return (
    <div className={wrapperClass}>
      <div
        className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted ${itemClass}`}
      >
        <EditDestination destinationId={destinationId} />
      </div>

      <div
        className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted ${itemClass}`}
      >
        <DeleteDestination destinationId={destinationId} />
      </div>

      {error ? (
        <p
          role="alert"
          className="w-full text-xs leading-relaxed text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { DestinationActions };
