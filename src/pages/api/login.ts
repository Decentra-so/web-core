import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
const SUPABASE_TABLE_USERS = 'users';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_API_KEY || ''; 

const handler = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { address, signedMessage, nonce } = req.body;

  try {
    // 1. Verify the signed message matches the requested address (Add your verification logic here)

    // 2. Select * from public.user table where address matches
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: usersData, error: usersError } = await supabase
      .from(SUPABASE_TABLE_USERS)
      .select('*')
      .eq('address', address);

    if (usersError) {
      return res.status(500).json({ error: 'Database error while fetching user data' });
    }

    // 3. Verify the nonce included in the request matches what's already in public.users table for that address
    let user = usersData && usersData.length > 0 ? usersData[0] : null;
    if (user && user.auth.genNonce !== nonce) {
      return res.status(400).json({ error: 'Invalid nonce' });
    }

    // 4. If there's no public.users.id for that address, then you need to create a user in the auth.users table
    if (!user) {
      const { data: newUser, error: newUserError } = await supabase.auth.admin.createUser({
        email: '',
        user_metadata: { address: address }
      });

      if (newUserError) {
        return res.status(500).json({ error: 'Failed to create a new user' });
      }

      user = newUser;
    }

    // 5. Insert response into public.users table with id
    await supabase
      .from(SUPABASE_TABLE_USERS)
      .update({
        auth: {
          genNonce: nonce,
          lastAuth: new Date().toISOString(),
          lastAuthStatus: "success"
        },
        id: user.id // same uuid as auth.users table
      })
      .eq('address', address); // primary key
      
      const token = jwt.sign({
        address: address, // this will be read by RLS policy
        sub: user.id,
        aud: 'authenticated'
      }, process.env.NEXT_PUBLIC_SUPABASE_JWT!, { expiresIn: 60*2 } )
      
      res.status(200).send(token).setHeader('Set-Cookie', jwt.serialize('mytoken', token, { path: "/" }))
  } catch (err: any) {
    console.error('Supabase request error:', err.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export default handler;