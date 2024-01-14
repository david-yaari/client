'use client';

import { SmartContract, ThirdwebSDK, ChainId } from '@thirdweb-dev/sdk';
import React from 'react';
import { ADDRESS, ABI } from '@/contract';

import {
  createContext,
  use,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { BaseContract, Wallet, ethers } from 'ethers';
import { useRouter } from 'next/navigation';

import { MetaMaskWallet } from '@thirdweb-dev/wallets';

import detectEthereumProvider from '@metamask/detect-provider';
import { Sepolia } from '@thirdweb-dev/chains';
import { AlertStyleKeys, AlertType } from '@/types';
import { createEventListeners } from './createEventListners';
import { GetParams } from '@/utils/Onboard';

type GlobalContextType = {
  walletAddress: string;
  provider: ethers.providers.Web3Provider | undefined;
  //contract: ethers.Contract | null;
  contract: ethers.Contract;
  showAlert: AlertType;
  setShowAlert: (value: AlertType) => void;
  battleName: string;
  setBattleName: (value: string) => void;
  gameData: GameData | undefined;
  battleGround: string;
  setBattleGround: (value: string) => void;
  updateCurrentWalletAddress: () => void;
  errorMessage: ErrorMessage | undefined;
  setErrorMessage: (value: ErrorMessage) => void;
  player1Ref?: React.RefObject<HTMLDivElement> | undefined;
  player2Ref?: React.RefObject<HTMLDivElement> | undefined;
};

type Player = {
  playerName: string;
  playerAddress: string;
  playerMana: number;
  playerHealth: number;
  inBattle: boolean;
};

type Battle = {
  battleStatus: number;
  name: string;
  players: Player[];
  winner: string;

  battleHash: string;
};

type Battles = Battle[];

type GameData = {
  players: Player[];
  pendingBattles: Battle[];
  activeBattle: Battle;
};

type ErrorMessage = {
  reason: string;
};

//const sdk = new ThirdwebSDK(Sepolia);
// // If used on the FRONTEND pass your 'clientId'
// const sdk = new ThirdwebSDK(Sepolia, {
//   clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
// });

// const sdk = ThirdwebSDK.fromPrivateKey(
//   process.env.NEXT_PUBLIC_PRIVATE_KEY ?? '', // Your wallet's private key (only required for write operations)
//   'Sepolia',
//   {
//     clientId: process.env.NEXT_PUBLIC_CLIENT_ID, // Use client id if using on the client side, get it from dashboard settings
//     //secretKey: process.env.NEXT_PUBLIC_SECRET_KEY, // Use secret key if using on the server, get it from dashboard settings
//   }
// );

const GlobalContext = createContext<GlobalContextType>({
  walletAddress: '',
  provider: undefined,
  contract: undefined!,
  showAlert: { status: false, type: null, message: '' },
  setShowAlert: () => {},
  battleName: '',
  setBattleName: () => {},
  gameData: undefined,
  battleGround: '', // Add the missing property
  setBattleGround: () => {}, // Add the missing property
  updateCurrentWalletAddress: () => {},
  errorMessage: undefined,
  setErrorMessage: () => {},
  player1Ref: undefined,
  player2Ref: undefined,
});

export const GlobalContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  //const [contract, setContract] = useState<ethers.Contract>();
  const [contract, setContract] = useState<ethers.Contract>();
  const [showAlert, setShowAlert] = useState<AlertType>({
    status: false,
    type: 'info',
    message: '',
  });
  const [battleName, setBattleName] = useState('');
  const [gameData, setGameData] = useState<GameData>();
  const [updateGameData, setUpdateGameData] = useState<number>(0);
  const [battleGround, setBattleGround] = useState('bg-astral');
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>();

  const player1Ref = React.useRef<HTMLDivElement>(null);
  const player2Ref = React.useRef<HTMLDivElement>(null);

  const router = useRouter();

  //* Set the background image to local storage
  useEffect(() => {
    const battlegroundFromLocalStorage = localStorage.getItem('battleground');

    if (battlegroundFromLocalStorage) {
      setBattleGround(battlegroundFromLocalStorage);
    } else {
      localStorage.setItem('battleground', battleGround);
    }
  }, [battleGround]);

  //* Reset web3 onboarding modal params
  useEffect(() => {
    const resetParams = async () => {
      const currentStep = await GetParams();

      setStep(currentStep.step);
    };

    resetParams();

    window?.ethereum?.on('chainChanged', () => resetParams());
    window?.ethereum?.on('accountsChanged', () => resetParams());
    window?.ethereum?.on('amountChanged', () => resetParams());
  }, []);

  //* Set the wallet address to the state
  const updateCurrentWalletAddress = async () => {
    const provider =
      window.ethereum != null
        ? new ethers.providers.Web3Provider(window.ethereum as any, 'any')
        : null;
    if (provider) {
      try {
        const accounts = await provider.send('eth_requestAccounts', []);

        const signer = provider.getSigner(); // Grab the current user's address

        const address = await signer.getAddress();

        if (accounts) {
          setWalletAddress(accounts[0]);
          setSigner(signer);
        }
      } catch (error) {
        console.error('An error occurred while requesting accounts:', error);
      }
    }
  };

  useEffect(() => {
    updateCurrentWalletAddress();

    window?.ethereum?.on('accountsChanged', updateCurrentWalletAddress);
  }, []);

  //* Set the smart contract to the state
  useEffect(() => {
    const setSmartContractAndProvider = async () => {
      const provider =
        window.ethereum != null
          ? new ethers.providers.Web3Provider(window.ethereum as any, 'any')
          : null;
      if (provider) {
        try {
          const signer = provider.getSigner(); // Grab the current user's address

          const newContract = new ethers.Contract(ADDRESS!, ABI, signer);

          if (newContract && provider) {
            setProvider(provider);
            setContract(newContract);
          }
        } catch (error) {
          //console.error('An error occurred while requesting contract:', error);
          setErrorMessage(error as ErrorMessage);
        }
      }
    };

    setSmartContractAndProvider();
  }, [signer]);

  //* Activate event listeners for the smart contract
  useEffect(() => {
    if (step !== -1 && contract && provider && router && walletAddress) {
      createEventListeners({
        router,
        provider,
        contract,
        walletAddress,
        setShowAlert,
        player1Ref,
        player2Ref,
        setUpdateGameData,
      });
    }
  }, [contract, step]);

  //* Set the game data to the state
  useEffect(() => {
    const fetchGameData = async () => {
      if (contract) {
        const fetchedBattles: any[][] = await contract.getAllBattles();

        const battles: Battles = fetchedBattles.map((battleArray) => ({
          battleStatus: battleArray[0],
          battleHash: battleArray[1],
          name: battleArray[2],
          players: battleArray[3].map((player: any[]) => ({
            playerAddress: player,
          })),
          scores: battleArray[4],
          winner: battleArray[5],
        }));

        let pendingBattles = battles.filter(
          (battle: Battle) => battle.battleStatus === 0
        );

        const startedBattles = battles.filter((battle: Battle) => {
          return (
            !battle.players.some(
              (player) =>
                player.playerAddress.toLowerCase() ===
                walletAddress.toLowerCase()
            ) && battle.battleStatus === 1
          );
        });

        if (!startedBattles.length) {
          pendingBattles = startedBattles;
        }

        let activeBattle: Battle = {
          name: '',
          players: [],
          winner: '',
          battleStatus: 0,
          battleHash: '',
        };

        battles.forEach((battle: Battle) => {
          if (
            battle.players.find(
              (player: Player) =>
                player.playerAddress.toLowerCase() ===
                walletAddress.toLowerCase()
            )
          ) {
            if (battle.winner.startsWith('0x00')) {
              activeBattle = battle;
            }
          }
        });

        setGameData({
          players: activeBattle.players,
          pendingBattles: pendingBattles.slice(1),
          activeBattle,
        });
      }
    };

    fetchGameData();
  }, [contract, walletAddress, updateGameData]);

  //* Handle alerts
  useEffect(() => {
    if (showAlert.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: 'info', message: '' });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  //* Handle error messages
  useEffect(() => {
    if (errorMessage) {
      const parsedErrorMessage = errorMessage?.reason;
      if (parsedErrorMessage) {
        setShowAlert({
          status: true,
          type: 'failure',
          message: parsedErrorMessage,
        });
      }
    }
  }, [errorMessage]);

  return (
    <GlobalContext.Provider
      value={{
        walletAddress,
        provider: provider,
        contract: contract!,
        showAlert,
        setShowAlert,
        battleName,
        setBattleName,
        gameData,
        battleGround,
        setBattleGround,
        updateCurrentWalletAddress,
        errorMessage,
        setErrorMessage,
        player1Ref,
        player2Ref,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
