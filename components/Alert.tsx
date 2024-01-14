import { AlertIcon } from '@/public/assets';
import styles from '@/styles';
import { AlertStyleKeys } from '@/types';

type AlertProps = {
  type: AlertStyleKeys;
  message: string;
};

const Alert: React.FC<AlertProps> = ({ type, message }) => (
  <div className={`${styles.alertContainer} ${styles.flexCenter}`}>
    <div
      className={`${styles.alertWrapper} ${styles[type]}`}
      role='alert'
    >
      <AlertIcon type={type} /> {message}
    </div>
  </div>
);

export default Alert;
