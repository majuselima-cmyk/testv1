// API route untuk lot.php - Get lot size per schedule
import { createClient } from '@supabase/supabase-js'
import { calculateLotIndexFromLast15Trades, getActiveLotsPerSchedule, getSchedulePatterns } from '~/server/utils/trading'

// Helper untuk create Supabase client di server
function createSupabaseClient(config: any) {
  const supabaseUrl = config.public.supabaseUrl
  const supabaseAnonKey = config.public.supabaseAnonKey
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

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
  const schedule = (query.schedule as string) || 'S1'
  const format = (query.format as string) || 'standard'

  // Validasi schedule
  const validSchedules = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'SX']
  if (!validSchedules.includes(schedule.toUpperCase())) {
    throw createError({
      statusCode: 400,
      message: 'Invalid schedule. Must be S1-S9 or SX'
    })
  }

  // Create Supabase client untuk server-side
  const supabase = createSupabaseClient(config)

  try {
    // Get lot sizes dari database
    const { data: lotSizesData, error: lotError } = await supabase
      .from('lot_sizes')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (lotError) throw lotError

    const lotSizes = (lotSizesData || []).map(item => ({
      ...item,
      size: parseFloat(item.size.toString())
    }))

    // Fallback jika kosong
    if (lotSizes.length === 0) {
      lotSizes.push(...[
        { size: 0.01, order_index: 1, is_active: true },
        { size: 0.02, order_index: 2, is_active: true },
        { size: 0.03, order_index: 3, is_active: true }
      ])
    }

    // Calculate lot index untuk schedule yang diminta
    const currentIndex = await calculateLotIndexFromLast15Trades(
      account,
      schedule.toUpperCase(),
      lotSizes
    )

    // Get active lots untuk semua schedule
    const activeLotsPerSchedule = await getActiveLotsPerSchedule(account, lotSizes)

    // Get last trade untuk schedule ini
    const patterns = getSchedulePatterns(schedule.toUpperCase())

    let lastTrade: any = null
    for (const pattern of patterns) {
      const { data, error } = await supabase
        .from('trading_positions')
        .select('*')
        .eq('account_number', account)
        .ilike('comment', pattern)
        .order('id', { ascending: false })
        .order('created_at', { ascending: false })
        .order('ticket', { ascending: false })
        .limit(10)

      if (!error && data && data.length > 0) {
        lastTrade = data[0]
        break
      }
    }

    const lastProfit = lastTrade ? parseFloat(lastTrade.profit?.toString() || '0') : 0
    const lastTicket = lastTrade ? parseInt(lastTrade.ticket?.toString() || '0') : 0

    const responseData = {
      status: 'success',
      schedule: schedule.toUpperCase(),
      lot_sizes: lotSizes.map(l => l.size.toFixed(2)),
      current_index: currentIndex,
      current_lot: lotSizes[currentIndex]?.size.toFixed(2) || '0.01',
      total_lots: lotSizes.length,
      last_profit: lastProfit,
      last_ticket: lastTicket,
      active_lots: activeLotsPerSchedule
    }

    return responseData

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Internal server error'
    })
  }
})

