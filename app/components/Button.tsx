import React from "react";
import { motion } from "framer-motion";

// Extend props to support Framer Motion
interface MotionProps {
  asMotion?: boolean;
  whileHover?: React.ComponentProps<typeof motion.button>["whileHover"];
  whileTap?: React.ComponentProps<typeof motion.button>["whileTap"];
  initial?: React.ComponentProps<typeof motion.button>["initial"];
  animate?: React.ComponentProps<typeof motion.button>["animate"];
  exit?: React.ComponentProps<typeof motion.button>["exit"];
  transition?: React.ComponentProps<typeof motion.button>["transition"];
}

type ButtonBaseProps = {
  children: React.ReactNode;
  className?: string;
  as?: "button" | "a";
  href?: string;
} & MotionProps;

type ButtonProps = ButtonBaseProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  > &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">;

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      children,
      className = "",
      as = "button",
      href,
      asMotion = false,
      whileHover,
      whileTap,
      initial,
      animate,
      exit,
      transition,
      onClick,
      disabled,
      type,
      ...props
    },
    ref
  ) => {
    const sharedClass =
      "px-3 py-1 rounded border bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition " +
      className;

    if (as === "a" && href) {
      if (asMotion) {
        return (
          <motion.a
            ref={ref as React.Ref<HTMLAnchorElement>}
            className={sharedClass}
            href={href}
            whileHover={whileHover}
            whileTap={whileTap}
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
            onClick={onClick}
          >
            {children}
          </motion.a>
        );
      }
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={sharedClass}
          href={href}
          onClick={onClick}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }
    // Default to button
    if (asMotion) {
      return (
        <motion.button
          ref={ref as React.Ref<HTMLButtonElement>}
          className={sharedClass}
          whileHover={whileHover}
          whileTap={whileTap}
          initial={initial}
          animate={animate}
          exit={exit}
          transition={transition}
          onClick={onClick}
          disabled={disabled}
          type={type}
        >
          {children}
        </motion.button>
      );
    }
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={sharedClass}
        onClick={onClick}
        disabled={disabled}
        type={type}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
