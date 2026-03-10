
<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div class="flex items-center gap-3">
          <img 
            src="@/assets/images/university-of-greenwich.jpg" 
            alt="Greenwich Vietnam" 
            class="w-10 h-10 object-contain"
          />
          <div>
            <h1 class="text-gray-900 dark:text-white text-base font-bold tracking-tight">Greenwich Vietnam</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Graduation Ceremony 2026</p>
          </div>
        </div>
        
        <div class="flex items-center gap-6">
          <nav class="hidden md:flex gap-6 text-sm font-medium">
            <router-link to="/about" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">{{ $t('nav.about', 'About') }}</router-link>
            <router-link to="/programs" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Programs</router-link>
            <router-link to="/contact" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Contact</router-link>
          </nav>
          <div class="w-px h-4 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
          <router-link 
            to="/login" 
            class="text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            {{ $t('nav.login', 'Sign In') }}
          </router-link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>

    <main class="flex-1">
      <!-- Hero Section -->
      <section class="relative pt-20 pb-32 px-6 overflow-hidden">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="z-10">
            <span class="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 dark:bg-blue-900/30 rounded-full">
              Class of 2026
            </span>
            <h2 class="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
              Celebrate Your <br/>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Journey</span>
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
              Join us in honoring your hard work and achievements. A new chapter begins here at the Greenwich Vietnam Graduation Ceremony.
            </p>
            <div class="flex flex-wrap gap-4">
              <router-link 
                to="/programs" 
                class="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center"
              >
                View Programs
              </router-link>
            </div>
          </div>
          <div class="relative z-0">
             <!-- Circular Blob Background -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-70"></div>
            <img 
              src="@/assets/images/Picture8.png" 
              alt="Graduation Moment" 
              class="relative rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700 w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      <!-- About School Section -->
      <section class="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div class="max-w-7xl mx-auto px-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <div class="grid grid-cols-2 gap-4">
               <img src="@/assets/images/Picture3.png" class="rounded-2xl shadow-lg w-full h-64 object-cover transform translate-y-8" alt="Campus Life" />
               <img src="@/assets/images/Picture8.png" class="rounded-2xl shadow-lg w-full h-64 object-cover" alt="Student Activities" />
             </div>
             <div>
               <h3 class="text-sm font-bold tracking-widest text-gray-500 uppercase mb-3">About Us</h3>
               <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Greenwich Vietnam</h2>
               <div class="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                 <p>
                   Formed through a strategic alliance between the University of Greenwich (UK) and FPT University, Greenwich Vietnam has established itself as a premier destination for international education since 2009.
                 </p>
                 <p>
                   We provide a global learning environment where students access the same rigorous curriculum as their peers in the United Kingdom. Our commitment to excellence empowers graduates to thrive in a competitive global landscape.
                 </p>
               </div>
               
               <div class="mt-8 grid grid-cols-2 gap-6">
                 <div>
                   <span class="block text-3xl font-bold text-gray-900 dark:text-white">15+</span>
                   <span class="text-sm text-gray-500">Years of Excellence</span>
                 </div>
                 <div>
                   <span class="block text-3xl font-bold text-gray-900 dark:text-white">20k+</span>
                   <span class="text-sm text-gray-500">Alumni Network</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      <!-- Activities & News Section -->
      <section class="py-24 px-6">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Latest Activities</h2>
            <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Stay updated with the latest events, student stories, and academic highlights from our vibrant community.
            </p>
          </div>

          <!-- Carousel Container -->
          <div class="relative group">
            <!-- Left Button -->
            <button 
                @click="scrollLeft"
                class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 hidden md:flex"
            >
                <span class="material-symbols-outlined">chevron_left</span>
            </button>

            <!-- Right Button -->
            <button 
                @click="scrollRight"
                class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 hidden md:flex"
            >
                <span class="material-symbols-outlined">chevron_right</span>
            </button>

            <!-- Scroll Area -->
            <div 
                ref="carouselRef"
                class="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 px-2"
            >
                <div v-if="loading" class="flex justify-center w-full">
                    <div class="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                </div>

                <template v-else-if="posts.length > 0">
                    <router-link 
                    v-for="post in posts" 
                    :key="post.id"
                    :to="`/posts/${post.id}`"
                    class="min-w-[300px] md:min-w-[400px] snap-center group/card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full"
                    >
                    <div class="h-60 overflow-hidden relative">
                        <img 
                        :src="post.coverImage || '@/assets/images/Picture4-1.png'" 
                        :alt="post.title"
                        class="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-500"
                        @error="$event.target.src = 'https://via.placeholder.com/400x300?text=News'"
                        />
                        <div class="absolute inset-0 bg-black/20 group-hover/card:bg-black/10 transition-colors"></div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col">
                        <div class="flex items-center justify-between mb-4">
                        <span class="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">News</span>
                        <span class="text-xs text-gray-500">{{ formatDate(post.createdAt) }}</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover/card:text-blue-600 transition-colors">
                        {{ post.title }}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                        {{ post.summary }}
                        </p>
                        <!-- Read More Link -->
                        <div class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 group-hover/card:gap-3 transition-all mt-auto">
                        Read More <span class="material-symbols-outlined text-sm">arrow_forward</span>
                        </div>
                    </div>
                    </router-link>
                </template>
            
                <!-- Fallback if no posts -->
                <template v-else>
                    <!-- Static Placeholder 1 -->
                    <article class="min-w-[300px] md:min-w-[400px] snap-center group/card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                    <div class="h-60 overflow-hidden relative">
                        <img src="@/assets/images/Picture4-1.png" alt="Featured Event" class="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-500" />
                    </div>
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-4">
                        <span class="text-xs font-semibold text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">Highlight</span>
                        <span class="text-xs text-gray-500">Oct 15, 2026</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        Student Excellence Awards 2026
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                        Celebrating the outstanding academic and extracurricular achievements of our graduating class. A night to remember for all attendees.
                        </p>
                    </div>
                    </article>
                    
                    <!-- Static Placeholder 2 -->
                    <article class="min-w-[300px] md:min-w-[400px] snap-center group/card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                    <div class="h-60 overflow-hidden relative">
                        <img src="@/assets/images/Picture1.png" alt="Campus Tour" class="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-500" />
                    </div>
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-4">
                        <span class="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">Experience</span>
                        <span class="text-xs text-gray-500">Sep 20, 2026</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        International Cultural Exchange
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                        Students from across the globe gathered at our campus for a vibrant display of culture, food, and music, fostering global citizenship.
                        </p>
                    </div>
                    </article>

                    <!-- Static Placeholder 3 -->
                    <article class="min-w-[300px] md:min-w-[400px] snap-center group/card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                    <div class="h-60 overflow-hidden relative">
                        <img src="@/assets/images/Picture2.png" alt="Workshop" class="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-500" />
                    </div>
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-4">
                        <span class="text-xs font-semibold text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-3 py-1 rounded-full">Workshop</span>
                        <span class="text-xs text-gray-500">Aug 05, 2026</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        Career Readiness Workshop
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                        Industry experts shared insights on resume building and interview skills to prepare our seniors for the professional world.
                        </p>
                    </div>
                    </article>
                </template>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
           <div>
             <h4 class="font-bold text-gray-900 dark:text-white mb-4">Greenwich Vietnam</h4>
             <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
               20 Cộng Hòa, Phường Bảy Hiền, Thành Phố Hồ Chí Minh
             </p>
             <div class="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm h-48">
                <iframe 
                  src="https://maps.google.com/maps?q=%C4%90%E1%BA%A1i%20H%E1%BB%8Dc%20Greenwich%20Vi%E1%BB%87t%20Nam%2020%20Cong%20Hoa&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style="border:0;" 
                  allowfullscreen="" 
                  loading="lazy" 
                  referrerpolicy="no-referrer-when-downgrade">
                </iframe>
             </div>
           </div>
           <div>
             <h4 class="font-bold text-gray-900 dark:text-white mb-4">Quick Links</h4>
             <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
               <li><router-link to="/about" class="hover:text-blue-600">About Us</router-link></li>
               <li><router-link to="/programs" class="hover:text-blue-600">Programs</router-link></li>
               <li><router-link to="/contact" class="hover:text-blue-600">Contact</router-link></li>
             </ul>
           </div>
           <div>
             <h4 class="font-bold text-gray-900 dark:text-white mb-4">Support</h4>
             <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
               <li><router-link to="/faq" class="hover:text-blue-600">FAQ</router-link></li>
               <li><router-link to="/privacy" class="hover:text-blue-600">Privacy Policy</router-link></li>
               <li><router-link to="/terms" class="hover:text-blue-600">Terms of Service</router-link></li>
             </ul>
           </div>
           <div>
             <h4 class="font-bold text-gray-900 dark:text-white mb-4">Follow Us</h4>
             <div class="flex gap-4">
               <a href="https://www.facebook.com/GreenwichVietnam/" target="_blank" rel="noopener noreferrer" class="block transition-transform transform hover:scale-110">
                 <img src="@/assets/images/facebook.png" alt="Facebook" class="w-8 h-8 object-contain" />
               </a>
               <a href="https://www.youtube.com/%C4%91%E1%BA%A1ih%E1%BB%8Dcgreenwichvi%E1%BB%87tnam" target="_blank" rel="noopener noreferrer" class="block transition-transform transform hover:scale-110">
                 <img src="@/assets/images/youtube.png" alt="Youtube" class="w-8 h-8 object-contain" />
               </a>
               <a href="https://www.tiktok.com/@greenwichvietnam" target="_blank" rel="noopener noreferrer" class="block transition-transform transform hover:scale-110">
                 <img src="@/assets/images/tik-tok.png" alt="Tiktok" class="w-8 h-8 object-contain" />
               </a>
               <a href="https://www.instagram.com/universityofgreenwichvn/" target="_blank" rel="noopener noreferrer" class="block transition-transform transform hover:scale-110">
                 <img src="@/assets/images/instagram.png" alt="Instagram" class="w-8 h-8 object-contain" />
               </a>
             </div>
           </div>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-700 pt-8 text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            © 2026 FPT Greenwich Vietnam. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';

const carouselRef = ref(null);
const posts = ref([]);
const loading = ref(false);

const scrollLeft = () => {
    if (carouselRef.value) {
        carouselRef.value.scrollBy({ left: -420, behavior: 'smooth' });
    }
};

const scrollRight = () => {
    if (carouselRef.value) {
        carouselRef.value.scrollBy({ left: 420, behavior: 'smooth' });
    }
};

const formatDate = (dateString) => {
    // Return formatted date or relative time
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const fetchPosts = async () => {
  try {
    loading.value = true;
    const response = await api.get('/posts');
    if (response.data.success) {
      // Get all posts or at least 6 for carousel effect
      posts.value = response.data.data.posts;
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPosts();
});
</script>
