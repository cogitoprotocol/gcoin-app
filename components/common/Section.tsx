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
        "bg-gradient-to-bl from-light-section-light to-light-section-dark dark:bg-gradient-to-bl dark:from-dark-section-light dark:to-dark-section-dark rounded-lg p-8 flex flex-col gap-4 dark:text-white"
      )}
      {...props}
    >
      {children}
    </section>
  );
}
