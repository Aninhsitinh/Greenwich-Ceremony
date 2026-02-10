<template>
  <div class="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
    <!-- Premium Header -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
      <div class="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <div class="flex items-center gap-3">
          <!-- Greenwich Logo -->
          <div class="flex items-center gap-2">
            <img 
              src="@/assets/images/inprep-partner-logos-06-300x200.png" 
              alt="Greenwich Vietnam" 
              class="w-12 h-12 object-contain bg-white rounded-xl p-1"
            />
            <div>
              <h2 class="text-gray-900 dark:text-white text-lg font-bold">Greenwich Vietnam</h2>
              <p class="text-xs text-gray-500 dark:text-gray-400">Graduation Portal 2024</p>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button @click="toggleDark" class="w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined text-gray-600 dark:text-gray-300">{{ darkMode ? 'light_mode' : 'dark_mode' }}</span>
          </button>
          <router-link to="/login" class="px-6 py-2 text-primary font-semibold hover:bg-primary/5 rounded-lg transition-colors">
            Sign In
          </router-link>
          <router-link to="/register" class="px-6 py-2 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all">
            Register
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col">
      <!-- Hero Section -->
      <section class="relative min-h-[90vh] flex items-center overflow-hidden">
        <!-- Background -->
        <div class="absolute inset-0">
          <div 
            class="absolute inset-0 bg-cover bg-center"
            :style="`background-image: url('${heroImages[currentImageIndex]}')`"
          ></div>
          <div class="absolute inset-0 bg-gradient-to-br from-primary/90 via-blue-600/80 to-purple-700/90"></div>
        </div>
        
        <!-- Floating decorations -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div class="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style="animation-delay: -2s"></div>
        </div>
        
        <div class="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <!-- Left Content -->
            <div class="text-center lg:text-left">
              <!-- Badge -->
              <div class="inline-block mb-8">
                <span class="bg-white/20 backdrop-blur-sm text-white text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-full border border-white/30">
                  🎓 Class of 2024 Graduation
                </span>
              </div>

              <!-- Hero Title -->
              <h1 class="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
                Your Journey
                <span class="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300">
                  Culminates Here
                </span>
              </h1>

              <!-- Subtitle -->
              <p class="text-xl md:text-2xl text-blue-100 mb-10 max-w-xl">
                Register for your graduation ceremony, book seats for family, and receive your digital ticket.
              </p>

              <!-- CTA Buttons -->
              <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  @click="goToRegister" 
                  class="group px-8 py-4 bg-white text-primary font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  Get Started
                  <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <button 
                  @click="goToLogin" 
                  class="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined">login</span>
                  Student Login
                </button>
              </div>

              <!-- Quick Stats -->
              <div class="mt-12 flex flex-wrap justify-center lg:justify-start gap-8">
                <div class="text-center">
                  <p class="text-4xl font-black text-white">1,500+</p>
                  <p class="text-blue-200 text-sm">Graduates</p>
                </div>
                <div class="text-center">
                  <p class="text-4xl font-black text-white">98%</p>
                  <p class="text-blue-200 text-sm">Employment</p>
                </div>
                <div class="text-center">
                  <p class="text-4xl font-black text-white">100%</p>
                  <p class="text-blue-200 text-sm">Digital</p>
                </div>
              </div>
            </div>

            <!-- Right Content - Feature Cards (Desktop only) -->
            <div class="relative hidden lg:block">
              <div class="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600" 
                  alt="Graduation Ceremony"
                  class="w-full h-80 object-cover rounded-2xl"
                />
                <div class="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span class="material-symbols-outlined text-green-600 text-2xl">verified</span>
                    </div>
                    <div>
                      <p class="font-bold text-gray-900">UK-Accredited</p>
                      <p class="text-sm text-gray-500">International Degrees</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scroll indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <span class="material-symbols-outlined text-4xl text-white/50">expand_more</span>
        </div>
      </section>

      <!-- Partner Universities with SVG Logos -->
      <section class="py-12 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div class="max-w-7xl mx-auto px-4">
          <p class="text-center text-gray-500 dark:text-gray-400 text-sm uppercase tracking-widest mb-8">In Partnership With</p>
          <div class="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <!-- FPT Education -->
            <div class="flex items-center gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-lg transition-all">
              <img 
                src="@/assets/images/FPT_Education_logo.svg.png" 
                alt="FPT Education" 
                class="h-12 object-contain"
              />
            </div>
            
            <!-- University of Greenwich -->
            <div class="flex items-center gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-lg transition-all">
              <img 
                src="@/assets/images/2022-Greenwich-Eng.webp" 
                alt="University of Greenwich" 
                class="h-12 object-contain"
              />
            </div>
            
            <!-- Greenwich Vietnam -->
            <div class="flex items-center gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-lg transition-all">
              <img 
                src="@/assets/images/inprep-partner-logos-06-300x200.png" 
                alt="Greenwich Vietnam" 
                class="h-12 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Key Features -->
      <section class="py-24 bg-gray-50 dark:bg-gray-800">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-16">
            <span class="inline-block px-4 py-2 bg-primary/10 text-primary font-bold text-sm uppercase tracking-wider rounded-full mb-4">Features</span>
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Everything You Need</h2>
            <p class="text-xl text-gray-600 dark:text-gray-400">For a seamless graduation experience</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              v-for="feature in features" 
              :key="feature.title"
              class="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:scale-105 transition-all group border border-gray-100 dark:border-gray-700"
            >
              <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform', feature.bgColor]">
                <span class="material-symbols-outlined text-3xl text-white">{{ feature.icon }}</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">{{ feature.title }}</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="py-24 bg-white dark:bg-gray-900">
        <div class="max-w-6xl mx-auto px-4">
          <div class="text-center mb-16">
            <span class="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-sm uppercase tracking-wider rounded-full mb-4">Process</span>
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">How it Works</h2>
            <p class="text-xl text-gray-600 dark:text-gray-400">Simple steps to your graduation day</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div 
              v-for="(step, index) in steps" 
              :key="index"
              class="relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-xl transition-all"
            >
              <div :class="[
                'w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4',
                index === steps.length - 1 ? 'bg-gradient-to-br from-orange-500 to-red-500' : 'bg-gradient-to-br from-primary to-purple-600'
              ]">
                {{ index + 1 }}
              </div>
              <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ step.title }}</h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm">{{ step.description }}</p>
              
              <!-- Arrow -->
              <div v-if="index < steps.length - 1" class="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                <span class="material-symbols-outlined text-gray-300 dark:text-gray-600">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA -->
      <section class="py-24 bg-gradient-to-br from-primary via-blue-600 to-purple-700 text-white">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <div class="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-8">
            <span class="material-symbols-outlined text-5xl text-white">celebration</span>
          </div>
          <h2 class="text-4xl md:text-5xl font-bold mb-6">Ready to Graduate?</h2>
          <p class="text-xl text-blue-100 mb-10">Start your graduation journey today</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              @click="goToRegister" 
              class="px-10 py-4 bg-white text-primary text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              Start Registration
            </button>
            <button 
              @click="goToLogin" 
              class="px-10 py-4 border-2 border-white/40 text-white text-lg font-bold rounded-2xl hover:bg-white/10 transition-all"
            >
              Already Registered?
            </button>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-gray-900 text-white py-16">
        <div class="max-w-7xl mx-auto px-4">
          <div class="grid md:grid-cols-4 gap-12 mb-12">
            <!-- Brand -->
            <div class="md:col-span-2">
              <div class="flex items-center gap-4 mb-6">
                <img 
                  src="@/assets/images/inprep-partner-logos-06-300x200.png" 
                  alt="Greenwich Vietnam" 
                  class="w-16 h-16 object-contain bg-white rounded-xl p-2"
                />
                <div>
                  <p class="text-2xl font-bold">Greenwich Vietnam</p>
                  <p class="text-gray-400">Part of FPT Education</p>
                </div>
              </div>
              <p class="text-gray-400 max-w-md">
                Empowering the next generation of global professionals through UK-accredited education.
              </p>
            </div>
            
            <!-- Links -->
            <div>
              <h4 class="font-bold mb-4">Quick Links</h4>
              <ul class="space-y-2 text-gray-400">
                <li><a href="#" class="hover:text-white transition-colors">About</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Programs</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" class="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <!-- Contact -->
            <div>
              <h4 class="font-bold mb-4">Contact</h4>
              <ul class="space-y-2 text-gray-400">
                <li class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">mail</span>
                  graduation@greenwich.edu.vn
                </li>
                <li class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">phone</span>
                  (028) 7300 6789
                </li>
              </ul>
            </div>
          </div>
          
          <div class="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            © 2024 FPT Greenwich Vietnam. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const darkMode = ref(false);
