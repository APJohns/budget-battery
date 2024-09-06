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
      <div className={styles.batteryVis}>
        <div
          className={`${styles.batteryFill} ${props.percent <= 20 ? styles.low : ''} ${
            props.percent <= 5 ? styles.veryLow : ''
          }`}
          style={{ width: props.percent + '%' }}
        />
        <div className={styles.batteryPercent}>{props.percent.toFixed(0)}%</div>
        <meter id={batteryId} min="0" max="100" value={props.percent} className="visually-hidden">
          {props.percent + '%'}
        </meter>
      </div>
    </div>
  );
}
