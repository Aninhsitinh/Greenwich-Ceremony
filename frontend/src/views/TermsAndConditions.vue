<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gray-900 dark:bg-white px-8 py-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-white dark:text-gray-900">Terms & Conditions</h1>
        <router-link 
          to="/" 
          class="text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors flex items-center gap-2"
        >
          <span class="material-symbols-outlined">arrow_back</span>
          Back to Home
        </router-link>
      </div>

      <!-- Content -->
      <div class="p-8 prose dark:prose-invert max-w-none">
        <h3>1. Introduction</h3>
        <p>
          Welcome to the University of Greenwich Graduation Portal. by accessing this website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.
        </p>

        <h3>2. Registration & Eligibility</h3>
        <p>
          Graduation registration is open only to eligible students who have successfully completed their academic requirements. The University reserves the right to verify eligibility and cancel registrations that do not meet the criteria.
        </p>

        <h3>3. Ticket & Seat Booking</h3>
        <ul>
          <li>Tickets are non-transferable and must be used by the registered graduate and their guests.</li>
          <li>Seat selection is subject to availability and may be changed by the University for operational reasons.</li>
          <li>Each graduate is entitled to a specific number of guest tickets as determined by the ceremony capacity.</li>
        </ul>

        <h3>4. Code of Conduct</h3>
        <p>
          All attendees are expected to behave in a respectful and dignified manner during the ceremony. The University reserves the right to refuse entry or remove anyone who causes a disturbance.
        </p>

        <h3>5. Photography & Filming</h3>
        <p>
          The graduation ceremony will be filmed and photographed for publicity and archival purposes. By attending, you consent to being filmed and photographed.
        </p>

        <h3>6. Changes to Ceremony</h3>
        <p>
          The University reserves the right to change the date, time, or venue of the ceremony in unforeseen circumstances. We will endeavor to provide as much notice as possible.
        </p>

        <p class="mt-8 text-sm text-gray-500">
          Last updated: February 2026
        </p>
      </div>
      
      <!-- Footer Action -->
      <div class="bg-gray-50 dark:bg-gray-700/50 px-8 py-6 flex justify-end">
        <router-link 
          to="/"
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
