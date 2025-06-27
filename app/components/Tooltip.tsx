import React, { ReactNode, useState } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className = "",
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
    >
      {children}
      {visible && (
        <span className="absolute z-50 px-3 py-2 text-xs font-medium text-white transition-all duration-150 -translate-x-1/2 -translate-y-full bg-gray-900 rounded shadow-lg pointer-events-none whitespace-nowrap -top-2 left-1/2 opacity-90">
          {content}
        </span>
      )}
    </span>
  );
};

export default Tooltip;
