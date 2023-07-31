import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const insertDescription = async () => {
  if (!supabase) {
    throw new Error('Supabase is not initialized')
  }
  console.log(supabase, 'supabase')
  const { data, error } = await supabase
  .from('descriptions')
  .insert([
    {
      id: 'multisig_0xd2e07BE6C9a7866Bc874Ed5a03a5798F62A6dE34_0xe3f105d57df5ec28b66a061fd8d3e3b0b1fefecc79be5a2ef7d5b3b66af1dce1',
      description: 'send Sero Matic to process transactions.',
      owner: "0xc0163E58648b247c143023CFB26C2BAA42C9d9A9"
    },
  ])
  .select()
  console.log(data, 'data')
}