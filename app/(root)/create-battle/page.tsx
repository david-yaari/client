'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from '@/styles';
import { useGlobalContext } from '@/context';
import { CustomButton, CustomInput, GameLoad, PageHOC } from '@/components';
import { ErrorMessage } from '@/types';

const CreateBattle = () => {
  const { contract, gameData, battleName, setBattleName, setErrorMessage } =
    useGlobalContext();
  const [waitBattle, setWaitBattle] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (gameData?.players?.length === 0) return;
    if (gameData?.activeBattle?.battleStatus === 1) {
      router.push(`/battle/${gameData.activeBattle.name}`);
    } else if (gameData?.activeBattle?.battleStatus === 0) {
      setWaitBattle(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData]);

  const handleClick = async () => {
    if (!contract || battleName === '' || battleName.trim() === '') return null;
    try {
      await contract.createBattle(battleName);
      setWaitBattle(true);
    } catch (error) {
      setErrorMessage(error as ErrorMessage);
    }
  };

  return (
    <>
      {waitBattle && <GameLoad />}

      <div className='flex flex-col mb-5'>
        <CustomInput
          label='Battle'
          placeHolder='Enter battle name'
          value={battleName}
          handleValueChange={setBattleName}
        />

        <CustomButton
          title='Create Battle'
          handleClick={handleClick}
          restStyles='mt-6'
        />
      </div>
      <p
        className={styles.infoText}
        onClick={() => router.push('/join-battle')}
      >
        Or join already existing battles
      </p>
    </>
  );
};

export default PageHOC(
  CreateBattle,
  <>
    Create <br /> a new Battle
  </>,
  <>Create your own battle and wait for other players to join you</>
);
