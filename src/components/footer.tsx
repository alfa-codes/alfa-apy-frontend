import clsx from "clsx";

export function Footer({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        className,
        "flex justify-between py-[20px] md:py-[30px]"
      )}
    >
      <span>© 2025 AlphaAPY. All rights reserved.</span>
    </div>
  );
}
