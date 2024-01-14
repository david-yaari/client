// Purpose: Export contract address and ABI for use in other files.

import contract from '@/contract/AVAXGods.json';

export const ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
export const { abi: ABI } = contract;
