<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    page-title="Ceremony Registration"
  >
    <div class="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      <!-- Header Section -->
      <div class="modern-card text-center relative overflow-hidden">
        <div class="absolute inset-0 opacity-5" style="background: linear-gradient(135deg, #003B5C, #00A3E0);"></div>
        <div class="relative z-10 p-8">
          <div class="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style="background: linear-gradient(135deg, #003B5C, #00A3E0);">
            <span class="material-symbols-outlined text-white text-4xl">school</span>
          </div>
          <h1 class="text-3xl font-bold mb-2" style="color: #111827; font-family: 'Montserrat', sans-serif;">Graduation Ceremony 2024</h1>
          <p class="text-gray-600">University of Greenwich • Confirm Your Attendance</p>
        </div>
      </div>

      <!-- Messages -->
      <div v-if="successMessage" class="modern-card" style="background: linear-gradient(135deg, rgba(0, 166, 81, 0.1), rgba(22, 163, 74, 0.05)); border-color: #00A651;">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined" style="color: #00A651;">check_circle</span>
          <p class="font-semibold" style="color: #00A651;">{{ successMessage }}</p>
        </div>
      </div>

      <div v-if="error" class="modern-card" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05)); border-color: #ef4444;">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined" style="color: #ef4444;">error</span>
          <p class="font-semibold" style="color: #ef4444;">{{ error }}</p>
        </div>
      </div>

      <!-- Existing Registration -->
      <div v-if="hasRegistration && !editing" class="space-y-6">
        <div class="modern-card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold flex items-center gap-3" style="color: #111827; font-family: 'Montserrat', sans-serif;">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, #00A651, #16a34a);">
                <span class="material-symbols-outlined text-white text-2xl">how_to_reg</span>
              </div>
              Your Registration
            </h2>
            <span class="px-4 py-2 rounded-full font-bold text-sm" :style="statusBadgeStyle">
              {{ registration.status || 'CONFIRMED' }}
            </span>
          </div>

          <div class="grid md:grid-cols-2 gap-4 mb-6">
            <!-- Ceremony Date -->
            <div class="info-card">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: rgba(0, 163, 224, 0.1);">
                  <span class="material-symbols-outlined" style="color: #00A3E0;">calendar_month</span>
                </div>
                <div>
                  <p class="text-xs" style="color: #6b7280;">Ceremony Date</p>
                  <p class="font-bold" style="color: #111827;">June 15, 2024</p>
                </div>
              </div>
            </div>

            <!-- Gown Size -->
            <div class="info-card">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: rgba(255, 184, 28, 0.1);">
                  <span class="material-symbols-outlined" style="color: #FFB81C;">checkroom</span>
                </div>
                <div>
                  <p class="text-xs" style="color: #6b7280;">Gown Size</p>
                  <p class="font-bold" style="color: #111827;">{{ registration.gownSize || 'Not specified' }}</p>
                </div>
              </div>
            </div>

            <!-- Dietary Requirements -->
            <div v-if="registration.dietaryRequirements" class="info-card md:col-span-2">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: rgba(0, 166, 81, 0.1);">
                  <span class="material-symbols-outlined" style="color: #00A651;">restaurant</span>
                </div>
                <div class="flex-1">
                  <p class="text-xs" style="color: #6b7280;">Dietary Requirements</p>
                  <p class="font-semibold" style="color: #111827;">{{ registration.dietaryRequirements }}</p>
                </div>
              </div>
            </div>

            <!-- Special Needs -->
            <div v-if="registration.specialNeeds" class="info-card md:col-span-2">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: rgba(139, 92, 246, 0.1);">
                  <span class="material-symbols-outlined" style="color: #8b5cf6;">accessible</span>
                </div>
                <div class="flex-1">
                  <p class="text-xs" style="color: #6b7280;">Special Accessibility Needs</p>
                  <p class="font-semibold" style="color: #111827;">{{ registration.specialNeeds }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button @click="editing = true" class="action-button flex-1" style="background: linear-gradient(135deg, #003B5C, #00A3E0);">
              <span class="material-symbols-outlined">edit</span>
              Edit Registration
            </button>
            <button @click="confirmCancel" class="action-button" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Registration Form -->
      <div v-else class="modern-card">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-3" style="color: #111827; font-family: 'Montserrat', sans-serif;">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, #003B5C, #00A3E0);">
            <span class="material-symbols-outlined text-white text-2xl">edit_document</span>
          </div>
          Confirm Your Attendance
        </h2>

        <form @submit.prevent="submitRegistration" class="space-y-6">
          <!-- Ceremony Info -->
          <div class="info-banner">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style="background: rgba(0, 163, 224, 0.1);">
                <span class="material-symbols-outlined" style="color: #00A3E0;">info</span>
              </div>
              <div>
                <p class="font-bold mb-1" style="color: #003B5C;">Ceremony Details</p>
                <p class="text-sm" style="color: #6b7280;">📅 <strong>Date:</strong> June 15, 2024</p>
                <p class="text-sm" style="color: #6b7280;">🕒 <strong>Time:</strong> 9:00 AM</p>
                <p class="text-sm" style="color: #6b7280;">📍 <strong>Venue:</strong> University Arena</p>
              </div>
            </div>
          </div>

          <!-- Gown Size Selection -->
          <div>
            <label class="label-text">Gown Size <span style="color: #ef4444;">*</span></label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              <button
                v-for="size in gownSizes"
                :key="size"
                type="button"
                @click="form.gownSize = size"
                class="size-option"
                :class="{ 'size-option-selected': form.gownSize === size }"
              >
                <span class="material-symbols-outlined">checkroom</span>
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Dietary Requirements -->
          <div>
            <label class="label-text">Dietary Requirements</label>
            <p class="text-xs mb-2" style="color: #6b7280;">Let us know if you have any dietary restrictions</p>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
              <button
                v-for="diet in dietaryOptions"
                :key="diet"
                type="button"
                @click="toggleDietary(diet)"
                class="dietary-option"
                :class="{ 'dietary-option-selected': form.dietaryRequirements.includes(diet) }"
              >
                {{ diet }}
              </button>
            </div>
            <input
              v-model="form.dietaryOther"
              type="text"
              placeholder="Other dietary requirements..."
              class="form-input"
            />
          </div>

          <!-- Special Accessibility Needs -->
          <div>
            <label class="label-text">Special Accessibility Needs</label>
            <p class="text-xs mb-2" style="color: #6b7280;">Please specify any accessibility requirements</p>
            <textarea
              v-model="form.specialNeeds"
              rows="3"
              placeholder="E.g., wheelchair access, sign language interpreter, hearing loop..."
              class="form-input"
            ></textarea>
          </div>

          <!-- Guest Count -->
          <div>
            <label class="label-text">Number of Guests</label>
            <p class="text-xs mb-2" style="color: #6b7280;">Maximum 3 guests per graduate</p>
            <div class="flex items-center gap-4">
              <button
                type="button"
                @click="form.guestCount = Math.max(0, form.guestCount - 1)"
                class="counter-button"
              >
                <span class="material-symbols-outlined">remove</span>
              </button>
              <div class="counter-display">{{ form.guestCount }}</div>
              <button
                type="button"
                @click="form.guestCount = Math.min(3, form.guestCount + 1)"
                class="counter-button"
              >
                <span class="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>

          <!-- Confirmation -->
          <div class="confirmation-box">
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                v-model="form.confirmed"
                type="checkbox"
                class="mt-1"
                style="width: 20px; height: 20px; accent-color: #00A3E0;"
              />
              <div>
                <p class="font-semibold" style="color: #111827;">I confirm my attendance</p>
                <p class="text-sm" style="color: #6b7280;">I understand that this registration is required to attend the graduation ceremony and receive my certificate.</p>
              </div>
            </label>
          </div>

          <!-- Submit Button -->
          <div class="flex gap-3">
            <button
              v-if="editing"
              type="button"
              @click="cancelEdit"
              class="action-button"
              style="background: #e5e7eb; color: #374151;"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!form.confirmed || !form.gownSize || loading"
              class="action-button flex-1"
              :style="!form.confirmed || !form.gownSize || loading 
                ? 'background: #e5e7eb; color: #9ca3af; cursor: not-allowed;' 
                : 'background: linear-gradient(135deg, #00A651, #16a34a);'"
            >
              <div v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <template v-else>
                <span class="material-symbols-outlined">check_circle</span>
                {{ editing ? 'Update Registration' : 'Confirm Attendance' }}
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </ResponsiveLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';
import api from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();

const navigation = [
  { path: '/student/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/student/profile', icon: 'person', label: 'My Profile' },
  { path: '/student/ticket', icon: 'qr_code_2', label: 'My Ticket' },
  { path: '/student/seat-booking', icon: 'event_seat', label: 'Guest Seats' },
  { path: '/student/gown-collection', icon: 'checkroom', label: 'Gown Collection' },
  { path: '/student/booking-confirmation', icon: 'payments', label: 'Payments' }
];

const bottomNavigation = [
  { path: '/student/dashboard', icon: 'dashboard', label: 'Home' },
  { path: '/student/ticket', icon: 'qr_code_2', label: 'Ticket' },
  { path: '/student/seat-booking', icon: 'event_seat', label: 'Seats' },
  { path: '/student/profile', icon: 'person', label: 'Profile' }
];

const registration = ref(null);
const editing = ref(false);
const loading = ref(false);
const error = ref('');
const successMessage = ref('');

const form = ref({
  gownSize: '',
  dietaryRequirements: [],
  dietaryOther: '',
  specialNeeds: '',
  guestCount: 0,
  confirmed: false
});

const gownSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const dietaryOptions = ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'Nut Allergy'];

