// src/index.tsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
var Button = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-400"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      className: cn(baseStyle, variants[variant], sizes[size], className),
      ...props,
      children
    }
  );
};
var Card = ({
  title,
  subtitle,
  className,
  children,
  ...props
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "bg-white border border-gray-200 rounded-lg shadow-sm p-5",
        className
      ),
      ...props,
      children: [
        (title || subtitle) && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          title && /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900", children: title }),
          subtitle && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: subtitle })
        ] }),
        /* @__PURE__ */ jsx("div", { children })
      ]
    }
  );
};
var Input = ({
  label,
  error,
  id,
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-1 w-full", children: [
    label && /* @__PURE__ */ jsx("label", { htmlFor: id, className: "text-sm font-medium text-gray-700", children: label }),
    /* @__PURE__ */ jsx(
      "input",
      {
        id,
        className: cn(
          "px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm",
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300",
          className
        ),
        ...props
      }
    ),
    error && /* @__PURE__ */ jsx("span", { className: "text-xs text-red-500 mt-1", children: error })
  ] });
};
var Spinner = ({
  size = "md",
  color = "blue",
  className,
  ...props
}) => {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4"
  };
  const colors = {
    blue: "border-blue-200 border-t-blue-600",
    gray: "border-gray-200 border-t-gray-600",
    white: "border-white/30 border-t-white"
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "animate-spin rounded-full border-solid",
        sizes[size],
        colors[color],
        className
      ),
      ...props
    }
  );
};
var Modal = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0", children: [
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 transition-opacity", onClick: onClose, children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gray-500 opacity-75" }) }),
    /* @__PURE__ */ jsx("span", { className: "hidden sm:inline-block sm:align-middle sm:h-screen", children: "\u200B" }),
    /* @__PURE__ */ jsxs("div", { className: "inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pb-3 border-b border-gray-200 mb-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium leading-6 text-gray-900", children: title }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: onClose,
            className: "bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500",
            children: [
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" }),
              /* @__PURE__ */ jsx("span", { className: "text-xl", children: "\xD7" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { children })
    ] })
  ] }) });
};
var Toast = ({
  message,
  type = "info",
  onClose
}) => {
  const bgColors = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white"
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "fixed bottom-4 right-4 flex items-center p-4 rounded-md shadow-lg space-x-3 z-50",
        bgColors[type]
      ),
      children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: message }),
        onClose && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "text-white hover:text-gray-200 font-bold focus:outline-none",
            children: "\xD7"
          }
        )
      ]
    }
  );
};
var Navigation = ({ brandName, links }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return /* @__PURE__ */ jsxs("nav", { className: "bg-gray-900 text-white shadow-md", children: [
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 font-bold text-xl tracking-tight text-blue-400", children: brandName }),
        /* @__PURE__ */ jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsx("div", { className: "ml-10 flex items-baseline space-x-4", children: links.map((link) => /* @__PURE__ */ jsx(
          "a",
          {
            href: link.href,
            className: "px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all",
            children: link.label
          },
          link.label
        )) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setIsOpen(!isOpen),
          className: "inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none",
          children: [
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open main menu" }),
            /* @__PURE__ */ jsx("span", { className: "text-2xl", children: isOpen ? "\u2715" : "\u2630" })
          ]
        }
      ) })
    ] }) }),
    isOpen && /* @__PURE__ */ jsx("div", { className: "md:hidden bg-gray-800 px-2 pt-2 pb-3 space-y-1 sm:px-3", children: links.map((link) => /* @__PURE__ */ jsx(
      "a",
      {
        href: link.href,
        className: "block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700",
        children: link.label
      },
      link.label
    )) })
  ] });
};
var BaseLayout = ({
  brandName,
  links,
  children
}) => {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col bg-gray-50 text-gray-900", children: [
    /* @__PURE__ */ jsx(Navigation, { brandName, links }),
    /* @__PURE__ */ jsx("main", { className: "flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8", children }),
    /* @__PURE__ */ jsxs("footer", { className: "bg-gray-100 border-t border-gray-200 py-6 text-center text-sm text-gray-500", children: [
      "\xA9 ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " ",
      brandName,
      ". All rights reserved."
    ] })
  ] });
};
var LoadingPage = () => {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center bg-gray-50", children: [
    /* @__PURE__ */ jsx(Spinner, { size: "lg", color: "blue" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-gray-700 animate-pulse", children: "Loading AI Mentor..." }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 mt-2", children: "Getting things ready for you" })
  ] });
};
var ErrorPage = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again or contact support if the issue persists.",
  onReset
}) => {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full text-center space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "text-red-500 text-6xl font-extrabold", children: "\u26A0\uFE0F" }),
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-950", children: title }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: message }),
    onReset && /* @__PURE__ */ jsx(Button, { onClick: onReset, variant: "primary", children: "Try Again" })
  ] }) });
};
export {
  BaseLayout,
  Button,
  Card,
  ErrorPage,
  Input,
  LoadingPage,
  Modal,
  Navigation,
  Spinner,
  Toast,
  cn
};
