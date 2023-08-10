import { createClient } from '@supabase/supabase-js';

const SUPABASE_TABLE_USER = 'users';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_API_KEY || ''; 

const nonceHandler = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { address } = req.body;
  const nonce = Math.floor(Math.random() * 1000000);

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const response = await supabase.from(SUPABASE_TABLE_USER).upsert(
    [
      {
        address: address,
        auth: {
          genNonce: nonce,
          lastAuth: new Date().toISOString(),
          lastAuthStatus: "pending",
        },
      },
    ],
    {
      onConflict: "address",
    }
  );


    return res.status(200).json({ nonce, response });
  } catch (err: any) {
    console.error('Supabase request error:', err.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export default nonceHandler;