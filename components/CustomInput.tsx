import styles from '@/styles';

const regex = /^[A-Za-z0-9]+$/;

type CustomInputProps = {
  label: string;
  placeHolder: string;
  value: string;
  handleValueChange: (value: string) => void;
};

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeHolder,
  value,
  handleValueChange,
}) => (
  <>
    <label
      htmlFor='name'
      className={styles.label}
    >
      {label}
    </label>
    <input
      type='text'
      placeholder={placeHolder}
      value={value}
      onChange={(e) => {
        if (e.target.value === '' || regex.test(e.target.value))
          handleValueChange(e.target.value);
      }}
      className={styles.input}
    />
  </>
);

export default CustomInput;
