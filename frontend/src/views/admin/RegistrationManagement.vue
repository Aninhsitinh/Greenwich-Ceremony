<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('admin.registration_management')"
  >
    <div class="w-full max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Registration Management</h1>
        <p class="text-gray-600 dark:text-gray-400">Review and approve student ceremony registrations</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="glass-card p-5 border-transparent border-l-4 border-l-green-500 hover-lift">
          <div class="flex items-center justify-between mb-2">
            <span class="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
            <Badge variant="success">Approved</Badge>
          </div>
          <p class="text-3xl font-black text-gray-900 dark:text-white mb-1">{{ approvedCount }}</p>
          <p class="text-xs font-bold text-gray-500 uppercase tracking-tighter">Approved</p>
        </div>
        <div class="glass-card p-5 border-transparent border-l-4 border-l-orange-500 hover-lift">
          <div class="flex items-center justify-between mb-2">
            <span class="material-symbols-outlined text-orange-600 text-3xl">pending</span>
            <Badge variant="warning">Pending</Badge>
          </div>
          <p class="text-3xl font-black text-gray-900 dark:text-white mb-1">{{ pendingCount }}</p>
          <p class="text-xs font-bold text-gray-500 uppercase tracking-tighter">Pending Review</p>
        </div>
        <div class="glass-card p-5 border-transparent border-l-4 border-l-red-500 hover-lift">
          <div class="flex items-center justify-between mb-2">
            <span class="material-symbols-outlined text-red-600 text-3xl">cancel</span>
            <Badge variant="error">Rejected</Badge>
          </div>
          <p class="text-3xl font-black text-gray-900 dark:text-white mb-1">{{ rejectedCount }}</p>
          <p class="text-xs font-bold text-gray-500 uppercase tracking-tighter">Rejected</p>
        </div>
        <div class="glass-card p-5 border-transparent border-l-4 border-l-blue-500 hover-lift">
          <div class="flex items-center justify-between mb-2">
            <span class="material-symbols-outlined text-blue-600 text-3xl">groups</span>
            <Badge variant="info">Total</Badge>
          </div>
          <p class="text-3xl font-black text-gray-900 dark:text-white mb-1">{{ registrations.length }}</p>
          <p class="text-xs font-bold text-gray-500 uppercase tracking-tighter">Total Registrations</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="glass-card p-6 border-transparent mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search student..."
            class="px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border-2 border-transparent focus:border-primary rounded-xl transition-all dark:text-white font-medium"
          />
          <select
            v-model="filterStatus"
            class="px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border-2 border-transparent focus:border-primary rounded-xl transition-all dark:text-white font-medium cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            v-model="sortBy"
            class="px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border-2 border-transparent focus:border-primary rounded-xl transition-all dark:text-white font-medium cursor-pointer"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      <!-- Registrations List -->
      <div class="space-y-4">
        <div
          v-for="registration in filteredRegistrations"
          :key="registration._id"
          class="glass-card p-6 border-transparent hover:border-primary/20 transition-all duration-300 group"
        >
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="flex items-start gap-4 flex-1">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {{ registration.student?.fullName?.charAt(0) || 'S' }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ registration.student?.fullName || 'Unknown Student' }}
                  </h3>
                  <Badge
                    :variant="
                      registration.status === 'approved' ? 'success' :
                      registration.status === 'rejected' ? 'error' :
                      'warning'
                    "
                  >
                    {{ registration.status }}
                  </Badge>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-lg">badge</span>
                    <span>{{ registration.student?.studentId || 'N/A' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-lg">email</span>
                    <span>{{ registration.student?.email || 'N/A' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-lg">school</span>
                    <span>{{ registration.student?.major || 'N/A' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-lg">calendar_today</span>
                    <span>{{ formatDate(registration.createdAt) }}</span>
                  </div>
                </div>
                <div v-if="registration.notes" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    <span class="font-semibold">Notes:</span> {{ registration.notes }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-wrap gap-2 lg:flex-col lg:w-40">
              <button
                v-if="registration.status === 'pending'"
                @click="approveRegistration(registration)"
                class="btn bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 py-2"
              >
                <span class="material-symbols-outlined text-lg">check_circle</span>
                <span>Approve</span>
              </button>
              <button
                v-if="registration.status === 'pending'"
                @click="rejectRegistration(registration)"
                class="btn bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 py-2"
              >
                <span class="material-symbols-outlined text-lg">cancel</span>
                <span>Reject</span>
              </button>
              <button
                @click="viewDetails(registration)"
                class="btn glass-card border-transparent py-2 text-gray-700 dark:text-gray-300"
              >
                <span class="material-symbols-outlined text-lg">visibility</span>
                <span>View Details</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredRegistrations.length === 0" class="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
          <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">inbox</span>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No Registrations Found</h3>
          <p class="text-gray-600 dark:text-gray-400">Try adjusting your filters</p>
        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';
import Badge from '@/components/Badge.vue';
import api from '@/services/api';

const navigation = [
  { path: '/admin', icon: 'dashboard', label: 'Dashboard' },
  { path: '/admin/students', icon: 'group', label: 'Student Management' },
  { path: '/admin/registrations', icon: 'how_to_reg', label: 'Registrations' },
  { path: '/admin/tickets', icon: 'confirmation_number', label: 'Ticket Management' },
  { path: '/admin/seats', icon: 'event_seat', label: 'Seat Management' },
  { path: '/admin/announcements', icon: 'campaign', label: 'Announcements' },
  { path: '/admin/settings', icon: 'settings', label: 'System Settings' }
];

const bottomNavigation = [
  { path: '/admin', icon: 'home', label: 'Home' },
  { path: '/admin/students', icon: 'group', label: 'Students' },
  { path: '/admin/registrations', icon: 'how_to_reg', label: 'Register' },
  { path: '/admin/settings', icon: 'settings', label: 'Settings' }
];

const registrations = ref([]);
const searchQuery = ref('');
const filterStatus = ref('');
const sortBy = ref('date');
const loading = ref(false);

const filteredRegistrations = computed(() => {
  let result = registrations.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(r =>
      r.student?.fullName?.toLowerCase().includes(query) ||
      r.student?.studentId?.toLowerCase().includes(query) ||
      r.student?.email?.toLowerCase().includes(query)
    );
  }

  if (filterStatus.value) {
    result = result.filter(r => r.status === filterStatus.value);
  }

  // Sort
  result.sort((a, b) => {
    if (sortBy.value === 'date') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy.value === 'name') {
      return (a.student?.fullName || '').localeCompare(b.student?.fullName || '');
    }
    return 0;
  });

  return result;
});

const approvedCount = computed(() => registrations.value.filter(r => r.status === 'approved').length);
const pendingCount = computed(() => registrations.value.filter(r => r.status === 'pending').length);
const rejectedCount = computed(() => registrations.value.filter(r => r.status === 'rejected').length);

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const fetchRegistrations = async () => {
  try {
    loading.value = true;
    const response = await api.get('/registrations');
    registrations.value = response.data.data || [];
  } catch (error) {
    console.error('Error fetching registrations:', error);
    // Mock data
    registrations.value = [
      {
        _id: '1',
        student: {
          fullName: 'John Doe',
          studentId: 'GCS220001',
          email: 'john.doe@student.fpt.edu.vn',
          major: 'Computer Science'
        },
        status: 'pending',
        createdAt: new Date(),
        notes: 'First registration of the day'
      },
      {
        _id: '2',
        student: {
          fullName: 'Jane Smith',
          studentId: 'GCS220002',
          email: 'jane.smith@student.fpt.edu.vn',
          major: 'Information Technology'
        },
        status: 'approved',
        createdAt: new Date(Date.now() - 86400000),
        notes: ''
      }
    ];
  } finally {
    loading.value = false;
  }
};

const approveRegistration = async (registration) => {
  try {
    await api.patch(`/registrations/${registration._id}`, { status: 'approved' });
    registration.status = 'approved';
    alert('Registration approved successfully!');
  } catch (error) {
    console.error('Error approving registration:', error);
    alert('Failed to approve registration');
  }
};

const rejectRegistration = async (registration) => {
  const reason = prompt('Please provide a reason for rejection:');
  if (!reason) return;

  try {
    await api.patch(`/registrations/${registration._id}`, {
      status: 'rejected',
      rejectionReason: reason
    });
    registration.status = 'rejected';
    alert('Registration rejected');
  } catch (error) {
    console.error('Error rejecting registration:', error);
    alert('Failed to reject registration');
  }
};

const viewDetails = (registration) => {
  alert(`Viewing details for ${registration.student?.fullName}`);
};

onMounted(() => {
  fetchRegistrations();
});
</script>
