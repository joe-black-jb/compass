import { Description, Field, Input, Label } from "@headlessui/react";
import { classNames } from "../utils/funcs";

interface Props {
  description?: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField(props: Props) {
  const { description, label, value, onChange } = props;
  return (
    <div className="w-full max-w-md">
      <Field>
        {label && (
          <Label className="text-sm/6 font-medium text-gray-900">{label}</Label>
        )}
        {description && (
          <Description className="text-sm/6 text-gray-900">
            {description}
          </Description>
        )}
        <Input
          className={classNames(
            "mt-3 block w-full rounded-lg border-2 bg-white/5 py-1.5 px-3 text-sm/6 text-gray-900",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
          )}
          onChange={onChange}
          value={value}
        />
      </Field>
    </div>
  );
}
