export function Footer() {
  return (
    <footer className="px-16 py-8 flex items-center justify-between border-t border-black dark:border-white border-opacity-20 dark:border-opacity-10">
      <div className="text-xs text-black dark:text-white opacity-40">
        © {new Date().getFullYear()} Cogito Protocol
      </div>
    </footer>
  );
}
