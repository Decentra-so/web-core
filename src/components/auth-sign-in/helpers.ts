import { createToken, verifyToken } from '../../utils/did';
import {
  clearToken,
  getTokenFromStore,
  setTokenInStore,
} from '../../lib/auth';
import type { Web3Provider } from '@ethersproject/providers';

export async function getExistingAuth(
  ethersProvider: Web3Provider,
  connectedAddress: string,
): Promise<string | null> {
  const token = getTokenFromStore();
  if (!token) return null;

  try {
    await verifyToken(token, ethersProvider, connectedAddress);
    return token;
  } catch (e) {
    clearToken();
    return null;
  }
}

export async function authenticateWallet(
  ethersProvider: Web3Provider,
  msg: string,
): Promise<string> {
  console.log(msg, 'msg')
  const token = await createToken(ethersProvider, msg);
  console.log('token', token)
  setTokenInStore(token);
  return token;
}