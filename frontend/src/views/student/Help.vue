<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pb-24">
    <!-- Premium Header -->
    <div class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
      <div class="flex items-center justify-between p-4 max-w-4xl mx-auto">
        <div class="flex items-center gap-3">
          <button @click="$router.back()" class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">Find answers to your questions</p>
          </div>
        </div>
        <img src="@/assets/images/2022-Greenwich-Eng.webp" alt="University of Greenwich" class="h-10 object-contain" />
      </div>
    </div>

    <div class="p-4 max-w-4xl mx-auto">
      <!-- Search Bar -->
      <div class="relative mb-8">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search for help..."
          class="w-full h-14 pl-12 pr-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-lg"
        />
      </div>

      <!-- Quick Help Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button 
          v-for="quick in quickHelp" 
          :key="quick.id"
          @click="scrollToSection(quick.section)"
          class="glass-card p-4 text-center hover:shadow-xl hover:scale-105 transition-all group"
        >
          <div :class="['w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform', quick.bg]">
            <span class="material-symbols-outlined text-2xl text-white">{{ quick.icon }}</span>
          </div>
          <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ quick.label }}</p>
        </button>
      </div>

      <!-- FAQ Section -->
      <div id="faq" class="glass-card p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">help</span>
          Frequently Asked Questions
        </h2>
        
        <div class="space-y-3">
          <div 
            v-for="(faq, index) in filteredFaqs" 
            :key="index"
            class="border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden"
          >
            <button 
              @click="toggleFaq(index)"
              class="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span class="font-semibold text-gray-900 dark:text-white pr-4">{{ faq.question }}</span>
              <span :class="['material-symbols-outlined text-primary transition-transform', expandedFaq === index && 'rotate-180']">
                expand_more
              </span>
            </button>
            <Transition name="accordion">
              <div v-if="expandedFaq === index" class="px-4 pb-4">
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ faq.answer }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Contact Support -->
      <div id="contact" class="glass-card p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">support_agent</span>
          Contact Support
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="mailto:graduation@greenwich.edu.vn" class="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all group">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl text-white">mail</span>
            </div>
            <div>
              <p class="font-bold text-gray-900 dark:text-white">Email Support</p>
              <p class="text-sm text-blue-600 dark:text-blue-400">graduation@greenwich.edu.vn</p>
            </div>
            <span class="material-symbols-outlined ml-auto text-gray-400 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>
          
          <a href="tel:02873006789" class="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 hover:shadow-lg transition-all group">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl text-white">phone</span>
            </div>
            <div>
              <p class="font-bold text-gray-900 dark:text-white">Phone Support</p>
              <p class="text-sm text-green-600 dark:text-green-400">(028) 7300 6789</p>
            </div>
            <span class="material-symbols-outlined ml-auto text-gray-400 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>
        </div>
        
        <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-amber-500">schedule</span>
            <div>
              <p class="font-semibold text-gray-900 dark:text-white">Office Hours</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Monday - Friday: 8:00 AM - 5:00 PM</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Saturday: 8:00 AM - 12:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Important Dates -->
      <div id="dates" class="glass-card p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">event</span>
          Important Dates
        </h2>
        
        <div class="space-y-4">
          <div 
            v-for="date in importantDates" 
            :key="date.title"
            class="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50"
          >
            <div :class="['w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white font-bold', date.isPast ? 'bg-gray-400' : 'bg-gradient-to-br from-primary to-purple-600']">
              <span class="text-xl">{{ date.day }}</span>
              <span class="text-xs uppercase">{{ date.month }}</span>
            </div>
            <div class="flex-1">
              <p class="font-bold text-gray-900 dark:text-white">{{ date.title }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ date.description }}</p>
            </div>
            <span v-if="date.isPast" class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">Passed</span>
            <span v-else class="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">Upcoming</span>
          </div>
        </div>
      </div>

      <!-- Venue Information -->
      <div id="venue" class="glass-card p-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">location_on</span>
          Venue Information
        </h2>
        
        <div class="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl p-6 border border-primary/20 mb-4">
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-2xl text-white">school</span>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white text-lg mb-2">FPT Greenwich Vietnam</h3>
              <div class="space-y-2 text-gray-600 dark:text-gray-400">
                <p class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">location_on</span>
                  590 Vo Van Kiet, Cau Kho Ward, District 1, HCMC
                </p>
                <p class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">schedule</span>
                  Gates open at 7:30 AM
                </p>
                <p class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">directions_car</span>
                  Parking available at basement levels
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="rounded-2xl overflow-hidden h-48 bg-gray-200 dark:bg-gray-800">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5!2d106.69!3d10.76!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ1JzM2LjAiTiAxMDbCsDQxJzI0LjAiRQ!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s"
            width="100%" 
            height="100%" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const expandedFaq = ref(null);

