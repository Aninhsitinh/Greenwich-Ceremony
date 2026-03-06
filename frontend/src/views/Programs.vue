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
      <div class="max-w-6xl mx-auto px-6 py-16">
        <!-- Page Title -->
        <div class="mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Our Programs</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">UK-accredited degrees organized by major fields</p>
        </div>

        <!-- Programs by Major Fields -->
        <div class="space-y-12">
          <!-- 1. Công nghệ thông tin -->
          <div>
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl text-white dark:text-gray-900">computer</span>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Công nghệ thông tin</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pl-0 md:pl-15">
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">Công nghệ thông tin</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">BSc (Hons) Information Technology</p>
              </div>
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">Trí tuệ nhân tạo</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">BSc (Hons) Artificial Intelligence</p>
                <span class="inline-block mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Chuyên ngành hẹp</span>
              </div>
            </div>
          </div>

          <!-- 2. Thiết kế Đồ Họa và Kĩ Thuật Số -->
          <div>
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl text-white dark:text-gray-900">palette</span>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Thiết kế Đồ Họa và Kĩ Thuật Số</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pl-0 md:pl-15">
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">Thiết kế đồ họa & kỹ thuật số</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">BA (Hons) Graphic Design & Digital Arts</p>
              </div>
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">Truyền thông đa phương tiện</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">BA (Hons) Multimedia Communications</p>
              </div>
            </div>
          </div>

          <!-- 3. Quản trị Kinh Doanh -->
          <div>
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl text-white dark:text-gray-900">business_center</span>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Quản trị Kinh Doanh</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pl-0 md:pl-15">
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">Quản trị Kinh doanh</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">BA (Hons) Business Management</p>
              </div>
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">Quản trị Marketing</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">BA (Hons) Marketing Management</p>
                <span class="inline-block mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Chuyên ngành hẹp</span>
              </div>
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">Logistics và Quản lý Chuỗi cung ứng</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">BA (Hons) Logistics & Supply Chain Management</p>
                <span class="inline-block mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Chuyên ngành hẹp</span>
              </div>
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">Kinh doanh quốc tế</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">BA (Hons) International Business</p>
                <span class="inline-block mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Chuyên ngành hẹp</span>
              </div>
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">Quản trị Sự kiện</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">BA (Hons) Event Management</p>
                <span class="inline-block mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Chuyên ngành hẹp</span>
              </div>
              <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">Quản trị Truyền thông</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">BA (Hons) Communications Management</p>
                <span class="inline-block mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Chuyên ngành hẹp</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Why Choose Our Programs?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">UK Accreditation</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                All degrees are awarded by the University of Greenwich, UK
              </p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Industry-Relevant</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Curriculum designed with input from industry professionals
              </p>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Global Opportunities</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Access to international career pathways and networks
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
// No reactive data needed for this static page
</script>
