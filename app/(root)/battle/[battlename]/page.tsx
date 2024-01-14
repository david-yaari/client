'use client';

import React, { use, useRef } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from '@/styles';
import { ActionButton, Alert, Card, GameInfo, PlayerInfo } from '@/components';
import { useGlobalContext } from '@/context';
import {
  astral,
  attack,
  attackSound,
  defense,
  defenseSound,
  player01 as player01Icon,
  player02 as player02Icon,
} from '@/public/assets';
import { playAudio } from '@/utils/animation.js';
import { ErrorMessage, Player, Choice } from '@/types';

const Battle = ({
  params: { battlename },
}: {
  params: { battlename: string };
}) => {
  const {
    contract,
    gameData,
    battleGround,
    walletAddress,
    setErrorMessage,
    showAlert,
    setShowAlert,
    player1Ref,
    player2Ref,
  } = useGlobalContext();
  const [player2, setPlayer2] = useState<Player>({
    inBattle: false,
    playerAddress: '',
    playerHealth: 0,
    playerMana: 0,
    playerName: '',
    attack: 0,
    defense: 0,
  });
  const [player1, setPlayer1] = useState<Player>({
    inBattle: false,
    playerAddress: '',
    playerHealth: 0,
    playerMana: 0,
    playerName: '',
    attack: 0,
    defense: 0,
  });
  //const { battleName } = useParams();

  const router = useRouter();

  useEffect(() => {
    const getPlayerInfo = async () => {
      try {
        if (!contract || !gameData) return;
        let player01Address = null;
        let player02Address = null;

        if (
          gameData.activeBattle.players[0].playerAddress.toLowerCase() ===
          walletAddress.toLowerCase()
        ) {
          player01Address = gameData.activeBattle.players[0].playerAddress;
          player02Address = gameData.activeBattle.players[1].playerAddress;
        } else {
          player01Address = gameData?.activeBattle.players[1].playerAddress;
          player02Address = gameData?.activeBattle.players[0].playerAddress;
        }

        const p1TokenData = await contract.getPlayerToken(player01Address);

        const player01 = await contract.getPlayer(player01Address);

        const player02 = await contract.getPlayer(player02Address);

        const p1Att = p1TokenData.attackStrength.toNumber();
        const p1Def = p1TokenData.defenseStrength.toNumber();
        const p1H = player01.playerHealth.toNumber();
        const p1M = player01.playerMana.toNumber();
        const p2H = player02.playerHealth.toNumber();
        const p2M = player02.playerMana.toNumber();
        setPlayer1({
          inBattle: player01.inBattle,
          playerAddress: player01Address,
          playerHealth: p1H,
          playerMana: p1M,
          playerName: player01.playerName,
          attack: p1Att,
          defense: p1Def,
        });

        // setPlayer2({ ...player02, att: 'X', def: 'X', health: p2H, mana: p2M });
        setPlayer2({
          inBattle: player02.inBattle,
          playerAddress: player02Address,
          playerHealth: p2H,
          playerMana: p2M,
          playerName: player02.playerName,
          attack: 0,
          defense: 0,
        });
      } catch (error) {
        setErrorMessage(error as ErrorMessage);
      }
    };
    if (contract && gameData?.activeBattle) {
      getPlayerInfo();
    }
  }, [contract, gameData, battlename, walletAddress]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gameData?.activeBattle) router.push('/');
    }, 2000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData?.activeBattle]);

  const makeAMove = async (choice: Choice) => {
    playAudio(choice === 1 ? attackSound : defenseSound);

    try {
      if (!contract || !battlename) return;

      await contract.attackOrDefendChoice(choice, battlename, {
        gasLimit: 200000,
      });

      setShowAlert({
        status: true,
        type: 'info',
        message: `Initiating ${choice === 1 ? 'attack' : 'defense'}`,
      });
    } catch (error) {
      setErrorMessage(error as ErrorMessage);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gameData?.activeBattle) router.push('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {battleGround && (
        <div
          className={`${styles.flexBetween} ${styles.gameContainer} ${battleGround} `}
        >
          {showAlert && showAlert.status && showAlert.type && (
            <Alert
              type={showAlert.type}
              message={showAlert.message}
            />
          )}
          {player2 && (
            <PlayerInfo
              player={player2}
              playerIcon={player02Icon}
              mt=' '
            />
          )}
          {player1 && player2 && (
            <div className={`${styles.flexCenter} flex-col my-10`}>
              <Card
                card={player2}
                title={player2?.playerName}
                cardRef={player2Ref}
                playerTwo
                restStyles={''}
              />

              <div className='flex items-center flex-row'>
                <ActionButton
                  imgUrl={attack}
                  handleClick={() => makeAMove(1)}
                  restStyles='mr-2 hover:border-yellow-400'
                />

                <Card
                  card={player1}
                  title={player1?.playerName}
                  cardRef={player1Ref}
                  restStyles='mt-3'
                  playerTwo={false}
                />

                <ActionButton
                  imgUrl={defense}
                  handleClick={() => makeAMove(2)}
                  restStyles='ml-6 hover:border-red-600'
                />
              </div>
            </div>
          )}
          {player1 && (
            <PlayerInfo
              player={player1}
              playerIcon={player01Icon}
              mt=''
            />
          )}
          <GameInfo />
        </div>
      )}
    </>
  );
};

export default Battle;
