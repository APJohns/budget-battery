import { ChangeEvent, InputHTMLAttributes, useEffect, useState } from 'react';
import styles from './currencyInput.module.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isLabelVisible?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function CurrencyInput({ onChange, label, isLabelVisible = true, value, ...props }: Props) {
  const [inputValue, setInputValue] = useState('');

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!Number.isNaN(Number(e.target.value))) {
      setInputValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    }
  };

  useEffect(() => {
    setInputValue(value as string);
  }, [value]);

  return (
    <label className={styles.addMoney}>
      <div className={`${styles.comboInputLabel}${isLabelVisible ? '' : ' visually-hidden'}`}>{label}</div>
      <div className={styles.comboInput}>
        <div className={styles.comboInputPrefix}>$</div>
        <input
          type="text"
          inputMode="decimal"
          className={styles.comboInputField}
          value={inputValue}
          onChange={handleInput}
          {...props}
        />
      </div>
    </label>
  );
}
