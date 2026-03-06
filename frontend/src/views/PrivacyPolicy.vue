<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gray-900 dark:bg-white px-8 py-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-white dark:text-gray-900">Privacy Policy</h1>
        <router-link 
          to="/register" 
          class="text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors flex items-center gap-2"
        >
          <span class="material-symbols-outlined">arrow_back</span>
          Back to Register
        </router-link>
      </div>

      <!-- Content -->
      <div class="p-8 prose dark:prose-invert max-w-none">
        <h3>1. Information We Collect</h3>
        <p>
          We collect personal information necessary for graduation registration, including:
        </p>
        <ul>
          <li>Student ID, Name, and Contact Information</li>
          <li>Academic Program details</li>
          <li>Guest information for ticketing</li>
          <li>Dietary and special access requirements</li>
        </ul>

        <h3>2. How We Use Your Information</h3>
        <p>
          Your information is used strictly for organizing the graduation ceremony, including:
        </p>
        <ul>
          <li>Verifying eligibility for graduation</li>
          <li>Issuing tickets and allocating seats</li>
          <li>Communicating ceremony details</li>
          <li>Producing graduation materials (e.g., brochures, certificates)</li>
        </ul>

        <h3>3. Data Sharing</h3>
        <p>
          We do not sell your personal data. We may share limited information with third-party service providers essential for the event (e.g., gown hire companies, photographers) under strict data protection agreements.
        </p>

        <h3>4. Data Security</h3>
        <p>
          We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h3>5. Your Rights</h3>
        <p>
          You have the right to access, correct, or request deletion of your personal data. Please contact the graduation office for any privacy-related concerns.
        </p>

        <p class="mt-8 text-sm text-gray-500">
          Last updated: February 2026
        </p>
      </div>

      <!-- Footer Action -->
      <div class="bg-gray-50 dark:bg-gray-700/50 px-8 py-6 flex justify-end">
        <router-link 
          to="/register"
          class="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          I Understand
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script logic needed for static content
</script>
