'use client';

import { useState, useEffect } from 'react';
import Modal from 'react-modal';

import styles from '@/styles';
import { CustomButton } from '.';
import { useGlobalContext } from '@/context';
import { GetParams, SwitchNetwork } from '@/utils/Onboard';

const OnboardModal = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { updateCurrentWalletAddress } = useGlobalContext();
  const [step, setStep] = useState(-1);

  async function resetParams() {
    const currentStep = await GetParams();
    setStep(currentStep.step);
    setIsOpen(currentStep.step !== -1);
  }

  useEffect(() => {
    resetParams();

    window?.ethereum?.on('chainChanged', () => {
      resetParams();
    });

    window?.ethereum?.on('accountsChanged', () => {
      resetParams();
    });
  }, []);

  const generateStep = (st: number) => {
    switch (st) {
      case 0:
        return (
          <>
            <p className={styles.modalText}>
              You don&apos;t have Metamask Wallet installed!
            </p>
            <CustomButton
              title='Download Metamsk'
              handleClick={() =>
                window.open('https://metamask.io/download/', '_blank')
              }
            />
          </>
        );

      case 1:
        return (
          <>
            <p className={styles.modalText}>
              You haven&apos;t connected your account to Metamask Wallet!
            </p>
            <CustomButton
              title='Connect Account'
              handleClick={updateCurrentWalletAddress}
            />
          </>
        );

      case 2:
        return (
          <>
            <p className={styles.modalText}>
              You&apos;re on a different network. Switch to Sepolia .
            </p>
            <CustomButton
              title='Switch'
              handleClick={SwitchNetwork}
            />
          </>
        );

      case 3:
        return (
          <>
            <p className={styles.modalText}>
              Oops, you don&apos;t have Sepolia tokens in your account
            </p>
            <CustomButton
              title='Grab some test tokens'
              handleClick={() =>
                window.open('https://sepoliafaucet.com/', '_blank')
              }
            />
          </>
        );

      default:
        return <p className={styles.modalText}>Good to go!</p>;
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      className={`absolute inset-0 ${styles.flexCenter} flex-col ${styles.glassEffect}`}
      overlayClassName='Overlay'
      ariaHideApp={false}
    >
      {generateStep(step)}
    </Modal>
  );
};

export default OnboardModal;
