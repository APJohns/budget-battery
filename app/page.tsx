'use client';

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
    setSpent(last ? last : 0);
    setHistory(h);
  };

  useEffect(() => {
    setRemaining(budget - spent);
  }, [budget, spent]);

  useEffect(() => {
    localStorage.setItem(
      'spent',
      JSON.stringify({
        spent,
        timestamp: new Date().toISOString(),
      })
    );
  }, [spent]);

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
      } else {
        setSpent(Number(saved.spent));
      }
    }
  }, []);

  return (
    <main className={styles.main}>
      <h1>Welcome, Ash.</h1>
      <Battery percent={(remaining / budget) * 100} />
      <p>
        ${budget - spent} / ${budget} remaining
      </p>
      <form onSubmit={addMoney}>
        <label className={styles.addMoney}>
          <span className="visually-hidden">Add money</span>
          <input ref={inputRef} type="text" inputMode="numeric" autoFocus value={inputValue} onChange={handleInput} />
        </label>
        <button type="button" onClick={undo} disabled={history.length === 0}>
          Undo
        </button>
      </form>
    </main>
  );
}
