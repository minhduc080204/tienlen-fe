type Props = {
  label: string;
  type?: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
};

export default function Input({
  label,
  type = "text",
  value,
  placeholder,
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="
          bg-zinc-800 border border-zinc-700 rounded-lg
          px-4 py-2 text-white
          focus:outline-none
          focus:ring-2 focus:ring-red-600
        "
      />
    </div>
  );
}
