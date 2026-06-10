import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  className?: string;
  titleAs?: "h1" | "h2";
};

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  className,
  titleAs = "h2",
}: SectionHeadingProps) {
  const Title = titleAs;

  return (
    <div
      className={cn(
        "max-w-[65ch]",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase text-navy-700">
          {eyebrow}
        </p>
      ) : null}
      <Title className="mt-3 font-display text-3xl font-semibold text-navy-900 md:text-4xl">
        {title}
      </Title>
      {text ? <p className="mt-4 text-lg text-slate-600">{text}</p> : null}
    </div>
  );
}
