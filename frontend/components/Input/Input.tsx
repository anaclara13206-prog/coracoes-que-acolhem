import "./Input.css";
interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  min?: string | number;
  step?: string | number;
  max?: string | number;
  maxLength?: number;
  minLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}
export default function Input({ label, type = "text", placeholder, name, value, onChange, disabled = false, required = false, min, max, step, maxLength, minLength, inputMode }: InputProps) {
  return (<div className="input-group">
    <label>{label}</label>
    <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled} required={required} min={min} max={max} step={step} maxLength={maxLength} minLength={minLength} inputMode={inputMode} />
  </div>);
}
