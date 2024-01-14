import styles from '@/styles';

type CustomButtonProps = {
  title: string;
  handleClick: () => void;
  restStyles?: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handleClick,
  restStyles,
}) => (
  <button
    type='button'
    className={`${styles.btn} ${restStyles}`}
    onClick={handleClick}
  >
    {title}
  </button>
);

export default CustomButton;
