'use client';

import { useId } from 'react';
import styles from './battery.module.css';

type Props = {
  percent: number;
};

export default function Battery(props: Props) {
  const batteryId = useId();

  return (
    <div className={styles.battery}>
      <label htmlFor={batteryId} className="visually-hidden">
        Battery
      </label>
      <div
        className={styles.batteryVis}
        style={{
          background: `linear-gradient(to right, var(--battery-foreground) ${props.percent}%, var(--battery-background) ${props.percent}%)`,
        }}
      >
        {props.percent}%
        <meter id={batteryId} min="0" max="100" value={props.percent} className="visually-hidden">
          {props.percent + '%'}
        </meter>
      </div>
    </div>
  );
}
