import classNames from "classnames";

export default function Section({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={classNames(
        className,
        "bg-zinc-50 dark:bg-gradient-to-bl dark:from-dark-section-light dark:to-dark-section-dark rounded-lg p-8 flex flex-col gap-4 dark:text-white",
        "shadow-md"
      )}
      {...props}
    >
      {children}
    </section>
  );
}
