"use client";

import { useId, useRef, useState } from "react";
import type React from "react";
import { WarningCircle } from "@phosphor-icons/react";
import { useFormStatus } from "react-dom";

import { buttonVariants, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmActionButtonProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
};

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  confirmVariant?: ButtonProps["variant"];
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = "Renunță",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-navy-950/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint-100 text-navy-800">
            <WarningCircle aria-hidden className="h-5 w-5" />
          </span>
          <div>
            <h2 id={titleId} className="text-xl font-bold text-navy-900">
              {title}
            </h2>
            <p id={descriptionId} className="mt-2 text-sm text-slate-600">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={buttonVariants({ variant: "secondary", size: "sm" })}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={buttonVariants({
              variant: confirmVariant,
              size: "sm",
              className: cn(
                confirmVariant === "secondary" &&
                  "border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white",
              ),
            })}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmActionButton({
  children,
  title = "Confirmă operațiunea",
  description = "Modificările vor fi salvate imediat.",
  confirmLabel = "Confirmă",
  cancelLabel = "Renunță",
  variant = "primary",
  size = "sm",
  className,
}: ConfirmActionButtonProps) {
  const { pending } = useFormStatus();
  const [isOpen, setIsOpen] = useState(false);
  const submitRef = useRef<HTMLButtonElement>(null);

  function confirm() {
    setIsOpen(false);
    submitRef.current?.form?.requestSubmit(submitRef.current);
  }

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => setIsOpen(true)}
        className={buttonVariants({ variant, size, className })}
      >
        {pending ? "Se salvează..." : children}
      </button>
      <button ref={submitRef} type="submit" className="sr-only" tabIndex={-1}>
        Trimite
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        confirmVariant={variant}
        onConfirm={confirm}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}
