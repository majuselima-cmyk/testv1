// API route untuk control.php - Get EA status
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  
  // Validasi token
  const token = query.token as string
  const validToken = config.apiToken || 'abc321Xyz'
  
  if (token !== validToken) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }

  const account = (query.account as string) || config.defaultAccount || '270787386'
  const action = (query.action as string) || 'get'

  if (action !== 'get') {
    throw createError({
      statusCode: 400,
      message: 'Use POST method for set/on/off actions'
    })
  }

  // Create Supabase client untuk server-side
  const { createClient } = await import('@supabase/supabase-js')
  const supabaseUrl = config.public.supabaseUrl
  const supabaseAnonKey = config.public.supabaseAnonKey
  
  // Check configuration dengan error message yang lebih jelas
  if (!supabaseUrl || !supabaseAnonKey) {
    const missingVars = []
    if (!supabaseUrl) missingVars.push('SUPABASE_URL')
    if (!supabaseAnonKey) missingVars.push('SUPABASE_ANON_KEY')
    
    throw createError({
      statusCode: 500,
      statusMessage: `Missing Supabase environment variables: ${missingVars.join(', ')}. Please set them in Vercel Dashboard > Settings > Environment Variables`
    })
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    // Get EA status dari database
    let { data: eaControl, error } = await supabase
      .from('ea_control')
      .select('*')
      .eq('account_number', account)
      .single()

    // Jika belum ada, buat default
    if (!eaControl && error?.code === 'PGRST116') {
      const { data: newControl, error: insertError } = await supabase
        .from('ea_control')
        .insert([{
          account_number: account,
          status: 'ON',
          schedule_s1: 'ON',
          schedule_s2: 'ON',
          schedule_s3: 'ON',
          schedule_s4: 'ON',
          schedule_s5: 'ON',
          schedule_s6: 'ON',
          schedule_s7: 'ON',
          schedule_s8: 'ON',
          schedule_s9: 'ON',
          schedule_sx: 'ON',
          updated_by: 'system'
        }])
        .select()
        .single()

      if (insertError) {
        throw createError({
          statusCode: 500,
          statusMessage: `Failed to create default EA control: ${insertError.message}. Make sure the 'ea_control' table exists in Supabase.`
        })
      }
      eaControl = newControl
    } else if (error) {
      // Handle different Supabase errors
      if (error.code === '42P01') {
        throw createError({
          statusCode: 500,
          statusMessage: `Table 'ea_control' does not exist. Please run the migration SQL in Supabase.`
        })
      }
      throw createError({
        statusCode: 500,
        statusMessage: `Supabase error: ${error.message || 'Unknown error'}`
      })
    }

    return {
      status: 'success',
      account_number: eaControl.account_number,
      ea_status: eaControl.status || 'ON',
      schedule_s1: eaControl.schedule_s1 || 'ON',
      schedule_s2: eaControl.schedule_s2 || 'ON',
      schedule_s3: eaControl.schedule_s3 || 'ON',
      schedule_s4: eaControl.schedule_s4 || 'ON',
      schedule_s5: eaControl.schedule_s5 || 'ON',
      schedule_s6: eaControl.schedule_s6 || 'ON',
      schedule_s7: eaControl.schedule_s7 || 'ON',
      schedule_s8: eaControl.schedule_s8 || 'ON',
      schedule_s9: eaControl.schedule_s9 || 'ON',
      schedule_sx: eaControl.schedule_sx || 'ON',
      updated_at: eaControl.updated_at,
      updated_by: eaControl.updated_by || 'system'
    }

  } catch (error: any) {
    // Jika error sudah berupa createError, re-throw as is
    if (error.statusCode) {
      throw error
    }
    
    // Handle error yang belum di-wrap
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})

