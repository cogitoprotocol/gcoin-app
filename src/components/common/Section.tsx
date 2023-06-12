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
        "rounded-lg shadow-md bg-zinc-50 dark:bg-gradient-to-bl dark:from-dark-section-light dark:to-dark-section-dark dark:text-white"
      )}
      {...props}
    >
      {children}
    </section>
  );
}
