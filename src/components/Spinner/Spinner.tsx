import styles from './Spinner.module.scss';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export const Spinner = ({ size = 40, className = '' }: SpinnerProps) => (
  <div
    className={`${styles.spinner} ${className}`}
    style={{ width: size, height: size }}
    role="status"
    aria-label="Loading"
  />
);
