<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="'Import Management'"
  >
    <div class="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-8 lg:p-10 shadow-2xl text-white">
        <div class="absolute inset-0">
          <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        </div>
        
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border-2 border-white/30">
              <span class="material-symbols-outlined text-4xl">upload_file</span>
            </div>
            <div>
              <p class="text-white/80 text-sm font-semibold uppercase tracking-wider">Data Administration</p>
              <h1 class="text-4xl font-black">Excel Data Import</h1>
            </div>
          </div>
          <p class="text-white/90 text-lg max-w-2xl">Bulk register students and confirm payments using Excel spreadsheets</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Student Import Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
              <span class="material-symbols-outlined">group_add</span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Import Student List</h2>
              <p class="text-xs text-gray-500">Register or update multiple students at once</p>
            </div>
          </div>
          
          <div class="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group mb-6"
            @click="$refs.studentInput.click()">
            <input type="file" ref="studentInput" class="hidden" accept=".xlsx, .xls" @change="handleFileChange($event, 'students')">
            <span class="material-symbols-outlined text-5xl text-gray-300 group-hover:text-indigo-400 mb-2 transition-colors">cloud_upload</span>
            <p class="font-bold text-gray-600 dark:text-gray-400" v-if="!files.students">Drop your Excel file here or click to browse</p>
            <p class="font-bold text-indigo-600" v-else>{{ files.students.name }}</p>
            <p class="text-[10px] text-gray-400 mt-2">Required: Student ID, Full Name, Ceremony Date, Gown Size</p>
          </div>

          <button 
            @click="uploadFile('students')"
            :disabled="!files.students || loading.students"
            class="w-full py-4 bg-indigo-600 text-white rounded-xl font-black shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <span v-if="loading.students" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ loading.students ? 'Processing...' : 'Upload Student List' }}
          </button>
        </div>

        <!-- Payment Import Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
              <span class="material-symbols-outlined">payments</span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Import Payment Status</h2>
              <p class="text-xs text-gray-500">Confirm deposit payments from accounting records</p>
            </div>
          </div>
          
          <div class="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group mb-6"
            @click="$refs.paymentInput.click()">
            <input type="file" ref="paymentInput" class="hidden" accept=".xlsx, .xls" @change="handleFileChange($event, 'payments')">
            <span class="material-symbols-outlined text-5xl text-gray-300 group-hover:text-emerald-400 mb-2 transition-colors">price_check</span>
            <p class="font-bold text-gray-600 dark:text-gray-400" v-if="!files.payments">Drop your Excel file here or click to browse</p>
            <p class="font-bold text-emerald-600" v-else>{{ files.payments.name }}</p>
            <p class="text-[10px] text-gray-400 mt-2">Required: Student ID, Amount, Transaction ID, Payment Date</p>
          </div>

          <button 
            @click="uploadFile('payments')"
            :disabled="!files.payments || loading.payments"
            class="w-full py-4 bg-emerald-600 text-white rounded-xl font-black shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <span v-if="loading.payments" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ loading.payments ? 'Processing...' : 'Upload Payment List' }}
          </button>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="results" class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Import Results</h2>
        <div class="flex items-center gap-12 mb-6">
          <div>
            <p class="text-3xl font-black text-emerald-500">{{ results.success }}</p>
            <p class="text-xs text-gray-400 uppercase font-bold tracking-widest">Succeeded</p>
          </div>
          <div>
            <p class="text-3xl font-black text-rose-500">{{ results.failed }}</p>
            <p class="text-xs text-gray-400 uppercase font-bold tracking-widest">Failed</p>
          </div>
        </div>
        
        <div v-if="results.errors.length > 0" class="space-y-2 max-h-60 overflow-y-auto custom-scrollbar p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
          <p class="text-xs font-bold text-rose-500 uppercase">Error Logs:</p>
          <div v-for="(error, i) in results.errors" :key="i" class="text-xs text-gray-500 flex gap-2">
            <span class="text-rose-400 shrink-0">•</span>
            <span>{{ error }}</span>
          </div>
        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';
import api from '@/services/api';
import { useToast } from 'vue-toastification';

const { t } = useI18n();
const toast = useToast();

const loading = ref({ students: false, payments: false });
const files = ref({ students: null, payments: null });
const results = ref(null);

const navigation = computed(() => [
  { path: '/staff', icon: 'dashboard', label: t('staff.nav_dashboard') },
  { path: '/staff/qr-scanner', icon: 'qr_code_scanner', label: t('staff.nav_qr') },
  { path: '/staff/gown-collection', icon: 'checkroom', label: t('staff.nav_gown') },
  { path: '/staff/logistics', icon: 'inventory_2', label: 'Logistics' },
  { path: '/staff/excel-import', icon: 'upload_file', label: 'Excel Import' },
  { path: '/staff/finance', icon: 'payments', label: 'Refunds' },
  { path: '/staff/seat-management', icon: 'event_seat', label: t('staff.nav_seat') },
  { path: '/staff/student-list', icon: 'group', label: t('staff.nav_students') },
  { path: '/staff/monitor', icon: 'monitor_heart', label: t('staff.nav_monitor') },
  { path: '/staff/settings', icon: 'settings', label: t('staff.nav_settings') }
]);

const bottomNavigation = computed(() => [
  { path: '/staff', icon: 'home', label: t('staff.nav_home') },
  { path: '/staff/qr-scanner', icon: 'qr_code_scanner', label: t('staff.nav_scan') },
  { path: '/staff/excel-import', icon: 'upload_file', label: 'Import' },
  { path: '/staff/finance', icon: 'payments', label: 'Refunds' },
  { path: '/staff/student-list', icon: 'group', label: t('staff.nav_students') }
]);

const handleFileChange = (event, type) => {
  const file = event.target.files[0];
  if (file) {
    files.value[type] = file;
    results.value = null;
  }
};

const uploadFile = async (type) => {
  if (!files.value[type]) return;
  
  loading.value[type] = true;
  const formData = new FormData();
  formData.append('file', files.value[type]);
  
  try {
    const endpoint = type === 'students' ? '/import/students' : '/import/payments';
    const response = await api.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    if (response.data.success) {
      results.value = response.data.data;
      files.value[type] = null;
      toast.success(response.data.message);
    }
  } catch (error) {
    console.error(`Error uploading ${type}:`, error);
    toast.error(error.response?.data?.message || `Failed to import ${type}`);
  } finally {
    loading.value[type] = false;
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb; /* gray-200 */
  border-radius: 9999px;
  height: 32px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #374151; /* gray-700 */
}
</style>
