import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';


const SUPABASE_TABLE_USERS = 'users';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || '';

const handler = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { address, signedMessage, nonce } = req.body;

  try {
    // 1. Verify the signed message matches the requested address (Add your verification logic here)

    // 2. Select * from public.user table where address matches
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data,  error: userError } = await supabase
    .from(SUPABASE_TABLE_USERS)
    .select()
    .eq("address", address)
    .single();
    
    if (userError) {
      return res.status(500).json({ error: `Database error while fetching user data 1 ${userError}` });
    }

    if (data?.auth.genNonce !== nonce) {
      return res.status(500).json({ error: 'nonce does not match' });
  }

    // 3. Verify the nonce included in the request matches what's already in public.users table for that address
    let authUser;
    if (!data?.id) {
      const { data: userData, error } = await supabase.auth.admin.createUser({
        email: `${address}@decentra.so`, // we have to have this.. or a phone
        user_metadata: { address: address },
      });

      if (error) {
        return res.status(500).json({ error: `Database error while fetching user data 2 ${error}` });
      }
      
      if (data != null) {
        authUser = userData.user;
      }
    } else {
      const { data: userData, error } = await supabase.auth.admin.getUserById(
        data.id
      );

      if (error) {
        return res.status(500).json({ error: `Database error while fetching user data 3 ${error}` });
      } else {
        authUser = userData.user;
      }
    }
    let newNonce = Math.floor(Math.random() * 1000000);
    while (newNonce === nonce) {
      newNonce = Math.floor(Math.random() * 1000000);
    }

    await supabase
    .from(SUPABASE_TABLE_USERS)
    .update({
      auth: {
        genNonce: newNonce, // update the nonce, so it can't be reused
        lastAuth: new Date().toISOString(),
        lastAuthStatus: "success",
      },
      id: authUser?.id, // same uuid as auth.users table
    })
    .eq("address", address); // primary key
      
    const token = jwt.sign({
      address: address, // this will be read by RLS policy
      sub: authUser?.id,
      aud: 'authenticated'
    }, process.env.NEXT_PUBLIC_SUPABASE_JWT!, { expiresIn: 60*2 } )

    return res.status(200).json({ token });
  } catch (err: any) {
    console.error('Supabase request error:', err.message);
    return res.status(500).json({ error: `Something went wrong, ${err}` });
  }
};

export default handler;