import toast from "react-hot-toast";

const baseStyle = {
  background: "rgba(15,15,15,0.95)",
  color: "#fff",
  borderRadius: "12px",
  padding: "12px 16px",
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
    }),

  error: (message: string) =>
    toast.error(`${message}`, {
      style: {
        ...baseStyle,
        borderColor: "rgb(239 68 68)",
        boxShadow: "0 0 20px rgba(239,68,68,0.4)",
      },
    }),

  info: (message: string) =>
    toast(message, {
      icon: "♠",
      style: baseStyle,
    }),

  loading: (message: string) =>
    toast.loading(`⏳ ${message}`, {
      style: baseStyle,
    }),

  dismiss: toast.dismiss,
};