const hasRegistration = computed(() => !!registration.value);

const statusBadgeStyle = computed(() => {
  const status = registration.value?.status || 'CONFIRMED';
  if (status === 'CONFIRMED') return 'background: #00A651; color: white;';
  if (status === 'PENDING') return 'background: #FFB81C; color: white;';
  return 'background: #e5e7eb; color: #6b7280;';
});

const toggleDietary = (option) => {
  const index = form.value.dietaryRequirements.indexOf(option);
  if (index > -1) {
    form.value.dietaryRequirements.splice(index, 1);
  } else {
    form.value.dietaryRequirements.push(option);
  }
};

const loadRegistration = async () => {
  try {
    const response = await api.get('/registrations/me');
    if (response.data.success && response.data.data) {
      registration.value = response.data.data;
      // Populate form for editing
      form.value = {
        gownSize: registration.value.gownSize || '',
        dietaryRequirements: registration.value.dietaryRequirements?.split(', ').filter(d => dietaryOptions.includes(d)) || [],
        dietaryOther: registration.value.dietaryRequirements?.split(', ').find(d => !dietaryOptions.includes(d)) || '',
        specialNeeds: registration.value.specialNeeds || '',
        guestCount: registration.value.guestCount || 0,
        confirmed: true
      };
    }
  } catch (err) {
    // 404 means user hasn't registered yet - this is normal
    if (err.response?.status === 404) {
      registration.value = null;
    } else {
      console.error('Error loading registration:', err);
      error.value = 'Failed to load registration data';
    }
  }
};

