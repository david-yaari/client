'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useGlobalContext } from '@/context';
import { CustomButton, PageHOC } from '@/components';
import styles from '@/styles';
import { ErrorMessage } from '@/types';

const JoinBattle = () => {
  const {
    contract,
    gameData,
    setShowAlert,
    battleName,
    setBattleName,
    setErrorMessage,
    walletAddress,
  } = useGlobalContext();

  const [waitBattle, setWaitBattle] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1)
      router.push(`/battle/${gameData.activeBattle.name}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData]);

  const handleClick = async (battleName: string) => {
    setBattleName(battleName);

    try {
      if (!contract || !battleName || !battleName.trim()) return;
      await contract.joinBattle(battleName);

      setWaitBattle(true);

      setShowAlert({
        status: true,
        type: 'success',
        message: `Joining ${battleName}`,
      });
    } catch (error: any) {
      setErrorMessage(error as ErrorMessage);
    }
  };

  return (
    <>
      <h2 className={styles.joinHeadText}>Available Battles:</h2>

      <div className={styles.joinContainer}>
        {gameData?.pendingBattles.length ? (
          gameData.pendingBattles
            .filter(
              (battle) =>
                !battle.players.some(
                  (player) =>
                    player.playerAddress.toLowerCase() ===
                    walletAddress.toLowerCase()
                ) && battle.battleStatus !== 1
            )
            .map((battle, index) => (
              <div
                key={battle.name + index}
                className={styles.flexBetween}
              >
                <p className={styles.joinBattleTitle}>
                  {index + 1}. {battle.name}
                </p>
                <CustomButton
                  title='Join'
                  handleClick={() => handleClick(battle.name)}
                />
              </div>
            ))
        ) : (
          <p className={styles.joinLoading}>
            Reload the page to see new battles
          </p>
        )}
      </div>

      <p
        className={styles.infoText}
        onClick={() => router.push('/create-battle')}
      >
        Or create a new battle
      </p>
    </>
  );
};

export default PageHOC(
  JoinBattle,
  <>
    Join <br /> a Battle
  </>,
  <>Join already existing battles</>
);
