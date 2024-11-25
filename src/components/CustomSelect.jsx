import { Select, SelectItem } from "@nextui-org/react";
import React from "react";

const CustomSelect = ({
  register,
  label,
  placeholder,
  name,
  errorMessage,
  errors,
  options,
  value,
  onChange,
  ...rest
}) => {
  const isInvalid = errors[name];

  return (
    <Select
      {...(register
        ? register(name, {
            onChange: (e) => {
              if (onChange) onChange(e);
            },
          })
        : {})}
      label={label}
      placeholder={placeholder}
      value={value}
      defaultSelectedKeys={value ? [value] : undefined}
      name={name}
      errorMessage={isInvalid ? errorMessage : ""}
      variant="bordered"
      radius="sm"
      labelPlacement="outside"
      isRequired
      isInvalid={isInvalid}
      color={isInvalid ? "danger" : "primary"}
      classNames={{
        label: "text-black",
      }}
      {...rest}
    >
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
};

export default CustomSelect;