const currentImageIndex = ref(0);

const heroImages = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200',
  'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?w=1200'
];

const features = [
  {
    icon: 'how_to_reg',
    title: 'Online Registration',
    description: 'Confirm your attendance, select gown size, and provide details in just a few clicks.',
    bgColor: 'bg-gradient-to-br from-blue-500 to-blue-700'
  },
  {
    icon: 'event_seat',
    title: 'Seat Booking',
    description: 'Reserve preferred seating for your family and loved ones from an interactive floor plan.',
    bgColor: 'bg-gradient-to-br from-purple-500 to-purple-700'
  },
  {
    icon: 'qr_code_2',
    title: 'Digital Check-in',
    description: 'Fast-track entry on the big day with your digital QR pass and gown collection voucher.',
    bgColor: 'bg-gradient-to-br from-green-500 to-green-700'
  }
];

const steps = [
  { title: 'Register', description: 'Confirm eligibility' },
  { title: 'Book Seats', description: 'Choose your spot' },
  { title: 'Get Ticket', description: 'Receive QR pass' },
  { title: 'Graduate!', description: 'Walk the stage' }
];

let imageInterval;

onMounted(() => {
  imageInterval = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % heroImages.length;
  }, 5000);
});

onUnmounted(() => {
  if (imageInterval) clearInterval(imageInterval);
});

const toggleDark = () => {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle('dark');
};

const goToLogin = () => {
  router.push('/login');
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}
</style>
