'use client';

// TODO: Internationalize currency

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Fira_Code } from 'next/font/google';
import store from 'storejs';
import Battery from '@/components/battery/battery';
import CurrencyInput from '@/components/currencyInput/currencyInput';
import styles from './page.module.css';
import Image from 'next/image';
import logo from './logo.png';

const firaCode = Fira_Code({ subsets: ['latin'] });

export default function Home() {
  const [budget, setBudget] = useState(1);
  const [spent, setSpent] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<number[]>([]);
  const [isReading, setIsReading] = useState(true);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const addMoney = (e: FormEvent) => {
    e.preventDefault();
    setSpent(spent + Number(inputValue));
    setHistory([...history, spent + Number(inputValue)]);
    setInputValue('');
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

  const dialogRecharge = () => {
    recharge();
    dialogRef.current?.close();
  };

  useEffect(() => {
    setRemaining(budget - spent);
  }, [budget, spent]);

  useEffect(() => {
    if (!isReading) {
      store.set(
        'spent',
        JSON.stringify({
          spent,
          timestamp: new Date().toISOString(),
        })
      );
    }
  }, [isReading, spent]);

  useEffect(() => {
    const spentStore = store.get('spent');
    if (spentStore) {
      const weekStart = new Date();
      weekStart.setHours(0);
      weekStart.setMinutes(0);
      weekStart.setSeconds(0);
      weekStart.setMilliseconds(0);
      while (weekStart.getDay() > 0) {
        weekStart.setDate(weekStart.getDate() - 1);
      }
      const saved = JSON.parse(spentStore);
      if (new Date(saved.timestamp) <= weekStart) {
        dialogRef.current?.showModal();
      } else {
        setSpent(Number(saved.spent));
        setHistory([saved.spent]);
      }
    }
    const budgetStore = store.get('budget');
    if (budgetStore) {
      setBudget(Number(budgetStore));
    }
    setIsReading(false);
  }, []);

  return (
    <main className={`app-body ${styles.appLayout}`}>
      <nav className={styles.nav}>
        <h1 className={firaCode.className}>
          <Image src={logo} alt="budget battery" width={209} height={33} />
        </h1>
        <Link href="settings">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
            <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
          </svg>{' '}
          {/* Settings */}
        </Link>
      </nav>
      <dialog ref={dialogRef} className={styles.newWeekDialog}>
        <h2>Recharge?</h2>
        <p>Looks like its a new week! Do you want to recharge your battery?</p>
        <div className={styles.dialogActions}>
          <button className="button-subtle" onClick={() => dialogRef.current?.close()}>
            Close
          </button>
          <button className="button-primary" onClick={dialogRecharge}>
            Recharge
          </button>
        </div>
      </dialog>
      <div className={styles.battery}>
        <Battery percent={(remaining / budget) * 100} value={`($${(budget - spent).toFixed(2)})`} />
      </div>
      <div>
        <div className={styles.controls}>
          <button type="button" className="icon-action" onClick={undo} disabled={history.length <= 1}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
              <path d="M125.7 160l50.3 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L48 224c-17.7 0-32-14.3-32-32L16 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z" />
            </svg>
            Undo
          </button>
          <button type="button" className="icon-action" onClick={recharge} disabled={spent === 0}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor">
              <path d="M464 160c8.8 0 16 7.2 16 16l0 160c0 8.8-7.2 16-16 16L80 352c-8.8 0-16-7.2-16-16l0-160c0-8.8 7.2-16 16-16l384 0zM80 96C35.8 96 0 131.8 0 176L0 336c0 44.2 35.8 80 80 80l384 0c44.2 0 80-35.8 80-80l0-16c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l0-16c0-44.2-35.8-80-80-80L80 96zm368 96L96 192l0 128 352 0 0-128z" />
            </svg>
            Recharge
          </button>
        </div>
        <form className={styles.spendForm} onSubmit={addMoney}>
          <CurrencyInput
            label="Add money"
            isLabelVisible={false}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="button-primary">
            Spend
          </button>
        </form>
      </div>
    </main>
  );
}
