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
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">About Us</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">Learn more about Greenwich Vietnam and our graduation portal</p>
        </div>

        <!-- Content Sections -->
        <div class="space-y-12">
          <!-- Greenwich Vietnam -->
          <section>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Greenwich Vietnam</h2>
            <div class="prose dark:prose-invert max-w-none">
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Greenwich Vietnam is part of FPT Education, offering UK-accredited degrees from the prestigious University of Greenwich. 
                We provide world-class education with a focus on practical skills and global perspectives.
              </p>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our programs are designed to prepare students for successful careers in today's competitive global marketplace, 
                combining academic excellence with real-world experience.
              </p>
            </div>
          </section>

          <!-- Our Mission -->
          <section>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
              To empower the next generation of global professionals through high-quality, UK-accredited education that emphasizes 
              innovation, critical thinking, and practical application. We strive to create an environment where students can thrive 
              and reach their full potential.
            </p>
          </section>

          <!-- Graduation Portal -->
          <section>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Graduation Portal</h2>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Our digital graduation portal streamlines the entire graduation process, making it easier than ever for students to:
            </p>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-gray-400 mt-0.5">check_circle</span>
                <span class="text-gray-600 dark:text-gray-400">Register for the graduation ceremony online</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-gray-400 mt-0.5">check_circle</span>
                <span class="text-gray-600 dark:text-gray-400">Book seats for family members and guests</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-gray-400 mt-0.5">check_circle</span>
                <span class="text-gray-600 dark:text-gray-400">Receive digital tickets and QR codes for fast check-in</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-gray-400 mt-0.5">check_circle</span>
                <span class="text-gray-600 dark:text-gray-400">Access important ceremony information and updates</span>
              </li>
            </ul>
          </section>

          <!-- Statistics -->
          <section class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">By the Numbers</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="text-center">
                <p class="text-4xl font-bold text-gray-900 dark:text-white mb-2">1,500+</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Graduates Annually</p>
              </div>
              <div class="text-center">
                <p class="text-4xl font-bold text-gray-900 dark:text-white mb-2">98%</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Employment Rate</p>
              </div>
              <div class="text-center">
                <p class="text-4xl font-bold text-gray-900 dark:text-white mb-2">100%</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Digital Process</p>
              </div>
            </div>
          </section>

          <!-- Partnership -->
          <section>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Partnership</h2>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              We are proud to partner with the University of Greenwich, UK, and FPT Education to deliver internationally 
              recognized degrees that open doors to global career opportunities.
            </p>
            <div class="flex flex-wrap items-center gap-8">
              <img 
                src="@/assets/images/FPT_Education_logo.svg.png" 
                alt="FPT Education" 
                class="h-12 object-contain"
              />
              <img 
                src="@/assets/images/2022-Greenwich-Eng.webp" 
                alt="University of Greenwich" 
                class="h-12 object-contain"
              />
            </div>
          </section>
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
// No reactive data needed for this static page
</script>
