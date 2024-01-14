'use client';

import styles from '../styles';
import Image, { StaticImageData } from 'next/image';

type ActionButtonProps = {
  imgUrl: StaticImageData;
  handleClick: () => void;
  restStyles: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  imgUrl,
  handleClick,
  restStyles,
}) => (
  <div
    className={`${styles.gameMoveBox} ${styles.flexCenter} ${styles.glassEffect} ${restStyles} `}
    onClick={handleClick}
  >
    <Image
      src={imgUrl}
      alt='action_img'
      className={styles.gameMoveIcon}
    />
  </div>
);

export default ActionButton;
