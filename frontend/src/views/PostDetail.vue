
<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <router-link to="/" class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <span class="material-symbols-outlined">arrow_back</span>
          Back to Home
        </router-link>
        
        <router-link to="/" class="font-bold text-gray-900 dark:text-white">Greenwich Vietnam</router-link>
      </div>
    </header>

    <main class="flex-1 pb-24">
      <div v-if="loading" class="flex justify-center py-24">
        <div class="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>

      <div v-else-if="error" class="text-center py-24">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <span class="material-symbols-outlined text-3xl">error_outline</span>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Post not found</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">{{ error }}</p>
        <router-link to="/" class="text-blue-600 hover:underline">Return to Home</router-link>
      </div>

      <article v-else class="max-w-4xl mx-auto px-6">
        <!-- Hero Image -->
        <div class="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden my-8 shadow-2xl relative">
          <img 
            :src="post.coverImage || '@/assets/images/Picture4-1.png'" 
            :alt="post.title"
            class="w-full h-full object-cover"
            @error="$event.target.src = 'https://via.placeholder.com/800x600?text=Post+Image'"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-8 md:p-12 w-full">
            <div class="flex items-center gap-4 mb-4 text-white/90 text-sm font-medium">
               <span class="bg-blue-600 px-3 py-1 rounded-full text-white text-xs uppercase tracking-wide">News</span>
               <span>{{ formatDate(post.createdAt) }}</span>
               <span v-if="post.author">by {{ post.author.fullName }}</span>
            </div>
            <h1 class="text-3xl md:text-5xl font-bold text-white leading-tight mb-4 shadow-sm">
              {{ post.title }}
            </h1>
            <p class="text-lg text-gray-200 line-clamp-2 max-w-2xl">
              {{ post.summary }}
            </p>
          </div>
        </div>

        <!-- Content -->
        <div class="prose prose-lg dark:prose-invert max-w-none">
          <!-- Render Markdown-like content (simple implementation) -->
           <!-- Note: In a real app we'd use a markdown library like marked.js. 
                For now we'll just handle basic paragraphs and headers via CSS/whitespace 
                or assume HTMLsafe content if admin is trusted. 
                Since this is user generated content from admin, we'll display text with whitespace preserving. -->
          <div class="whitespace-pre-wrap font-['Times_New_Roman',_Times,_serif] text-gray-800 dark:text-gray-300 leading-relaxed text-lg">
            {{ post.content }}
          </div>
        </div>
        
        <!-- Share/Footer -->
        <div class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div class="text-sm text-gray-500">
            Posted in Announcements
          </div>
          <div class="flex gap-4">
            <button class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
              <span class="material-symbols-outlined">share</span>
            </button>
            <button class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
              <span class="material-symbols-outlined">bookmark_border</span>
            </button>
          </div>
        </div>
      </article>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';

const route = useRoute();
const post = ref(null);
const loading = ref(true);
const error = ref('');

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const fetchPost = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/posts/${route.params.id}`);
    if (response.data.success) {
      post.value = response.data.data.post;
    } else {
      error.value = 'Failed to load post';
    }
  } catch (err) {
    console.error('Error fetching post:', err);
    error.value = err.response?.data?.message || 'Post not found';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPost();
});
</script>
