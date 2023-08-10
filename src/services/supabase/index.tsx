import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)


export const insertDescription = async (id: string, description: string, owner: string, auth: string) => {
  let supabaseAuthenticated = createClient(supabaseUrl, supabaseKey, 
    {
      global: {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      },
      // This was in the documentation but doesn't work at all
      // See: https://supabase.com/docs/guides/realtime/extensions/postgres-changes#custom-tokens
      // realtime: {
      //   headers: {
      //     apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      //   },
      //   params: {
      //     apikey: accessToken,
      //   },
      // },
    }
  );
  supabaseAuthenticated.realtime.accessToken = auth
  if (!supabaseAuthenticated) {
    throw new Error('Supabase is not initialized')
  }
  if (!id || !description || !owner) {
    throw new Error('Invalid arguments')
  }
  try {
    const { data, error } = await supabaseAuthenticated
    .from('descriptions')
    .insert([
      {
        id: id,
        description: description,
        owner: owner,
      },
    ])
    .select()
  } catch (error) {
    console.log(error, 'error')
  }
}

export const readDescription = async (id: string, auth: string) => {
  let supabaseAuthenticated = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    },
  });
  let { data: descriptions, error } = await supabaseAuthenticated
  .from('descriptions')
  .select('owner, description')
  .eq('id', id)

  console.log(descriptions, 'descriptions')
  return descriptions
}