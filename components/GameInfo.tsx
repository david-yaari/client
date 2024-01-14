'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import CustomButton from './CustomButton';
import { useGlobalContext } from '@/context';
import { alertIcon, gameRules } from '@/public/assets';
import styles from '@/styles';
import Image from 'next/image';
import { ErrorMessage } from '@/types';

const GameInfo = () => {
  const { contract, gameData, setErrorMessage, setShowAlert } =
    useGlobalContext();
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const router = useRouter();

  const handleBattleExit = async () => {
    const battleName = gameData?.activeBattle.name;

    try {
      if (!contract || !battleName) return;
      await contract.quitBattle(battleName);

      setShowAlert({
        status: true,
        type: 'info',
        message: `You're quitting the ${battleName}`,
      });
    } catch (error) {
      setErrorMessage(error as ErrorMessage);
    }
  };

  return (
    <>
      <div className={styles.gameInfoIconBox}>
        <div
          className={`${styles.gameInfoIcon} ${styles.flexCenter}`}
          onClick={() => setToggleSidebar(true)}
        >
          <Image
            src={alertIcon}
            alt='info'
            className={styles.gameInfoIconImg}
          />
        </div>
      </div>

      <div
        className={`${styles.gameInfoSidebar} ${
          toggleSidebar ? 'translate-x-0' : 'translate-x-full'
        } ${styles.glassEffect} ${styles.flexBetween} backdrop-blur-3xl`}
      >
        <div className='flex flex-col'>
          <div className={styles.gameInfoSidebarCloseBox}>
            <div
              className={`${styles.flexCenter} ${styles.gameInfoSidebarClose}`}
              onClick={() => setToggleSidebar(false)}
            >
              X
            </div>
          </div>

          <h3 className={styles.gameInfoHeading}>Game Rules:</h3>

          <div className='mt-3'>
            {gameRules.map((rule, index) => (
              <p
                key={`game-rule-${index}`}
                className={styles.gameInfoText}
              >
                <span className='font-bold'>{index + 1}</span>. {rule}
              </p>
            ))}
          </div>
        </div>

        <div className={`${styles.flexBetween} mt-10 gap-4 w-full`}>
          <CustomButton
            title='Change Battleground'
            handleClick={() => router.push('/battleground')}
          />
          <CustomButton
            title='Exit Battle'
            handleClick={() => handleBattleExit()}
          />
        </div>
      </div>
    </>
  );
};

export default GameInfo;
