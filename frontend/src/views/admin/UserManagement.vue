<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Accounts</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage user roles and monitor accounts.</p>
      </div>
      <button 
        @click="showAddStaffModal = true"
        class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-sm">person_add</span>
        Add Staff
      </button>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, or student ID..."
            class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm dark:text-white"
          />
        </div>
        
        <div class="flex items-center gap-4 sm:w-auto w-full">
          <select
            v-model="filterRole"
            class="px-4 py-2 bg-gray-50 flex-1 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm dark:text-white"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <Loading />
    </div>

    <!-- Users Table -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead class="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-6 py-4">User</th>
              <th class="px-6 py-4">Student ID</th>
              <th class="px-6 py-4">Role</th>
              <th class="px-6 py-4">Created At</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="users.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                <span class="material-symbols-outlined text-4xl mb-2">person_off</span>
                <p>No accounts found matching your criteria</p>
              </td>
            </tr>
            <tr
              v-else
              v-for="user in users"
              :key="user._id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    v-if="user.profilePhoto"
                    :src="user.profilePhoto" 
                    :alt="user.fullName"
                    class="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-600 shadow-sm shrink-0"
                  />
                  <img
                    v-else
                    :src="`https://ui-avatars.com/api/?name=${user.fullName}&background=random`"
                    :alt="user.fullName"
                    class="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-600 shadow-sm shrink-0"
                  />
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ user.fullName }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-700 dark:text-gray-300">{{ user.studentId || 'N/A' }}</span>
              </td>
              <td class="px-6 py-4">
                 <select
                  v-model="user.role"
                  @change="updateUserRole(user._id, user.role)"
                  class="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-bold w-fit appearance-none cursor-pointer focus:ring-0"
                  :class="[
                    user.role === 'admin' ? 'text-purple-600 dark:text-purple-400' : 
                    user.role === 'staff' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                  ]"
                >
                  <option value="student">Student</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-600 dark:text-gray-300 text-xs">{{ formatDate(user.createdAt) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="pagination.totalItems > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Showing <span class="font-medium text-gray-900 dark:text-white">{{ users.length }}</span> of
          <span class="font-medium text-gray-900 dark:text-white">{{ pagination.totalItems }}</span> accounts
        </p>
        <div class="flex items-center gap-2">
          <button
            @click="loadPage(pagination.current - 1)"
            :disabled="pagination.current === 1"
            class="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-300"
          >
            <span class="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button
            @click="loadPage(pagination.current + 1)"
            :disabled="pagination.current >= pagination.total"
            class="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-300"
          >
            <span class="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>

  </div>

  <!-- Add Staff Modal -->
  <div v-if="showAddStaffModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span class="material-symbols-outlined">person_add</span>
          Add Staff Account
        </h3>
        <button @click="closeAddStaffModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form @submit.prevent="handleAddStaff" class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
          <input 
            v-model="addStaffForm.fullName"
            type="text" 
            required
            placeholder="E.g., John Doe"
            class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
          <input 
            v-model="addStaffForm.email"
            type="email" 
            required
            placeholder="staff@example.com"
            class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-gray-900 dark:text-white"
          />
        </div>
        
        <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start gap-3 mt-4">
          <span class="material-symbols-outlined text-blue-500 text-lg shrink-0">info</span>
          <p class="text-xs text-blue-700 dark:text-blue-300">
            The account will be created with the staff role and a default password of <strong>123456</strong>. They can change it later.
          </p>
        </div>

        <div class="pt-4 flex gap-3">
          <button 
            type="button" 
            @click="closeAddStaffModal"
            class="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            :disabled="isAddingStaff"
            class="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span v-if="isAddingStaff" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            <span v-else>Create Account</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '@/services/api';
import { useToast } from 'vue-toastification';
import { formatDate } from '@/utils/helpers';
import Loading from '@/components/Loading.vue';

const toast = useToast();

const users = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const filterRole = ref('');

// Add Staff State
const showAddStaffModal = ref(false);
const isAddingStaff = ref(false);
const addStaffForm = ref({
  fullName: '',
  email: ''
});

const closeAddStaffModal = () => {
  showAddStaffModal.value = false;
  addStaffForm.value = { fullName: '', email: '' }; // Reset form
};

const pagination = ref({
  current: 1,
  total: 1,
  count: 0,
  totalItems: 0
});

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const loadUsers = async (page = 1) => {
  loading.value = true;
  try {
    const params = {
      page,
      limit: 20
    };
    
    if (searchQuery.value) params.search = searchQuery.value;
    if (filterRole.value) params.role = filterRole.value;

    const response = await api.get('/admin/users', { params });
    if (response.data.success) {
      users.value = response.data.data.users;
      pagination.value = response.data.data.pagination;
    }
  } catch (error) {
    console.error('Error loading users:', error);
    toast.error('Failed to load accounts list');
  } finally {
    loading.value = false;
  }
};

const updateUserRole = async (userId, newRole) => {
  try {
      const response = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      if (response.data.success) {
          toast.success(response.data.message || `Promoted to ${newRole}`);
      }
  } catch (error) {
     console.error('Error updating user role:', error);
     toast.error(error.response?.data?.message || 'Failed to update user role');
     loadUsers(pagination.value.current); // Revert UI
  }
};

const handleAddStaff = async () => {
  isAddingStaff.value = true;
  try {
    const response = await api.post('/admin/users/staff', addStaffForm.value);
    if (response.data.success) {
      toast.success(response.data.message || 'Staff account created successfully');
      closeAddStaffModal();
      loadUsers(1); // Refresh the list from the first page
    }
  } catch (error) {
    console.error('Error creating staff account:', error);
    toast.error(error.response?.data?.message || 'Failed to create staff account');
  } finally {
    isAddingStaff.value = false;
  }
};

const loadPage = (page) => {
  if (page >= 1 && page <= pagination.value.total) {
    loadUsers(page);
  }
};

watch([searchQuery, filterRole], () => {
  loadUsers(1);
}, { debounce: 500 });

onMounted(() => {
  loadUsers();
});
</script>
