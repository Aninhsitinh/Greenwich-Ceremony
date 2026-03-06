<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <router-link to="/" class="flex items-center gap-3">
          <img 
            src="@/assets/images/university-of-greenwich.jpg" 
            alt="Greenwich Vietnam" 
            class="w-10 h-10 object-contain"
          />
          <div>
            <h2 class="text-gray-900 dark:text-white text-base font-semibold">Greenwich Vietnam</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">Graduation Portal 2026</p>
          </div>
        </router-link>
        <router-link to="/" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          Back to Home
        </router-link>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <div class="max-w-4xl mx-auto px-6 py-16">
        <!-- Page Title -->
        <div class="mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">Get in touch with us for any inquiries</p>
        </div>

        <div class="grid md:grid-cols-2 gap-12">
          <!-- Contact Information -->
          <div>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Contact Information</h2>
            
            <div class="space-y-6">
              <!-- Address -->
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-gray-600 dark:text-gray-400">location_on</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Address</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    20 Cộng Hòa, Phường Bảy Hiền<br />
                    Quận Tân Bình, TP. Hồ Chí Minh<br />
                    Vietnam
                  </p>
                </div>
              </div>

              <!-- Email -->
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-gray-600 dark:text-gray-400">mail</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                  <a href="mailto:graduation@greenwich.edu.vn" class="text-gray-600 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white">
                    greenwichvietnamgraduation@gmail.com
                  </a>
                </div>
              </div>

              <!-- Hotline & Phone -->
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-gray-600 dark:text-gray-400">phone</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Hotline & Phone</h3>
                  <div class="text-gray-600 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white flex flex-col gap-1">
                    <p>Hotline: <a href="tel:0933108554">0933.108.554</a> - <a href="tel:0971294545">0971.294.545</a></p>
                    <p>Điện thoại: <a href="tel:02873002266">028.7300.2266</a></p>
                  </div>
                </div>
              </div>

              <!-- Office Hours -->
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-gray-600 dark:text-gray-400">schedule</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Office Hours</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    Monday - Friday: 8:00 AM - 5:00 PM<br />
                    Saturday: 8:00 AM - 12:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
            
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Name -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  v-model="form.name"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <!-- Subject -->
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  v-model="form.subject"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"
                  placeholder="What is this regarding?"
                />
              </div>

              <!-- Message -->
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  v-model="form.message"
                  required
                  rows="5"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? 'Sending...' : 'Send Message' }}
              </button>
            </form>

            <!-- Success Message -->
            <div v-if="submitted" class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p class="text-sm text-green-800 dark:text-green-300">
                {{ successMessage }}
              </p>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p class="text-sm text-red-800 dark:text-red-300">
                {{ error }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          © 2026 FPT Greenwich Vietnam. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const submitted = ref(false);
const loading = ref(false);
const error = ref('');
const successMessage = ref('');

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = '';
    submitted.value = false;

    // Make API call to send email
    const response = await api.post('/contact', {
      name: form.value.name,
      email: form.value.email,
      subject: form.value.subject,
      message: form.value.message
    });

    // Show success message
    submitted.value = true;
    successMessage.value = response.data.message || 'Thank you for your message! We\'ll get back to you soon.';

    // Reset form after 5 seconds
    setTimeout(() => {
      form.value = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
      submitted.value = false;
    }, 5000);

  } catch (err) {
    console.error('Contact form error:', err);
    error.value = err.response?.data?.message || 'Failed to send message. Please try again later or contact us directly.';
    
    // Clear error after 5 seconds
    setTimeout(() => {
      error.value = '';
    }, 5000);
  } finally {
    loading.value = false;
  }
};
</script>
