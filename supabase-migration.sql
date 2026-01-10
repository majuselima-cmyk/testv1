-- ============================================
-- SUPABASE MIGRATION - Trading Management System
-- Convert dari MySQL ke PostgreSQL (Supabase)
-- ============================================

-- 1. CREATE TABLE trading_positions
CREATE TABLE IF NOT EXISTS trading_positions (
  id SERIAL PRIMARY KEY,
  account_number VARCHAR(50) NOT NULL,
  ticket BIGINT NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  position_type VARCHAR(10) NOT NULL, -- 'BUY' atau 'SELL'
  volume DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  price DECIMAL(15,5) NOT NULL DEFAULT 0.00000,
  profit DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  position_time TIMESTAMP WITH TIME ZONE NOT NULL,
  comment TEXT,
  sync_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_account_ticket UNIQUE (account_number, ticket)
);

-- Indexes untuk trading_positions
CREATE INDEX IF NOT EXISTS idx_trading_positions_account ON trading_positions(account_number);
CREATE INDEX IF NOT EXISTS idx_trading_positions_ticket ON trading_positions(ticket);
CREATE INDEX IF NOT EXISTS idx_trading_positions_position_time ON trading_positions(position_time);
CREATE INDEX IF NOT EXISTS idx_trading_positions_sync_time ON trading_positions(sync_time);
CREATE INDEX IF NOT EXISTS idx_trading_positions_comment ON trading_positions(comment);

-- 2. CREATE TABLE ea_control
CREATE TABLE IF NOT EXISTS ea_control (
  account_number VARCHAR(50) PRIMARY KEY,
  status VARCHAR(3) NOT NULL DEFAULT 'ON' CHECK (status IN ('ON', 'OFF')), -- Status EA Global
  schedule_s1 VARCHAR(3) NOT NULL DEFAULT 'ON' CHECK (schedule_s1 IN ('ON', 'OFF')),
  schedule_s2 VARCHAR(3) NOT NULL DEFAULT 'ON' CHECK (schedule_s2 IN ('ON', 'OFF')),
  schedule_s3 VARCHAR(3) NOT NULL DEFAULT 'ON' CHECK (schedule_s3 IN ('ON', 'OFF')),
  schedule_s4 VARCHAR(3) NOT NULL DEFAULT 'ON' CHECK (schedule_s4 IN ('ON', 'OFF')),
  schedule_s5 VARCHAR(3) NOT NULL DEFAULT 'ON' CHECK (schedule_s5 IN ('ON', 'OFF')),
  schedule_s6 VARCHAR(3) NOT NULL DEFAULT 'ON' CHECK (schedule_s6 IN ('ON', 'OFF')),
  schedule_s7 VARCHAR(3) NOT NULL DEFAULT 'ON' CHECK (schedule_s7 IN ('ON', 'OFF')),
  schedule_s8 VARCHAR(3) NOT NULL DEFAULT 'ON' CHECK (schedule_s8 IN ('ON', 'OFF')),
  schedule_s9 VARCHAR(3) NOT NULL DEFAULT 'ON' CHECK (schedule_s9 IN ('ON', 'OFF')),
  schedule_sx VARCHAR(3) NOT NULL DEFAULT 'ON' CHECK (schedule_sx IN ('ON', 'OFF')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by VARCHAR(100)
);

-- Indexes untuk ea_control
CREATE INDEX IF NOT EXISTS idx_ea_control_status ON ea_control(status);
CREATE INDEX IF NOT EXISTS idx_ea_control_updated_at ON ea_control(updated_at);

-- Insert default account (jika belum ada)
INSERT INTO ea_control (
  account_number, status,
  schedule_s1, schedule_s2, schedule_s3, schedule_s4, schedule_s5,
  schedule_s6, schedule_s7, schedule_s8, schedule_s9, schedule_sx,
  updated_by
) 
VALUES (
  '270787386', 'ON',
  'ON', 'ON', 'ON', 'ON', 'ON',
  'ON', 'ON', 'ON', 'ON', 'ON',
  'system'
)
ON CONFLICT (account_number) DO NOTHING;

-- 3. CREATE TABLE lot_sizes
CREATE TABLE IF NOT EXISTS lot_sizes (
  id SERIAL PRIMARY KEY,
  size DECIMAL(10,2) NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes untuk lot_sizes
CREATE INDEX IF NOT EXISTS idx_lot_sizes_order_index ON lot_sizes(order_index);
CREATE INDEX IF NOT EXISTS idx_lot_sizes_is_active ON lot_sizes(is_active);

-- Insert default lot sizes (jika belum ada)
INSERT INTO lot_sizes (size, order_index, is_active) VALUES
  (0.03, 1, true),
  (0.06, 2, true),
  (0.10, 3, true),
  (0.15, 4, true),
  (0.24, 5, true),
  (0.29, 6, true),
  (0.39, 7, true),
  (0.51, 8, true),
  (0.67, 9, true),
  (0.86, 10, true),
  (1.10, 11, true),
  (1.35, 12, true),
  (1.76, 13, true),
  (2.22, 14, true),
  (2.80, 15, true),
  (3.52, 16, true)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (optional - untuk development bisa disable dulu)
-- ALTER TABLE trading_positions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ea_control ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE lot_sizes ENABLE ROW LEVEL SECURITY;

-- Policy untuk allow all (untuk development)
-- CREATE POLICY "Allow all operations" ON trading_positions FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all operations" ON ea_control FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all operations" ON lot_sizes FOR ALL USING (true) WITH CHECK (true);

-- Function untuk auto update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk auto update updated_at
CREATE TRIGGER update_lot_sizes_updated_at BEFORE UPDATE ON lot_sizes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ea_control_updated_at BEFORE UPDATE ON ea_control
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


