'use client';

import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context';
import { OnboardModal, PageHOC } from '@/components';
import { useEffect, useState } from 'react';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { MetaMaskWallet } from '@thirdweb-dev/wallets';
import { Sepolia } from '@thirdweb-dev/chains';
import { ethers } from 'ethers';
import { GetParams } from '@/utils/Onboard';
import { ErrorMessage } from '@/types';

const Home = () => {
  const { walletAddress, contract, setShowAlert, setErrorMessage } =
    useGlobalContext();
  const [playerName, setPlayerName] = useState('');
  const router = useRouter();

  const handleClick = async () => {
    const currentStep = await GetParams();

    if (!contract || currentStep.step !== -1) return;

    try {
      console.log('handleClick.walletAddress:', walletAddress);
      const playerExists = await contract.isPlayer(walletAddress);

      if (!playerExists) {
        await contract.registerPlayer(playerName, playerName, {
          gasLimit: 500000,
        });

        setShowAlert({
          status: true,
          type: 'info',
          message: `${playerName} is being summoned!`,
        });

        setTimeout(() => router.push('/create-battle'), 8000);
      }
    } catch (error) {
      setErrorMessage(error as ErrorMessage);
    }
  };

  useEffect(() => {
    const createPlayerToken = async () => {
      const currentStep = await GetParams();

      if (!walletAddress || !contract || currentStep.step !== -1) return;
      //console.log('useEffect.walletAddress:', walletAddress);
      const playerExists = await contract.isPlayer(walletAddress);

      const playerTokenExists = await contract.isPlayerToken(walletAddress);

      if (playerExists && playerTokenExists) {
        router.push('/create-battle');
      }
    };

    if (contract) createPlayerToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, walletAddress]);

  return (
    <>
      <OnboardModal />
      <div className='flex flex-col'>
        <CustomInput
          label='Name'
          placeHolder='Enter ypor player name'
          value={playerName}
          handleValueChange={setPlayerName}
        />
        <CustomButton
          title='Register'
          handleClick={handleClick}
          restStyles='mt-6'
        />
      </div>
    </>
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to Avax Gods <br /> a Web3 NFT Card Game
  </>,
  <>
    Connect your wallet to start playing <br /> the ultimate Web3 Battle Card
    Game
  </>
);
