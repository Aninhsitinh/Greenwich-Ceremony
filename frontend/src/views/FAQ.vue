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
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">Find answers to common questions about graduation</p>
        </div>

        <!-- FAQ Accordion -->
        <div class="space-y-4">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full px-6 py-4 flex items-center justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-left"
            >
              <span class="font-semibold text-gray-900 dark:text-white pr-4">{{ faq.question }}</span>
              <span class="material-symbols-outlined text-gray-400 flex-shrink-0 transition-transform" :class="{ 'rotate-180': openIndex === index }">
                expand_more
              </span>
            </button>
            <div 
              v-show="openIndex === index"
              class="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
            >
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ faq.answer }}</p>
            </div>
          </div>
        </div>

        <!-- Additional Help -->
        <div class="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Still have questions?</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Can't find the answer you're looking for? Please contact our support team.
          </p>
          <router-link 
            to="/contact"
            class="inline-flex items-center gap-2 px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <span class="material-symbols-outlined text-sm">mail</span>
            Contact Support
          </router-link>
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

const openIndex = ref(null);

const toggleFaq = (index) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const faqs = [
  {
    question: 'How do I register for the graduation ceremony?',
    answer: 'To register, simply log in to the portal using your student credentials and navigate to the registration page. Complete all required fields including your gown size preferences and guest information. Once submitted, you will receive a confirmation email.'
  },
  {
    question: 'Can I book seats for my family members?',
    answer: 'Yes! After completing your registration, you can book seats for your family and guests. The interactive seating chart allows you to select preferred seats based on availability. Each student can book up to 4 guest seats.'
  },
  {
    question: 'When will I receive my digital ticket?',
    answer: 'Your digital ticket with QR code will be generated automatically once you complete both your registration and seat booking. You can access and download it from your dashboard at any time.'
  },
  {
    question: 'What should I do if I can\'t attend the ceremony?',
    answer: 'If you are unable to attend, please update your registration status in the portal as soon as possible. This will allow us to plan accordingly and free up seats for other students\' guests.'
  },
  {
    question: 'How do I collect my graduation gown?',
    answer: 'After registration, you will receive a gown collection voucher with your digital ticket. Present this QR code at the designated collection point on campus during the specified collection period before the ceremony.'
  },
  {
    question: 'Can I change my seat booking after confirmation?',
    answer: 'Yes, you can modify your seat booking up to 7 days before the ceremony date. After this deadline, changes cannot be made. To modify, go to your booking confirmation page and select "Change Seats".'
  },
  {
    question: 'What if I forget my login credentials?',
    answer: 'Click on "Forgot Password" on the login page and follow the instructions to reset your password. If you continue to experience issues, contact our support team at graduation@greenwich.edu.vn.'
  },
  {
    question: 'Is there a dress code for the graduation ceremony?',
    answer: 'Yes, students must wear formal business attire under their graduation gowns. For men: dress shirt, tie, and dress pants. For women: formal dress or blouse with skirt/pants. Closed-toe shoes are required for all graduates.'
  },
  {
    question: 'What time should I arrive on graduation day?',
    answer: 'Graduates should arrive at least 2 hours before the ceremony start time for check-in, gown fitting verification, and lineup arrangement. Guests should arrive at least 30 minutes before the ceremony begins.'
  },
  {
    question: 'Will there be photography services available?',
    answer: 'Yes, professional photography and videography services will be available during the ceremony. Additional individual and group photo sessions can be arranged. Details about packages and pricing will be sent to your registered email.'
  }
];
</script>
