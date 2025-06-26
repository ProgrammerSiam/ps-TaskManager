import React from "react";
import { motion } from "framer-motion";

// Extend props to support Framer Motion
interface MotionProps {
  asMotion?: boolean;
  whileHover?: any;
  whileTap?: any;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
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

function filterButtonProps(props: any) {
  // Only allow valid button props
  const {
    type,
    disabled,
    onClick,
    form,
    value,
    name,
    autoFocus,
    tabIndex,
    ...rest
  } = props;
  return { type, disabled, onClick, form, value, name, autoFocus, tabIndex };
}

function filterAnchorProps(props: any) {
  // Only allow valid anchor props
  const { href, target, rel, download, tabIndex, onClick, ...rest } = props;
  return { href, target, rel, download, tabIndex, onClick };
}

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
      ...props
    },
    ref
  ) => {
    const sharedClass =
      "px-3 py-1 rounded border bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition " +
      className;

    if (as === "a" && href) {
      const anchorProps = filterAnchorProps({ ...props, href });
      if (asMotion) {
        return (
          <motion.a
            ref={ref as React.Ref<HTMLAnchorElement>}
            className={sharedClass}
            whileHover={whileHover}
            whileTap={whileTap}
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
            {...anchorProps}
          >
            {children}
          </motion.a>
        );
      }
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={sharedClass}
          {...anchorProps}
        >
          {children}
        </a>
      );
    }
    // Default to button
    const buttonProps = filterButtonProps(props);
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
          {...buttonProps}
        >
          {children}
        </motion.button>
      );
    }
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={sharedClass}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
