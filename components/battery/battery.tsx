'use client';

import { useId } from 'react';
import { Fira_Code } from 'next/font/google';
import styles from './battery.module.css';

const firaCode = Fira_Code({ subsets: ['latin'] });

type Props = {
  percent: number;
  value: string;
};

export default function Battery(props: Props) {
  const batteryId = useId();

  return (
    <div className={styles.battery}>
      <label htmlFor={batteryId} className="visually-hidden">
        Battery
      </label>
      <div className={`${styles.batteryVis} ${firaCode.className}`}>
        <div
          className={`${styles.batteryFill} ${props.percent <= 20 ? styles.low : ''} ${
            props.percent <= 5 ? styles.veryLow : ''
          }`}
          style={{ height: props.percent + '%' }}
        />
        <div className={styles.batteryInfo}>
          <div
            className={styles.batteryPercent}
            style={{ '--targetPercent': props.percent } as React.CSSProperties}
            aria-label={props.percent + '%'}
          />
          <div
            className={styles.batteryValue}
            style={
              {
                '--targetValue': props.value.split('.')[0],
                '--targetValueDecimal': props.value.split('.')[1],
              } as React.CSSProperties
            }
            aria-label={props.value}
          />
        </div>
        <meter id={batteryId} min="0" max="100" value={props.percent} className="visually-hidden">
          {props.percent + '%'}
        </meter>
      </div>
    </div>
  );
}
