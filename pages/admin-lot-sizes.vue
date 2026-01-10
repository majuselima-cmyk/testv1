<template>
  <div class="bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 min-h-screen">
    <div class="max-w-6xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-5 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <div class="flex items-center gap-4 mb-3">
              <NuxtLink to="/dashboard" class="bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm">
                <i class="fas fa-arrow-left text-xs"></i> Back
              </NuxtLink>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                  <i class="fas fa-sliders-h text-white text-sm"></i>
                </div>
                Lot Sizes Management
              </h1>
            </div>
            <p class="text-sm text-gray-600">Manage lot sizes untuk trading system</p>
          </div>
          <div v-if="isLoggedIn" class="flex items-center gap-3">
            <div class="text-sm text-gray-600 bg-gradient-to-br from-gray-50 to-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
              <i class="fas fa-user-circle text-purple-600"></i>
              <span class="font-semibold">Admin</span>
            </div>
            <button @click="logout" class="bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2">
              <i class="fas fa-sign-out-alt text-xs"></i> Logout
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-4 gap-3">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
            <div class="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Total</div>
            <div class="text-xl font-bold text-gray-900">{{ lotSizes.length }}</div>
          </div>
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
            <div class="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">Active</div>
            <div class="text-xl font-bold text-gray-900">{{ activeCount }}</div>
          </div>
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200">
            <div class="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">Inactive</div>
            <div class="text-xl font-bold text-gray-900">{{ inactiveCount }}</div>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
            <div class="text-xs text-purple-600 font-semibold uppercase tracking-wider mb-1">Next</div>
            <div class="text-xl font-bold text-gray-900">{{ lotSizes.length + 1 }}</div>
          </div>
        </div>
      </div>

      <!-- Login Form -->
      <div v-if="!isLoggedIn" class="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <i class="fas fa-lock text-white text-sm"></i>
          </div>
          Admin Login
        </h2>
        <div v-if="loginError" class="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
          <i class="fas fa-exclamation-circle"></i>
          {{ loginError }}
        </div>
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <input v-model="password" type="password" 
                   class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
                   placeholder="Enter admin password" required>
          </div>
          <button type="submit" 
                  class="w-full bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-md">
            <i class="fas fa-sign-in-alt text-sm mr-2"></i>Login
          </button>
        </form>
      </div>

      <!-- Admin Panel Content -->
      <template v-else>
        <!-- Success/Error Message -->
        <div v-if="message" :class="messageType === 'success' ? 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200 text-green-700' : 'bg-gradient-to-br from-red-50 to-red-100 border border-red-200 text-red-700'" 
             class="mb-6 p-4 rounded-xl text-sm flex items-center gap-2 shadow-sm">
          <i :class="messageType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'" class="fas"></i>
          {{ message }}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Form Add/Edit -->
          <div class="lg:col-span-1">
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-5 sticky top-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div :class="editingId ? 'from-blue-500 to-blue-600' : 'from-green-500 to-green-600'" class="w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center">
                  <i :class="editingId ? 'fa-edit' : 'fa-plus-circle'" class="fas text-white text-xs"></i>
                </div>
                {{ editingId ? 'Edit Lot Size' : 'Tambah Lot Size' }}
              </h2>
              
              <form @submit.prevent="saveLotSize">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-semibold mb-2">Lot Size</label>
                  <input v-model.number="form.size" type="number" step="0.01" min="0.01" 
                         class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
                         placeholder="0.01, 0.10, 1.00" required>
                  <p class="text-xs text-gray-500 mt-1">Gunakan 2 decimal</p>
                </div>
                
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-semibold mb-2">Order Index</label>
                  <input v-model.number="form.order_index" type="number" min="1" 
                         class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
                         required>
                  <p class="text-xs text-gray-500 mt-1">Urutan sequence (1, 2, 3...)</p>
                </div>
                
                <div class="mb-5">
                  <label class="flex items-center cursor-pointer">
                    <input v-model="form.is_active" type="checkbox" 
                           class="mr-2 h-4 w-4 text-purple-600 rounded focus:ring-purple-500">
                    <span class="text-gray-700 text-sm font-medium">Aktif (tampil di API)</span>
                  </label>
                </div>
                
                <div class="flex gap-2">
                  <button type="submit" 
                          :class="[editingId ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700']"
                          class="flex-1 bg-gradient-to-br text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-md">
                    <i :class="editingId ? 'fa-save' : 'fa-plus'" class="fas text-xs mr-1"></i>
                    {{ editingId ? 'Update' : 'Tambah' }}
                  </button>
                  
                  <button v-if="editingId" type="button" @click="cancelEdit" 
                         class="bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-sm flex items-center">
                    <i class="fas fa-times text-xs mr-1"></i>Batal
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Data Table -->
          <div class="lg:col-span-2">
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
              <div class="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <i class="fas fa-list text-white text-xs"></i>
                  </div>
                  Daftar Lot Sizes
                </h2>
                <p class="text-sm text-gray-600 mt-1">Total: {{ lotSizes.length }} entries</p>
              </div>
              
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
                      <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Lot Size</th>
                      <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order</th>
                      <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Created</th>
                      <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-if="lotSizes.length === 0">
                      <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">
                          <i class="fas fa-inbox text-gray-400"></i>
                        </div>
                        <p class="text-sm font-medium">Belum ada data lot sizes</p>
                      </td>
                    </tr>
                    <tr v-for="item in lotSizes" :key="item.id" class="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-colors">
                      <td class="px-4 py-3 text-sm text-gray-600 font-medium">#{{ item.id }}</td>
                      <td class="px-4 py-3">
                        <span class="text-sm font-bold text-gray-900">{{ parseFloat(item.size).toFixed(2) }}</span>
                      </td>
                      <td class="px-4 py-3 text-sm text-gray-600">{{ item.order_index }}</td>
                      <td class="px-4 py-3">
                        <span :class="item.is_active ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' : 'bg-gradient-to-br from-gray-400 to-gray-500 text-white'" 
                              class="px-3 py-1 text-xs font-semibold rounded-full">
                          {{ item.is_active ? 'ON' : 'OFF' }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-xs text-gray-500">
                        {{ formatDate(item.created_at) }}
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex gap-2">
                          <button @click="editLotSize(item)" 
                                 class="px-3 py-1.5 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-semibold rounded-lg transition-all shadow-sm">
                            <i class="fas fa-edit text-xs mr-1"></i>Edit
                          </button>
                          <button @click="toggleLotSize(item.id)" 
                                 :class="[item.is_active ? 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'from-gray-400 to-gray-500']"
                                 class="px-3 py-1.5 bg-gradient-to-br text-white text-xs font-semibold rounded-lg transition-all shadow-sm">
                            <i class="fas fa-power-off text-xs mr-1"></i>Tgl
                          </button>
                          <button @click="deleteLotSize(item.id)" 
                                 class="px-3 py-1.5 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-semibold rounded-lg transition-all shadow-sm">
                            <i class="fas fa-trash text-xs mr-1"></i>Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const ADMIN_PASSWORD = 'admin123'

const isLoggedIn = ref(false)
const password = ref('')
const loginError = ref('')
const lotSizes = ref<any[]>([])
const loading = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const editingId = ref<number | null>(null)

const form = reactive({
  size: 0.01,
  order_index: 1,
  is_active: true
})

const activeCount = computed(() => lotSizes.value.filter(item => item.is_active).length)
const inactiveCount = computed(() => lotSizes.value.filter(item => !item.is_active).length)

// Check if logged in (from localStorage)
onMounted(() => {
  if (process.client) {
    const loggedIn = localStorage.getItem('admin_logged_in')
    isLoggedIn.value = loggedIn === 'true'
    if (isLoggedIn.value) {
      loadLotSizes()
    }
  }
})

const handleLogin = () => {
  if (password.value === ADMIN_PASSWORD) {
    if (process.client) {
      localStorage.setItem('admin_logged_in', 'true')
    }
    isLoggedIn.value = true
    loginError.value = ''
    password.value = ''
    loadLotSizes()
  } else {
    loginError.value = 'Password salah!'
  }
}

const logout = () => {
  if (process.client) {
    localStorage.removeItem('admin_logged_in')
  }
  isLoggedIn.value = false
  editingId.value = null
  resetForm()
}

const loadLotSizes = async () => {
  try {
    loading.value = true
    const { supabase } = useSupabase()

    const { data, error } = await supabase
      .from('lot_sizes')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) throw error
    lotSizes.value = data || []
  } catch (error: any) {
    console.error('Error loading lot sizes:', error)
    message.value = 'Error loading data: ' + error.message
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

const saveLotSize = async () => {
  try {
    loading.value = true
    message.value = ''
    const { supabase } = useSupabase()

    if (editingId.value) {
      // Update
      const { error } = await supabase
        .from('lot_sizes')
        .update({
          size: form.size,
          order_index: form.order_index,
          is_active: form.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingId.value)

      if (error) throw error
      message.value = 'Lot size berhasil diperbarui!'
    } else {
      // Create
      const { error } = await supabase
        .from('lot_sizes')
        .insert([{
          size: form.size,
          order_index: form.order_index,
          is_active: form.is_active
        }])

      if (error) throw error
      message.value = 'Lot size berhasil ditambahkan!'
    }

    messageType.value = 'success'
    resetForm()
    await loadLotSizes()
    
    // Clear message after 3 seconds
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error: any) {
    console.error('Error saving lot size:', error)
    message.value = 'Error: ' + error.message
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

const editLotSize = (item: any) => {
  editingId.value = item.id
  form.size = parseFloat(item.size)
  form.order_index = item.order_index
  form.is_active = item.is_active
}

const cancelEdit = () => {
  editingId.value = null
  resetForm()
}

const resetForm = () => {
  form.size = 0.01
  form.order_index = (lotSizes.value.length || 0) + 1
  form.is_active = true
  editingId.value = null
}

const toggleLotSize = async (id: number) => {
  try {
    const item = lotSizes.value.find(i => i.id === id)
    if (!item) return

    const { supabase } = useSupabase()
    const newStatus = !item.is_active

    const { error } = await supabase
      .from('lot_sizes')
      .update({
        is_active: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) throw error

    message.value = 'Status berhasil diubah!'
    messageType.value = 'success'
    await loadLotSizes()
    
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error: any) {
    console.error('Error toggling lot size:', error)
    message.value = 'Error: ' + error.message
    messageType.value = 'error'
  }
}

const deleteLotSize = async (id: number) => {
  if (!confirm('Yakin hapus lot size ini?')) return

  try {
    const { supabase } = useSupabase()

    const { error } = await supabase
      .from('lot_sizes')
      .delete()
      .eq('id', id)

    if (error) throw error

    message.value = 'Lot size berhasil dihapus!'
    messageType.value = 'success'
    await loadLotSizes()
    
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } catch (error: any) {
    console.error('Error deleting lot size:', error)
    message.value = 'Error: ' + error.message
    messageType.value = 'error'
  }
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID')
}
</script>

<style scoped>
/* Styles sudah menggunakan Tailwind CSS */
</style>

