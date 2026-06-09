"use client";

import { useMemo, useRef, useState } from "react";
import { CheckCircle, SpinnerGap, XCircle } from "@phosphor-icons/react";

import { ConfirmDialog } from "@/components/admin/confirm-action-button";
import { buttonVariants } from "@/components/ui/button";
import {
  appointmentStatuses,
  type AppointmentStatus,
} from "@/lib/appointment-status";
import { cn } from "@/lib/utils";

const visibleStatuses = appointmentStatuses.filter(
  (status) => status !== "ANULATA",
);
const requestTimeoutMs = 20000;

async function parseError(response: Response) {
  const body = (await response.json().catch(() => null)) as {
    error?: unknown;
  } | null;

  return typeof body?.error === "string"
    ? body.error
    : "Statusul nu a putut fi actualizat.";
}

export function AppointmentStatusControls({
  appointmentId,
  initialStatus,
}: {
  appointmentId: string;
  initialStatus: AppointmentStatus;
}) {
  const [status, setStatus] = useState<AppointmentStatus>(initialStatus);
  const [pendingStatus, setPendingStatus] = useState<AppointmentStatus | null>(
    null,
  );
  const [confirmStatus, setConfirmStatus] = useState<AppointmentStatus | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const lastRequest = useRef(0);
  const isSaving = pendingStatus !== null;
  const helperText = useMemo(() => {
    if (pendingStatus) {
      return `Se salvează ${pendingStatus}...`;
    }

    if (error) {
      return error;
    }

    return "Status sincronizat";
  }, [error, pendingStatus]);

  async function changeStatus(nextStatus: AppointmentStatus) {
    if (nextStatus === status || isSaving) {
      return;
    }

    const previousStatus = status;
    const requestId = lastRequest.current + 1;
    lastRequest.current = requestId;
    setStatus(nextStatus);
    setPendingStatus(nextStatus);
    setError(null);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      controller.abort();
    }, requestTimeoutMs);

    try {
      const response = await fetch(
        `/admin/api/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      const body = (await response.json()) as { status?: string };

      if (lastRequest.current === requestId) {
        setStatus(
          appointmentStatuses.includes(body.status as AppointmentStatus)
            ? (body.status as AppointmentStatus)
            : nextStatus,
        );
      }
    } catch (caught) {
      if (lastRequest.current === requestId) {
        setStatus(previousStatus);
        setError(
          caught instanceof DOMException && caught.name === "AbortError"
            ? "Serverul nu a răspuns la timp. Statusul a fost restaurat."
            : caught instanceof Error
              ? caught.message
              : "Statusul nu a putut fi actualizat.",
        );
      }
    } finally {
      window.clearTimeout(timeout);

      if (lastRequest.current === requestId) {
        setPendingStatus(null);
      }
    }
  }

  function requestStatusChange(nextStatus: AppointmentStatus) {
    if (nextStatus === status || isSaving) {
      return;
    }

    setConfirmStatus(nextStatus);
  }

  function confirmStatusChange() {
    if (!confirmStatus) {
      return;
    }

    const nextStatus = confirmStatus;
    setConfirmStatus(null);
    void changeStatus(nextStatus);
  }

  return (
    <div className="mt-5 grid gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-pill bg-cloud px-3 py-1 text-xs font-semibold">
          {status}
        </span>
        <span
          className={cn(
            "inline-flex min-h-8 items-center gap-2 text-sm font-semibold",
            error ? "text-danger" : "text-slate-600",
          )}
          role={error ? "alert" : "status"}
        >
          {pendingStatus ? (
            <SpinnerGap aria-hidden className="h-4 w-4 animate-spin" />
          ) : error ? (
            <XCircle aria-hidden className="h-4 w-4" />
          ) : (
            <CheckCircle aria-hidden className="h-4 w-4" />
          )}
          {helperText}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {visibleStatuses.map((option) => (
          <button
            key={option}
            type="button"
            disabled={isSaving || option === status}
            onClick={() => requestStatusChange(option)}
            className={buttonVariants({
              variant: status === option ? "primary" : "secondary",
              size: "sm",
            })}
          >
            {option}
          </button>
        ))}
        <button
          type="button"
          disabled={isSaving || status === "ANULATA"}
          onClick={() => requestStatusChange("ANULATA")}
          className={buttonVariants({
            variant: "secondary",
            size: "sm",
            className:
              "border-danger text-danger hover:bg-danger hover:text-white",
          })}
        >
          <XCircle aria-hidden className="h-4 w-4" />
          Anulează
        </button>
      </div>

      <ConfirmDialog
        isOpen={confirmStatus !== null}
        title="Confirmi schimbarea statusului?"
        description={`Programarea va trece din ${status} în ${confirmStatus ?? ""}.`}
        confirmLabel="Schimbă status"
        confirmVariant={confirmStatus === "ANULATA" ? "secondary" : "primary"}
        onConfirm={confirmStatusChange}
        onCancel={() => setConfirmStatus(null)}
      />
    </div>
  );
}
