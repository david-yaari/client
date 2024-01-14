import { useRouter } from 'next/navigation';

//import Alert from './Alert';
import { useGlobalContext } from '@/context';
import { logo, heroImg } from '@/public/assets';
import styles from '@/styles';
import Image from 'next/image';
import Alert from './Alert';

type PageHOCType = (
  Component: React.ComponentType<any>,
  title: React.JSX.Element,
  description: React.JSX.Element
) => React.FC;

const PageHOC: PageHOCType = (Component, title, description) => {
  const WrappedComponent: React.FC = () => {
    const { showAlert, walletAddress } = useGlobalContext();
    const router = useRouter();

    if (!showAlert.type) return;

    return (
      <div className={styles.hocContainer}>
        {showAlert.status && (
          <Alert
            type={showAlert?.type}
            message={showAlert.message}
          />
        )}

        <div className={styles.hocContentBox}>
          <Image
            src={logo}
            alt='logo'
            className={styles.hocLogo}
            onClick={() => router.push('/')}
          />
          <div className={` ${styles.hocContentBox}`}>
            {/* {!walletAddress && (
            <ConnectWallet
              theme={'dark'}
              modalSize={'wide'}
            />
          )} */}
          </div>

          <div className={styles.hocBodyWrapper}>
            <div className='flex flex-row w-full'>
              <h1 className={`flex ${styles.headText} head-text`}>{title}</h1>
            </div>
            <p className={`${styles.normalText} my-10`}>{description}</p>

            <Component />
          </div>
          <p className={styles.footerText}>Made with 💜 by David</p>
        </div>
        <div className='flex flex-1'>
          <Image
            src={heroImg}
            alt='hero-img'
            className='w-full xl:h-full object-cover'
          />
        </div>
      </div>
    );
  };
  WrappedComponent.displayName = `PageHOC(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WrappedComponent;
};

export default PageHOC;
