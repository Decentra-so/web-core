import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const insertDescription = async (id: string, description: string, owner: string) => {
  if (!supabase) {
    console.log('here 1')
    throw new Error('Supabase is not initialized')
  }
  if (!id || !description || !owner) {
    console.log('here 2')
    throw new Error('Invalid arguments')
  }

  const { data, error } = await supabase
  .from('descriptions')
  .insert([
    {
      id: id,
      description: description,
      owner: owner,
    },
  ])
  .select()
  console.log(data, 'data')
}

export const readDescription = async (id: string) => {

  let { data: descriptions, error } = await supabase
  .from('descriptions')
  .select('owner, description')
  .eq('id', id)

  console.log(descriptions, 'descriptions')
  return descriptions
}