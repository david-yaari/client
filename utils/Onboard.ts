import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';

/* eslint-disable prefer-destructuring */
function isEthereum() {
  if (window.ethereum) {
    return true;
  }
  return false;
}

async function getChainID() {
  if (isEthereum()) {
    const provider = (await detectEthereumProvider()) as any;

    if (provider) {
      const chainIdHex = await provider.request({ method: 'eth_chainId' });
      const chainIdInt = parseInt(chainIdHex, 16);

      return chainIdInt;
    }
  }
  return 0;
}

async function handleConnection(accounts: any) {
  if (accounts.length === 0) {
    const provider = new ethers.providers.Web3Provider(
      window.ethereum as any,
      'any'
    );
    try {
      const fetchedAccounts = await provider.send('eth_requestAccounts', []);

      return fetchedAccounts;
    } catch (error) {
      return accounts;
    }
  }
  return accounts;
}

async function requestAccount() {
  let currentAccount = 0x0;
  if (isEthereum() && (await getChainID()) !== 0) {
    let accounts = await window.ethereum.request({ method: 'eth_accounts' });

    accounts = await handleConnection(accounts);
    if (accounts.length !== 0) {
      currentAccount = accounts[0];
    }
  }
  return currentAccount;
}

async function requestBalance(currentAccount: any) {
  let currentBalance = 0;
  if (isEthereum()) {
    try {
      currentBalance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [currentAccount, 'latest'],
      });

      currentBalance = parseInt(String(currentBalance), 16) / 1e18;

      return { currentBalance, err: false };
    } catch (err) {
      return { currentBalance, err: true };
    }
  }
  return { currentBalance, err: true };
}

export const GetParams = async () => {
  const response = {
    isError: false,
    message: '',
    step: -1,
    balance: 0,
    account: '0x0',
  };

  if (!isEthereum()) {
    response.step = 0;
    return response;
  }

  const currentAccount = await requestAccount();

  if (currentAccount === 0x0) {
    response.step = 1;
    return response;
  }

  response.account = currentAccount.toString();

  if ((await getChainID()) !== 11155111) {
    response.step = 2;

    return response;
  }

  const { currentBalance, err } = await requestBalance(currentAccount);
  if (err) {
    response.isError = true;
    response.message = 'Error fetching balance!';
    return response;
  }
  response.balance = currentBalance;

  if (currentBalance < 0.2) {
    response.step = 3;
    return response;
  }

  return response;
};

export async function SwitchNetwork() {
  await window?.ethereum
    ?.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0xaa36a7',
          chainName: 'Sepolia',
          nativeCurrency: {
            name: 'Sepolia Ether',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: [
            'https://rpc.sepolia.org',
            'https://rpc2.sepolia.org',
            'https://rpc-sepolia.rockx.com',
            'https://rpc.sepolia.ethpandaops.io',
            'https://sepolia.gateway.tenderly.co',
            'wss://sepolia.gateway.tenderly.co',
            'https://ethereum-sepolia.publicnode.com',
            'wss://ethereum-sepolia.publicnode.com',
          ],
        },
      ],
    })
    .catch((error: any) => {
      console.log(error);
    });
}
