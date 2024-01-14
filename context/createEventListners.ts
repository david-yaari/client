import { ABI } from '@/contract';
import { defenseSound } from '@/public/assets';
import { AlertType, Player } from '@/types';
import { playAudio, sparcle } from '@/utils/animation';
import { SmartContract } from '@thirdweb-dev/react';
import { BaseContract, Contract, ethers } from 'ethers';
import { AppRouterContext } from 'next/dist/server/future/route-modules/app-page/vendored/contexts/entrypoints';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Dispatch, SetStateAction } from 'react';

type CreateEventListenersParams = {
  router: AppRouterInstance;
  provider: ethers.providers.Web3Provider;
  //contract: ethers.Contract;
  contract: ethers.Contract;
  walletAddress: string;
  setShowAlert: (alert: AlertType) => void;
  setUpdateGameData: Dispatch<SetStateAction<number>>;
  player1Ref: React.RefObject<HTMLDivElement>;
  player2Ref: React.RefObject<HTMLDivElement>;
  // setUpdateGameData: (data: DataType) => void; // Replace DataType with the actual type
};

const AddNewEvent = (eventFilter: any, provider: any, cb: any) => {
  provider.removeListener(eventFilter);

  provider.on(eventFilter, (logs: any) => {
    const parsedLog = new ethers.utils.Interface(ABI).parseLog(logs);

    cb(parsedLog);
  });
};

//* Get battle card coordinates
const getCoords = (cardRef: any) => {
  const { left, top, width, height } = cardRef.current.getBoundingClientRect();

  return {
    pageX: left + width / 2,
    pageY: top + height / 2.25,
  };
};

const emptyAccount = '0x0000000000000000000000000000000000000000';

export const createEventListeners = ({
  router,
  contract,
  provider,
  walletAddress,
  setShowAlert,
  player1Ref,
  player2Ref,
  setUpdateGameData,
}: CreateEventListenersParams) => {
  const NewPlayerEventFilter = contract.filters.NewPlayer();
  AddNewEvent(NewPlayerEventFilter, provider, ({ args }: { args: any }) => {
    console.log('New player created!', args);

    if (walletAddress === args.owner) {
      setShowAlert({
        status: true,
        type: 'success',
        message: 'Player has been successfully registered',
      });
    }
  });

  const NewBattleEventFilter = contract.filters.NewBattle();
  AddNewEvent(NewBattleEventFilter, provider, ({ args }: { args: any }) => {
    console.log('New battle started!', args, walletAddress);

    if (
      walletAddress.toLowerCase() === args.player1.toLowerCase() ||
      walletAddress.toLowerCase() === args.player2.toLowerCase()
    ) {
      router.push(`/battle/${args.battleName}`);
    }

    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  const NewGameTokenEventFilter = contract.filters.NewGameToken();
  AddNewEvent(NewGameTokenEventFilter, provider, ({ args }: { args: any }) => {
    console.log('New game token created!', args.owner);

    if (walletAddress.toLowerCase() === args.owner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: 'success',
        message: 'Player game token has been successfully generated',
      });

      router.push('/create-battle');
    }
  });

  const BattleMoveEventFilter = contract.filters.BattleMove();
  AddNewEvent(BattleMoveEventFilter, provider, ({ args }: { args: any }) => {
    console.log('Battle move initiated!', args);
  });

  const RoundEndedEventFilter = contract.filters.RoundEnded();
  AddNewEvent(RoundEndedEventFilter, provider, ({ args }: { args: any }) => {
    console.log('Round ended!', args, walletAddress);

    for (let i = 0; i < args.damagedPlayers.length; i += 1) {
      if (args.damagedPlayers[i] !== emptyAccount) {
        if (args.damagedPlayers[i] === walletAddress) {
          sparcle(getCoords(player1Ref));
        } else if (args.damagedPlayers[i] !== walletAddress) {
          sparcle(getCoords(player2Ref));
        }
      } else {
        playAudio(defenseSound);
      }
    }

    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  // Battle Ended event listener
  const BattleEndedEventFilter = contract.filters.BattleEnded();
  AddNewEvent(BattleEndedEventFilter, provider, ({ args }: { args: any }) => {
    if (walletAddress.toLowerCase() === args.winner.toLowerCase()) {
      setShowAlert({ status: true, type: 'success', message: 'You won!' });
    } else if (walletAddress.toLowerCase() === args.loser.toLowerCase()) {
      setShowAlert({ status: true, type: 'failure', message: 'You lost!' });
    }

    router.push('/create-battle');
  });
};
