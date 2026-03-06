<template>
  <ResponsiveLayout
    :navigation="navigation"
    :bottom-navigation="bottomNavigation"
    :page-title="$t('student.help_title')"
  >
    <div class="w-full max-w-4xl mx-auto px-4 py-6">
      
      <!-- Search Bar -->
      <div class="relative mb-8">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search for help..."
          class="w-full h-12 pl-12 pr-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent outline-none transition-all dark:text-white"
        />
      </div>

      <!-- Quick Help Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button 
          v-for="quick in quickHelp" 
          :key="quick.id"
          @click="scrollToSection(quick.section)"
          class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
        >
          <div class="w-10 h-10 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
            <span class="material-symbols-outlined text-gray-700 dark:text-gray-300">{{ quick.icon }}</span>
          </div>
          <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ quick.label }}</p>
        </button>
      </div>

      <!-- FAQ Section -->
      <div id="faq" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700">
           <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <span class="material-symbols-outlined text-gray-500">help</span>
             Frequently Asked Questions
           </h2>
        </div>
        
        <div class="divide-y divide-gray-100 dark:divide-gray-700">
          <div 
            v-for="(faq, index) in filteredFaqs" 
            :key="index"
            class="group"
          >
            <button 
              @click="toggleFaq(index)"
              class="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <span class="font-medium text-gray-900 dark:text-white pr-4">{{ faq.question }}</span>
              <span :class="['material-symbols-outlined text-gray-400 transition-transform', expandedFaq === index && 'rotate-180']">
                expand_more
              </span>
            </button>
            <div v-show="expandedFaq === index" class="px-4 pb-4">
              <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Contact Support -->
        <div id="contact" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden h-fit">
          <div class="p-6 border-b border-gray-100 dark:border-gray-700">
             <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
               <span class="material-symbols-outlined text-gray-500">support_agent</span>
               Contact Support
             </h2>
          </div>
          
          <div class="p-6 space-y-4">
            <a href="mailto:graduation@greenwich.edu.vn" class="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors group">
              <div class="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <span class="material-symbols-outlined text-gray-600 dark:text-gray-400">mail</span>
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white text-sm">Email Support</p>
                <p class="text-xs text-blue-600 dark:text-blue-400">graduation@greenwich.edu.vn</p>
              </div>
            </a>
            
            <div class="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors group">
              <div class="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <span class="material-symbols-outlined text-gray-600 dark:text-gray-400">phone</span>
              </div>
              <div class="flex-1">
                <p class="font-bold text-gray-900 dark:text-white text-sm mb-1">Hotline & Phone</p>
                <div class="flex flex-col gap-1">
                   <p class="text-xs text-green-600 dark:text-green-400">
                     Hotline: <a href="tel:0933108554" class="hover:underline">0933.108.554</a> - <a href="tel:0971294545" class="hover:underline">0971.294.545</a>
                   </p>
                   <p class="text-xs text-green-600 dark:text-green-400">
                     Điện thoại: <a href="tel:02873002266" class="hover:underline">028.7300.2266</a>
                   </p>
                </div>
              </div>
            </div>
            
            <div class="pt-4 border-t border-gray-100 dark:border-gray-700">
               <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Office Hours</p>
               <p class="text-sm text-gray-600 dark:text-gray-400">Mon - Fri: 8:00 AM - 5:00 PM</p>
               <p class="text-sm text-gray-600 dark:text-gray-400">Sat: 8:00 AM - 12:00 PM</p>
            </div>
          </div>
        </div>

        <!-- Venue Information -->
        <div id="venue" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden h-fit">
          <div class="p-6 border-b border-gray-100 dark:border-gray-700">
             <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
               <span class="material-symbols-outlined text-gray-500">location_on</span>
               Venue Information
             </h2>
          </div>
          
          <div class="bg-gray-100 dark:bg-gray-700 h-48 relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5!2d106.69!3d10.76!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ1JzM2LjAiTiAxMDbCsDQxJzI0LjAiRQ!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s"
                width="100%" 
                height="100%" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy"
              ></iframe>
          </div>
          
          <div class="p-6">
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">FPT Greenwich Vietnam</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">590 Vo Van Kiet, Cau Kho Ward, District 1, HCMC</p>
            
            <div class="flex gap-2 text-xs text-gray-500">
               <span class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">Gates open 7:30 AM</span>
               <span class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">Parking available</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </ResponsiveLayout>
</template>

<script setup>
const { t } = useI18n();
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';

const searchQuery = ref('');
const expandedFaq = ref(null);

const navigation = computed(() => [
  { path: '/student/dashboard', icon: 'dashboard', label: t('student.nav_dashboard') },
  { path: '/student/profile', icon: 'person', label: t('student.nav_profile') },
  { path: '/student/ticket', icon: 'qr_code_2', label: t('student.nav_ticket') },
  { path: '/student/seat-booking', icon: 'event_seat', label: t('student.nav_seats') },
  { path: '/student/gown-collection', icon: 'checkroom', label: t('student.nav_gown') },
  { path: '/student/booking-confirmation', icon: 'payments', label: t('student.nav_payments') },
  { path: '/student/chat', icon: 'support_agent', label: t('student.nav_chat') }
]);

const bottomNavigation = computed(() => [
  { path: '/student/dashboard', icon: 'dashboard', label: t('student.nav_home') },
  { path: '/student/ticket', icon: 'qr_code_2', label: t('student.nav_ticket_short') },
  { path: '/student/seat-booking', icon: 'event_seat', label: t('student.nav_seats_short') },
  { path: '/student/profile', icon: 'person', label: t('student.nav_profile') }
]);

const quickHelp = [
  { id: 1, label: 'Registration', icon: 'how_to_reg', section: 'faq' },
  { id: 2, label: 'Payment', icon: 'payments', section: 'faq' },
  { id: 3, label: 'Venue', icon: 'location_on', section: 'venue' },
  { id: 4, label: 'Contact', icon: 'support_agent', section: 'contact' },
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
    question: 'How do I download my digital ticket?',
    answer: 'Go to the My Ticket page and click Download. The ticket includes a QR code for check-in. You can also save a screenshot for offline access.'
  },
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
