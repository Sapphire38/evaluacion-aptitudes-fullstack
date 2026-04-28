import type { SelectHTMLAttributes } from "react";

interface Option {
  label: string;
  value: string;
}

interface Props extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const NativeSelect = ({
  label,
  options,
  value,
  onChange,
  error,
  className = "",
  ...rest
}: Props) => {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="prometeo-fonts-body-small text-neutral-strong-default">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-neutral-default-default border border-neutral-default-default rounded-md px-3 py-2 text-neutral-strong-default focus:outline-none focus:ring-2 focus:ring-primary-default-default"
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="prometeo-fonts-body-xsmall text-error-default-default">
          {error}
        </span>
      )}
    </label>
  );
};

export default NativeSelect;
