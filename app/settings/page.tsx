'use client';

import store from 'storejs';
import CurrencyInput from '@/components/currencyInput/currencyInput';
import { ChangeEvent, useEffect, useState } from 'react';

import styles from './page.module.css';
import Link from 'next/link';

export default function Settings() {
  const [budget, setBudget] = useState('');

  const updateBudget = (e: ChangeEvent<HTMLInputElement>) => {
    store.set('budget', e.target.value);
    setBudget(e.target.value);
  };

  useEffect(() => {
    const budgetStore = store.get('budget');
    if (budgetStore) {
      setBudget(budgetStore);
    }
  }, []);

  return (
    <div className="app-body">
      <header>
        <nav className={styles.backNav}>
          <Link href="/" className="icon-action">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
            Back to battery
          </Link>
        </nav>
      </header>
      <main>
        <h1 className="visually-hidden">Settings</h1>
        <div className={styles.settings}>
          <CurrencyInput label="Budget" value={budget} onChange={updateBudget} />
        </div>
      </main>
    </div>
  );
}
