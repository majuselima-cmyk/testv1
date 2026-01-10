# Trading System - Nuxt.js + Supabase

Aplikasi Trading Management System yang di-convert dari PHP ke Nuxt.js 3 + Supabase.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase Database

1. Buat project baru di [Supabase](https://supabase.com)
2. Buka SQL Editor di Supabase Dashboard
3. Jalankan file `supabase-migration.sql` untuk membuat semua tables:
   - `trading_positions`
   - `ea_control`
   - `lot_sizes`

### 3. Setup Environment Variables

1. Copy file `.env.example` menjadi `.env`
2. Edit file `.env` dan isi dengan credentials Supabase kamu:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
API_TOKEN=abc321Xyz
DEFAULT_ACCOUNT=263264939
```

Ambil credentials dari Settings > API di Supabase Dashboard.

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser kamu.

## Fitur

- ✅ Dashboard - Overview status EA & schedules
- ✅ Lot Management - Tracking lot aktif per schedule (martingale)
- ✅ EA Control - ON/OFF EA per schedule (S1-S9, SX)
- ✅ Pendapatan - Grafik pendapatan harian
- ✅ Admin Lot Sizes - CRUD untuk lot sizes
- ✅ History API - Sync/get trading positions
- ✅ Signal API - Generate sinyal trading

## API Endpoints

- `/api/lot` - Get lot size per schedule
- `/api/control` - EA control (get/set)
- `/api/history` - Sync/get positions

## Database Tables

1. **trading_positions** - Trading positions data
2. **ea_control** - EA control per schedule
3. **lot_sizes** - Lot sizes management

## Tech Stack

- **Nuxt.js 3** - Vue.js framework
- **Supabase** - Backend as a Service (PostgreSQL)
- **Chart.js** - Charts untuk grafik pendapatan
- **TypeScript** - Type safety

## Struktur Project

```
├── pages/              # Halaman aplikasi
├── components/         # Vue components
├── composables/        # Composables untuk reusable logic
├── server/             # API routes
│   └── api/           # API endpoints
├── assets/            # Static assets
└── supabase-migration.sql  # Database migration
```

## Notes

- Pastikan semua tables sudah dibuat di Supabase sebelum menjalankan aplikasi
- Default account bisa diubah di `.env` file
- API token untuk keamanan API endpoints

