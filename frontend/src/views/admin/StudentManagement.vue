<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('admin.student_management')"
  >
    <div class="w-full max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Student Management</h1>
          <p class="text-gray-600 dark:text-gray-400">Manage all student records and registrations</p>
        </div>
        <button
          @click="showAddModal = true"
          class="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 shadow-lg"
        >
          <span class="material-symbols-outlined">person_add</span>
          <span>Add Student</span>
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
          <div class="flex items-center justify-between mb-3">
            <span class="material-symbols-outlined text-4xl opacity-80">group</span>
            <span class="text-xs bg-white/20 px-2 py-1 rounded-full">Total</span>
          </div>
          <p class="text-3xl font-bold mb-1">{{ students.length }}</p>
          <p class="text-sm text-blue-100">Total Students</p>
        </div>
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
          <div class="flex items-center justify-between mb-3">
            <span class="material-symbols-outlined text-4xl opacity-80">verified</span>
            <span class="text-xs bg-white/20 px-2 py-1 rounded-full">Active</span>
          </div>
          <p class="text-3xl font-bold mb-1">{{ activeStudents }}</p>
          <p class="text-sm text-green-100">Active Students</p>
        </div>
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <div class="flex items-center justify-between mb-3">
            <span class="material-symbols-outlined text-4xl opacity-80">how_to_reg</span>
            <span class="text-xs bg-white/20 px-2 py-1 rounded-full">Registered</span>
          </div>
          <p class="text-3xl font-bold mb-1">{{ registeredStudents }}</p>
          <p class="text-sm text-purple-100">Registered</p>
        </div>
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg">
          <div class="flex items-center justify-between mb-3">
            <span class="material-symbols-outlined text-4xl opacity-80">pending</span>
            <span class="text-xs bg-white/20 px-2 py-1 rounded-full">Pending</span>
          </div>
          <p class="text-3xl font-bold mb-1">{{ pendingStudents }}</p>
          <p class="text-sm text-orange-100">Pending Review</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="🔍 Search by name, ID, email..."
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
            />
          </div>
          <select
            v-model="filterMajor"
            class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
          >
            <option value="">All Majors</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Business Administration">Business Administration</option>
          </select>
          <select
            v-model="filterStatus"
            class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
          </select>
        </div>
      </div>

      <!-- Student Table -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">All Students</h2>
            <div class="flex gap-2">
              <button class="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600">
                <span class="material-symbols-outlined text-lg">filter_list</span>
                <span class="hidden sm:inline">Filter</span>
              </button>
              <button class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90">
                <span class="material-symbols-outlined text-lg">download</span>
                <span class="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Student
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Major
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Class
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="student in filteredStudents"
                :key="student._id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold">
                      {{ student.fullName.charAt(0) }}
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 dark:text-white">{{ student.fullName }}</p>
                      <p class="text-xs text-gray-500">{{ student.studentId }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div>
                    <p class="text-sm text-gray-900 dark:text-white">{{ student.email }}</p>
                    <p class="text-xs text-gray-500">{{ student.phone || 'N/A' }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-900 dark:text-white">{{ student.major }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-900 dark:text-white">{{ student.classOf }}</span>
                </td>
                <td class="px-6 py-4">
                  <Badge :variant="student.isActive ? 'success' : 'default'">
                    {{ student.isActive ? 'Active' : 'Inactive' }}
                  </Badge>
                </td>
                <td class="px-6 py-4">
                  <div class="flex gap-2">
                    <button
                      @click="viewStudent(student)"
                      class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <span class="material-symbols-outlined text-lg">visibility</span>
                    </button>
                    <button
                      @click="editStudent(student)"
                      class="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <span class="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button
                      @click="deleteStudent(student)"
                      class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <span class="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="p-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Showing <span class="font-semibold">{{ filteredStudents.length }}</span> of <span class="font-semibold">{{ students.length }}</span> students
            </p>
            <div class="flex gap-2">
              <button class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600">
                Previous
              </button>
              <button class="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';
import Badge from '@/components/Badge.vue';
import api from '@/services/api';

const router = useRouter();

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

const students = ref([]);
const searchQuery = ref('');
const filterMajor = ref('');
const filterStatus = ref('');
const showAddModal = ref(false);
const loading = ref(false);

const filteredStudents = computed(() => {
  let result = students.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(s =>
      s.fullName.toLowerCase().includes(query) ||
      s.studentId.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query)
    );
  }

  if (filterMajor.value) {
    result = result.filter(s => s.major === filterMajor.value);
  }

  if (filterStatus.value) {
    result = result.filter(s => {
      if (filterStatus.value === 'active') return s.isActive;
      if (filterStatus.value === 'inactive') return !s.isActive;
      return true;
    });
  }

  return result;
});

const activeStudents = computed(() => students.value.filter(s => s.isActive).length);
const registeredStudents = computed(() => students.value.filter(s => s.hasRegistered).length);
const pendingStudents = computed(() => students.value.filter(s => !s.hasRegistered).length);

const fetchStudents = async () => {
  try {
    loading.value = true;
    const response = await api.get('/users?role=student');
    students.value = response.data.data || [];
  } catch (error) {
    console.error('Error fetching students:', error);
    // Use mock data if API fails
    students.value = [
      {
        _id: '1',
        fullName: 'John Doe',
        studentId: 'GCS220001',
        email: 'john.doe@student.fpt.edu.vn',
        phone: '+84 123 456 789',
        major: 'Computer Science',
        classOf: '2026',
        isActive: true,
        hasRegistered: true
      },
      {
        _id: '2',
        fullName: 'Jane Smith',
        studentId: 'GCS220002',
        email: 'jane.smith@student.fpt.edu.vn',
        phone: '+84 987 654 321',
        major: 'Information Technology',
        classOf: '2026',
        isActive: true,
        hasRegistered: true
      }
    ];
  } finally {
    loading.value = false;
  }
};

const viewStudent = (student) => {
  router.push(`/admin/students/${student._id}`);
};

const editStudent = (student) => {
  router.push(`/admin/students/${student._id}/edit`);
};

const deleteStudent = async (student) => {
  if (confirm(`Are you sure you want to delete ${student.fullName}?`)) {
    try {
      await api.delete(`/users/${student._id}`);
      students.value = students.value.filter(s => s._id !== student._id);
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  }
};

onMounted(() => {
  fetchStudents();
});
</script>
