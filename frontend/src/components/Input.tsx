const Input = ({
  label,
  type = "text",
  placeholder,
  required,
  isTextarea = false,
  rows = 5,
  onChange,
  readOnly,
  value,
  width,
  className,
  bgColor = "bg-white",
  labelClassName,
    min,
    max
}) => {
  const inputClassName = `p-2 border rounded-md ${
    className ? className : `${bgColor} text-gray-900 border-gray-300`
  } text-xs py-3 focus:outline-none`;

  return (
    <div className="flex flex-col" style={{ width }}>
      <label className={`text-sm font-medium mb-1 text-gray-700 ${className} ${labelClassName}`}>{label}</label>
      {isTextarea ? (
        <textarea
          placeholder={placeholder}
          required={required}
          rows={rows}
          onChange={(e) => onChange?.(e.target.value)}
          className={inputClassName}
          readOnly={readOnly}
          value={value}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          required={required}
          onChange={(e) => onChange?.(e.target.value)}
          className={inputClassName}
          readOnly={readOnly}
          value={value}
          min={min}
          max={max}
        />
      )}
    </div>
  );
};

export default Input;
