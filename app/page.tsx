'use client';

// TODO: Internationalize currency
// TODO: Use a better font

import Battery from '@/components/battery';
import styles from './page.module.css';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [budget, setBudget] = useState(200);
  const [spent, setSpent] = useState(0);
  const [remaining, setRemaining] = useState(budget - spent);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<number[]>([]);
  const [isReading, setIsReading] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const addMoney = (e: FormEvent) => {
    e.preventDefault();
    setSpent(spent + Number(inputValue));
    setHistory([...history, spent + Number(inputValue)]);
    setInputValue('');
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!Number.isNaN(Number(e.target.value))) {
      setInputValue(e.target.value);
    }
  };

  const undo = () => {
    const h = [...history];
    h.pop();
    const last = h.at(-1);
    if (last) {
      setSpent(last);
    }
    setHistory(h);
  };

  const recharge = () => {
    setSpent(0);
    setHistory([...history, 0]);
  };

  useEffect(() => {
    setRemaining(budget - spent);
  }, [budget, spent]);

  useEffect(() => {
    if (!isReading) {
      localStorage.setItem(
        'spent',
        JSON.stringify({
          spent,
          timestamp: new Date().toISOString(),
        })
      );
    }
  }, [isReading, spent]);

  useEffect(() => {
    const storage = localStorage.getItem('spent');
    if (storage) {
      const weekStart = new Date();
      weekStart.setHours(0);
      weekStart.setMinutes(0);
      weekStart.setSeconds(0);
      weekStart.setMilliseconds(0);
      while (weekStart.getDay() > 0) {
        weekStart.setDate(weekStart.getDate() - 1);
      }
      const saved = JSON.parse(storage);
      if (new Date(saved.timestamp) <= weekStart) {
        setSpent(0);
        setHistory([0]);
      } else {
        setSpent(Number(saved.spent));
        setHistory([saved.spent]);
      }
      setIsReading(false);
    }
  }, []);

  return (
    <main className={styles.main}>
      <h1>Welcome, Ash.</h1>
      <Battery percent={(remaining / budget) * 100} />
      <p>
        ${budget - spent} / ${budget} remaining
      </p>
      <div className={styles.controls}>
        <button type="button" className={styles.undo} onClick={undo} disabled={history.length <= 1}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
            <path d="M125.7 160l50.3 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L48 224c-17.7 0-32-14.3-32-32L16 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z" />
          </svg>
          Undo
        </button>
        <button type="button" className={styles.recharge} onClick={recharge} disabled={spent === 0}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor">
            <path d="M464 160c8.8 0 16 7.2 16 16l0 160c0 8.8-7.2 16-16 16L80 352c-8.8 0-16-7.2-16-16l0-160c0-8.8 7.2-16 16-16l384 0zM80 96C35.8 96 0 131.8 0 176L0 336c0 44.2 35.8 80 80 80l384 0c44.2 0 80-35.8 80-80l0-16c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l0-16c0-44.2-35.8-80-80-80L80 96zm368 96L96 192l0 128 352 0 0-128z" />
          </svg>
          Recharge
        </button>
      </div>
      <form className={styles.spendForm} onSubmit={addMoney}>
        <label className={styles.addMoney}>
          <span className="visually-hidden">Add money</span>
          <div className={styles.comboInput}>
            <div className={styles.comboInputPrefix}>$</div>
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              className={styles.comboInputField}
              value={inputValue}
              onChange={handleInput}
            />
          </div>
        </label>
        <button type="submit">Spend</button>
      </form>
    </main>
  );
}