const quickHelp = [
  { id: 1, label: 'Registration', icon: 'how_to_reg', section: 'faq', bg: 'bg-gradient-to-br from-blue-500 to-blue-700' },
  { id: 2, label: 'Payment', icon: 'payments', section: 'faq', bg: 'bg-gradient-to-br from-green-500 to-green-700' },
  { id: 3, label: 'Venue', icon: 'location_on', section: 'venue', bg: 'bg-gradient-to-br from-purple-500 to-purple-700' },
  { id: 4, label: 'Contact', icon: 'support_agent', section: 'contact', bg: 'bg-gradient-to-br from-orange-500 to-orange-700' },
];

const faqs = [
  {
    question: 'How do I register for the graduation ceremony?',
    answer: 'Go to the Registration page from the sidebar menu. Fill in your details including gown size preference, then submit your registration. You will receive a confirmation email once approved.'
  },
  {
    question: 'How many guests can I bring?',
    answer: 'Each graduating student can bring up to 2 guests. You can book additional guest seats for an extra fee if available. Guest tickets must be booked through the Seat Booking page.'
  },
  {
    question: 'What is the dress code for the ceremony?',
    answer: 'Graduates must wear the official academic gown, cap, and hood. Smart formal attire is recommended underneath. Guests should wear formal or business casual attire.'
  },
  {
    question: 'How do I get my graduation gown?',
    answer: 'Gowns can be collected from the designated collection point starting 3 days before the ceremony. Bring your student ID and digital ticket. Gown rental fee must be paid before collection.'
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept Cash, Bank Card (Visa/Mastercard/JCB), and QR payments (VNPay, MoMo, ZaloPay). You can pay online through the Payment page or at the Finance Office.'
  },
  {
    question: 'Can I change my seat after booking?',
    answer: 'Seat changes are allowed up to 7 days before the ceremony, subject to availability. Contact the support team or visit the Seat Booking page to make changes.'
  },
  {
    question: 'What time should I arrive on graduation day?',
    answer: 'Graduates should arrive at least 1 hour before the ceremony starts for registration and group photos. Gates open at 7:30 AM, and the ceremony begins at 9:00 AM.'
  },
  {
    question: 'How do I download my digital ticket?',
    answer: 'Go to the My Ticket page and click Download. The ticket includes a QR code for check-in. You can also save a screenshot for offline access.'
  },
];

const importantDates = [
  { day: '01', month: 'May', title: 'Registration Opens', description: 'Start registering for graduation', isPast: true },
  { day: '15', month: 'May', title: 'Early Bird Payment Deadline', description: 'Get 10% discount on packages', isPast: true },
  { day: '01', month: 'Jun', title: 'Registration Closes', description: 'Last day to register', isPast: false },
  { day: '10', month: 'Jun', title: 'Final Payment Deadline', description: 'Complete all payments', isPast: false },
  { day: '12', month: 'Jun', title: 'Gown Collection Starts', description: 'Collect your academic attire', isPast: false },
  { day: '15', month: 'Jun', title: 'Graduation Ceremony', description: 'The big day!', isPast: false },
];

const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs;
  const query = searchQuery.value.toLowerCase();
  return faqs.filter(faq => 
    faq.question.toLowerCase().includes(query) || 
    faq.answer.toLowerCase().includes(query)
  );
});

const toggleFaq = (index) => {
  expandedFaq.value = expandedFaq.value === index ? null : index;
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.glass-card {
  @apply bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl;
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 200px;
}
</style>
