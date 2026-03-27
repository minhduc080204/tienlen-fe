type Props = {
  label: string;
  type?: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
};

export default function Input({
  label,
  type = "text",
  value,
  placeholder,
  onChange,
  className = "",
  inputClassName = "",
  labelClassName = "",
  onEnter,
}: Props) {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <label className={`text-xs text-gray-400 font-medium tracking-wide ${labelClassName}`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
        className={`
          bg-zinc-800/80 border border-zinc-700 rounded-lg
          px-3 py-2 text-white text-sm
          placeholder:text-zinc-500
          focus:outline-none focus:border-red-600/70
          focus:ring-1 focus:ring-red-600/50
          transition-colors
          ${inputClassName}
        `}
      />
    </div>
  );
}
