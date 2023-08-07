import type { providers } from 'ethers';
import { Base64 } from 'js-base64';

import { getSignature, verifySignature } from './ethereumHelpers';

const WELCOME_MESSAGE = `Welcome to Decentra!

Please sign this message to prove that you own this address. 

This request will not trigger a blockchain transaction or cost any gas fees.

Your authentication status will reset after 7 days.

`;

type Claim = {
  timestamp: Date;
  authexpiration: Date;
  walletaddress: string;
  nonce: string;
};

export async function createToken(
  provider: providers.Web3Provider,
  msg: string,
): Promise<string> {
  const signer = provider.getSigner();
  const address = await signer.getAddress();
 const timestamp = +new Date();

  const claim = {
    timestamp,
    walletaddress: address,
    nonce: msg,
  };

  const serializedClaim = JSON.stringify(claim);
  const msgToSign = `${WELCOME_MESSAGE}${serializedClaim}`;

  const proof = await getSignature(provider, msgToSign);

  return Base64.encode(JSON.stringify([proof, serializedClaim]));
}

export async function verifyToken(
  token: string,
  provider: providers.JsonRpcProvider,
  connectedAddress?: string,
): Promise<Claim> {

  const rawToken = Base64.decode(token);

  const [proof, rawClaim] = JSON.parse(rawToken);
 
  const claim: Claim = JSON.parse(rawClaim);

  const claimant = claim.walletaddress;
  console.log('claimant', claimant, claim)

  if (connectedAddress != null && claimant !== connectedAddress) {
    console.log('Connected address ≠ claim issuer', claimant, connectedAddress)
    throw new Error(
      `Connected address (${connectedAddress}) ≠ claim issuer (${claimant}).`,
    );
  }

  const msgToVerify = `${WELCOME_MESSAGE}${rawClaim}`;
  const valid = await verifySignature(claimant, msgToVerify, proof, provider);

  if (!valid) {
    console.log('Invalid Signature')
    throw new Error('Invalid Signature');
  }

  return claim;
}
