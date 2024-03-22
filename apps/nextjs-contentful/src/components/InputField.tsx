import { ChangeEvent } from "react";

type InputFieldProps = {
  id: string;
  label: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

export function InputField(props: InputFieldProps) {
  const { id, label, value, onChange, disabled } = props;
  return (
    <div className="pb-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <input
        type="text"
        id={id}
        className="block w-64 rounded-md border-0 py-2 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 "
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};
