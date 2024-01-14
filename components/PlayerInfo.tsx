'use client';

import { Tooltip as ReactTooltip } from 'react-tooltip';
import styles from '@/styles';
import Image, { StaticImageData } from 'next/image';
import { Player } from '@/types';

// type Player = {
//   playerName: string;
//   playerAddress: string;
//   playerMana: number;
//   playerHealth: number;
//   inBattle: boolean;
//   attack: number;
//   defense: number;
// };

type PlayerInfoProps = {
  player: Player;
  playerIcon: StaticImageData;
  mt: string;
};

const healthPoints = 25;

const healthLevel = (points: number) =>
  points >= 12 ? 'bg-green-500' : points >= 6 ? 'bg-orange-500' : 'bg-red-500';
const marginIndexing = (index: number) =>
  index !== healthPoints - 1 ? 'mr-1' : 'mr-0';

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, playerIcon, mt }) => {
  return (
    <div className={`${styles.flexCenter} ${mt ? 'mt-4' : 'mb-4'}`}>
      <Image
        data-tooltip-id={`Player-${mt ? '1' : '2'}`}
        src={playerIcon}
        alt='player02'
        className='w-14 h-14 object-contain rounded-full'
      />

      <div
        data-tooltip-id={`Health-${mt ? '1' : '2'}`}
        data-tooltip-content={`Health: ${player.playerHealth}`}
        className={styles.playerHealth}
      >
        {[...Array(player.playerHealth).keys()].map((item, index) => (
          <div
            key={`player-item-${item}`}
            className={`${styles.playerHealthBar} ${healthLevel(
              player.playerHealth
            )} ${marginIndexing(index)}`}
          />
        ))}
      </div>

      <div
        data-tooltip-id={`Mana-${mt ? '1' : '2'}`}
        data-tooltip-content='Mana'
        className={`${styles.flexCenter} ${styles.glassEffect} ${styles.playerMana}`}
      >
        {player.playerMana || 0}
      </div>

      <ReactTooltip
        id={`Player-${mt ? '1' : '2'}`}
        style={{ backgroundColor: '#7f46f0' }}
      >
        <p className={styles.playerInfo}>
          <span className={styles.playerInfoSpan}>Name:</span>{' '}
          {player.playerName}
        </p>
        <p className={styles.playerInfo}>
          <span className={styles.playerInfoSpan}>Address:</span>{' '}
          {player?.playerAddress?.slice(0, 10)}
        </p>
      </ReactTooltip>
      <ReactTooltip
        id={`Health-${mt ? '1' : '2'}`}
        style={{ backgroundColor: '#7f46f0' }}
      />
      <ReactTooltip
        id={`Mana-${mt ? '1' : '2'}`}
        style={{ backgroundColor: '#7f46f0' }}
      />
    </div>
  );
};

export default PlayerInfo;
