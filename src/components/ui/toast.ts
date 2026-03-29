import toast from "react-hot-toast";

const baseClassName = "!rounded-lg md:!rounded-xl !px-2 md:!px-3 !py-1 md:!py-2 !text-sm md:!text-base";

const baseStyle = {
  background: "rgba(15,15,15,0.95)",
  color: "#fff",
  border: "1px solid rgba(220,38,38,0.6)",
  boxShadow: "0 0 20px rgba(220,38,38,0.35)",
};

export const gameToast = {
  success: (message: string) =>
    toast.success(`${message}`, {
      style: {
        ...baseStyle,
        borderColor: "rgb(34 197 94)",
        boxShadow: "0 0 20px rgba(34,197,94,0.35)",
      },
      className: baseClassName,
    }),

  error: (message: string) =>
    toast.error(`${message}`, {
      style: {
        ...baseStyle,
        borderColor: "rgb(239 68 68)",
        boxShadow: "0 0 20px rgba(239,68,68,0.4)",
      },
      className: baseClassName,
    }),

  info: (message: string) =>
    toast(message, {
      icon: "♠",
      style: baseStyle,
      className: baseClassName,
    }),

  loading: (message: string) =>
    toast.loading(`⏳ ${message}`, {
      style: baseStyle,
      className: baseClassName,
    }),

  dismiss: toast.dismiss,
};
