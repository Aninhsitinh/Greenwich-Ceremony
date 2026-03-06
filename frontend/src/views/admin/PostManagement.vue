
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Post Management</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Manage news and activity posts</p>
      </div>
      <button
        @click="openModal()"
        class="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
      >
        <span class="material-symbols-outlined">add</span>
        New Post
      </button>
    </div>

    <!-- Posts List -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
    </div>

    <div v-else-if="posts.length === 0" class="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-700">
      <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="material-symbols-outlined text-3xl text-gray-400">article</span>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts yet</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">Start by creating your first post.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="post in posts"
        :key="post.id"
        class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group"
      >
        <!-- Image Placeholder -->
        <div class="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
             <img
                v-if="post.coverImage && post.coverImage !== 'default-post.jpg'"
                :src="post.coverImage"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Post cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <span class="material-symbols-outlined text-4xl">image</span>
            </div>
          <div class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click="openModal(post)"
              class="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-lg hover:text-blue-600 transition-colors"
              title="Edit"
            >
              <span class="material-symbols-outlined text-sm">edit</span>
            </button>
            <button
              @click="deletePost(post.id)"
              class="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-lg hover:text-red-600 transition-colors"
              title="Delete"
            >
              <span class="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        </div>

        <div class="p-5">
          <div class="flex items-center gap-2 mb-3">
            <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                {{ formatDate(post.createdAt) }}
            </span>
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{{ post.title }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">{{ post.summary }}</p>
          <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span class="material-symbols-outlined text-sm">person</span>
            {{ post.author?.fullName || 'Admin' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Post' : 'New Post' }}
          </h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form @submit.prevent="savePost" class="p-6 space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              v-model="form.title"
              type="text"
              required
              maxlength="100"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"
              placeholder="Enter post title"
            />
          </div>

          <!-- Summary -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary</label>
            <textarea
              v-model="form.summary"
              required
              rows="2"
              maxlength="200"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"
              placeholder="Brief summary for the card view"
            ></textarea>
          </div>

          <!-- Content -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
            <textarea
              v-model="form.content"
              required
              rows="6"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent font-mono text-sm"
              placeholder="Full content (Markdown supported)"
            ></textarea>
          </div>

          <!-- Cover Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image</label>
            <div class="space-y-3">
                <!-- Preview -->
                <div v-if="form.coverImage" class="relative group w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                    <img :src="form.coverImage" alt="Preview" class="w-full h-full object-cover" />
                    <button 
                        @click="form.coverImage = ''"
                        type="button"
                        class="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                        title="Remove Image"
                    >
                        <span class="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>

                <!-- Upload Input -->
                <div v-else class="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer relative">
                    <input 
                        type="file" 
                        accept="image/*"
                        @change="handleImageUpload"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        :disabled="uploading"
                    />
                    <div class="text-center">
                        <div v-if="uploading">
                            <div class="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
                            <span class="text-sm text-gray-500 dark:text-gray-400">Uploading...</span>
                        </div>
                        <div v-else>
                            <span class="material-symbols-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
                            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload image</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                        </div>
                    </div>
                </div>
                
                <!-- Fallback URL Input (Optional) -->
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span class="material-symbols-outlined text-gray-400 text-sm">link</span>
                    </div>
                     <input
                      v-model="form.coverImage"
                      type="text"
                      class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"
                      placeholder="Or enter image URL here..."
                    />
                </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <div v-if="saving" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              {{ isEditing ? 'Update Post' : 'Publish Post' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const posts = ref([]);
const loading = ref(true);
const saving = ref(false);
const showModal = ref(false);
const isEditing = ref(false);

const form = ref({
  id: null,
  title: '',
  summary: '',
  content: '',
  coverImage: ''
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const fetchPosts = async () => {
  try {
    loading.value = true;
    const response = await api.get('/posts');
    if (response.data.success) {
      posts.value = response.data.data.posts;
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  } finally {
    loading.value = false;
  }
};

const openModal = (post = null) => {
  if (post) {
    isEditing.value = true;
    form.value = { ...post };
  } else {
    isEditing.value = false;
    form.value = { id: null, title: '', summary: '', content: '', coverImage: '' };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const uploading = ref(false);

const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
    }

    try {
        uploading.value = true;
        const formData = new FormData();
        formData.append('image', file);
        
        // Ensure '/api/upload' route exists in backend
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.success) {
            form.value.coverImage = response.data.url;
        }
    } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload image. Please try again.');
    } finally {
        uploading.value = false;
        // Reset input value to allow re-selecting same file if needed
        event.target.value = '';
    }
};

const savePost = async () => {
  try {
    saving.value = true;
    if (isEditing.value) {
      await api.put(`/posts/${form.value.id}`, form.value);
    } else {
      await api.post('/posts', form.value);
    }
    await fetchPosts();
    closeModal();
  } catch (error) {
    console.error('Failed to save post:', error);
    alert(error.response?.data?.message || 'Failed to save post');
  } finally {
    saving.value = false;
  }
};

const deletePost = async (id) => {
  if (!confirm('Are you sure you want to delete this post?')) return;
  
  try {
    await api.delete(`/posts/${id}`);
    await fetchPosts();
  } catch (error) {
    console.error('Failed to delete post:', error);
    alert('Failed to delete post');
  }
};

onMounted(() => {
  fetchPosts();
});
</script>