const submitRegistration = async () => {
  if (!form.value.confirmed || !form.value.gownSize) {
    error.value = 'Please fill in all required fields and confirm attendance';
    return;
  }

  loading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    const dietaryReqs = [...form.value.dietaryRequirements];
    if (form.value.dietaryOther) {
      dietaryReqs.push(form.value.dietaryOther);
    }

    const data = {
      ceremonyDate: '2024-06-15',
      gownSize: form.value.gownSize,
      dietaryRequirements: dietaryReqs.join(', '),
      specialNeeds: form.value.specialNeeds,
      guestCount: form.value.guestCount
    };

    if (editing.value) {
      await api.put(`/registrations/${registration.value._id}`, data);
      successMessage.value = 'Registration updated successfully!';
      editing.value = false;
      await loadRegistration();
    } else {
      await api.post('/registrations', data);
      
      // Update journey status and refresh user data
      await authStore.refreshUser();
      
      // Show success message briefly then redirect to Dashboard
      successMessage.value = 'Attendance confirmed! Redirecting to dashboard...';
      
      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        router.push('/student/dashboard');
      }, 1500);
    }
  } catch (err) {
    console.error('Registration error:', err);
    error.value = err.response?.data?.message || 'Failed to register. Please try again.';
  } finally {
    loading.value = false;
  }
};

const cancelEdit = () => {
  editing.value = false;
  loadRegistration();
};

const confirmCancel = () => {
  if (confirm('Are you sure you want to cancel your registration? This action cannot be undone.')) {
    cancelRegistration();
  }
};

const cancelRegistration = async () => {
  loading.value = true;
  try {
    await api.delete(`/registrations/${registration.value._id}`);
    registration.value = null;
    successMessage.value = 'Registration cancelled successfully';
    form.value = {
      gownSize: '',
      dietaryRequirements: [],
      dietaryOther: '',
      specialNeeds: '',
      guestCount: 0,
      confirmed: false
    };
  } catch (err) {
    error.value = 'Failed to cancel registration';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadRegistration();
});
</script>

<style scoped>
.modern-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
}

.info-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  transition: all 0.3s ease;
}

.info-card:hover {
  background: white;
  border-color: #00A3E0;
  box-shadow: 0 4px 12px rgba(0, 163, 224, 0.1);
}

.info-banner {
  background: linear-gradient(135deg, rgba(0, 163, 224, 0.05), rgba(0, 59, 92, 0.05));
  border: 1px solid rgba(0, 163, 224, 0.2);
  border-radius: 16px;
  padding: 20px;
}

.label-text {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #00A3E0;
  box-shadow: 0 0 0 4px rgba(0, 163, 224, 0.1);
}

.size-option {
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-weight: 600;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.size-option:hover {
  border-color: #00A3E0;
  background: rgba(0, 163, 224, 0.05);
}

.size-option-selected {
  background: linear-gradient(135deg, #00A3E0, #0891b2);
  border-color: #00A3E0;
  color: white;
}

.dietary-option {
  padding: 10px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.dietary-option:hover {
  border-color: #00A651;
  background: rgba(0, 166, 81, 0.05);
}

.dietary-option-selected {
  background: linear-gradient(135deg, #00A651, #16a34a);
  border-color: #00A651;
  color: white;
}

.counter-button {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.counter-button:hover {
  background: #00A3E0;
  border-color: #00A3E0;
  color: white;
}

.counter-display {
  width: 80px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
}

.confirmation-box {
  background: linear-gradient(135deg, rgba(0, 166, 81, 0.05), rgba(22, 163, 74, 0.03));
  border: 2px solid rgba(0, 166, 81, 0.2);
  border-radius: 16px;
  padding: 20px;
}

.action-button {
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: white;
  transition: all 0.3s ease;
}

.action-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 0.8s linear infinite;
}
</style>
