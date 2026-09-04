import React from 'react';
import './FormField.css';

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  options,
  required = false,
  helperText
}) {
  const isSelect = type === 'select';

  return (
    <div className={`form-group ${error ? 'has-error' : ''}`}>
      <label htmlFor={name} className="form-label">
        {label} {required && <span className="required-star">*</span>}
      </label>

      {isSelect ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="form-control"
        >
          <option value="">-- Select {label} --</option>
          {options &&
            options.map((opt) => (
              <option key={opt.value || opt} value={opt.value || opt}>
                {opt.label || opt}
              </option>
            ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-control"
        />
      )}

      {helperText && !error && <small className="form-helper">{helperText}</small>}
      {error && <div className="form-error-msg">{error}</div>}
    </div>
  );
}
