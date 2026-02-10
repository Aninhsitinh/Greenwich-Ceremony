<template>
  <div class="flex flex-col w-full">
    <label v-if="label" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Upload Area -->
    <div
      @click="triggerFileInput"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      :class="[
        'border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all',
        isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600 hover:border-primary',
        disabled && 'opacity-50 cursor-not-allowed'
      ]"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="handleFileSelect"
        class="hidden"
        :disabled="disabled"
      />

      <!-- Upload Icon & Text -->
      <div v-if="!previewUrl && files.length === 0" class="text-center">
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span class="material-symbols-outlined text-3xl text-gray-400">cloud_upload</span>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-1">
          <span class="text-primary font-semibold">Click to upload</span> or drag and drop
        </p>
        <p class="text-xs text-gray-500">{{ acceptText }}</p>
      </div>

      <!-- Image Preview -->
      <div v-else-if="previewUrl && !multiple" class="relative">
        <img :src="previewUrl" alt="Preview" class="max-h-64 mx-auto rounded-lg" />
        <button
          v-if="!disabled"
          @click.stop="removeFile"
          class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
        >
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <!-- Multiple Files List -->
      <div v-else-if="files.length > 0 && multiple" class="space-y-2">
        <div
          v-for="(file, index) in files"
          :key="index"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <span class="material-symbols-outlined text-primary">insert_drive_file</span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ file.name }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
          <button
            v-if="!disabled"
            @click.stop="removeFileAtIndex(index)"
            class="text-red-500 hover:text-red-600"
          >
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Upload Progress -->
    <div v-if="uploading" class="mt-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">Uploading...</span>
        <span class="text-sm font-semibold text-primary">{{ uploadProgress }}%</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          class="bg-primary h-2 rounded-full transition-all duration-300"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="text-red-500 text-xs mt-2">{{ error }}</p>

    <!-- Hint -->
    <p v-else-if="hint" class="text-gray-500 dark:text-gray-400 text-xs mt-2">{{ hint }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { formatFileSize } from '@/utils/helpers';
import api from '@/services/api';

const props = defineProps({
  label: String,
  accept: {
    type: String,
    default: 'image/*'
  },
  acceptText: {
    type: String,
    default: 'PNG, JPG, GIF up to 5MB'
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB
  },
  multiple: Boolean,
  required: Boolean,
  disabled: Boolean,
  uploadUrl: {
    type: String,
    default: '/upload'
  },
  hint: String,
  autoUpload: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'upload-success', 'upload-error']);

const fileInput = ref(null);
const files = ref([]);
const previewUrl = ref('');
const isDragging = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);
const error = ref('');

const triggerFileInput = () => {
  if (!props.disabled) {
    fileInput.value?.click();
  }
};

const handleFileSelect = (event) => {
  const selectedFiles = Array.from(event.target.files);
  processFiles(selectedFiles);
};

const handleDrop = (event) => {
  isDragging.value = false;
  if (props.disabled) return;

  const droppedFiles = Array.from(event.dataTransfer.files);
  processFiles(droppedFiles);
};

const processFiles = (selectedFiles) => {
  error.value = '';

  // Validate files
  for (const file of selectedFiles) {
    if (file.size > props.maxSize) {
      error.value = `File ${file.name} is too large. Max size is ${formatFileSize(props.maxSize)}`;
      return;
    }
  }

  if (props.multiple) {
    files.value = [...files.value, ...selectedFiles];
  } else {
    files.value = [selectedFiles[0]];
    // Create preview for single image
    if (selectedFiles[0].type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrl.value = e.target.result;
      };
      reader.readAsDataURL(selectedFiles[0]);
    }
  }

  emit('update:modelValue', props.multiple ? files.value : files.value[0]);

  if (props.autoUpload) {
    uploadFiles();
  }
};

const removeFile = () => {
  files.value = [];
  previewUrl.value = '';
  error.value = '';
  emit('update:modelValue', null);
};

const removeFileAtIndex = (index) => {
  files.value.splice(index, 1);
  emit('update:modelValue', files.value);
};

const uploadFiles = async () => {
  if (files.value.length === 0) return;

  uploading.value = true;
  uploadProgress.value = 0;
  error.value = '';

  try {
    const formData = new FormData();
    
    if (props.multiple) {
      files.value.forEach((file) => {
        formData.append('files', file);
      });
    } else {
      formData.append('file', files.value[0]);
    }

    const response = await api.post(props.uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      }
    });

    emit('upload-success', response.data.data);
  } catch (err) {
    error.value = err.response?.data?.message || 'Upload failed';
    emit('upload-error', err);
  } finally {
    uploading.value = false;
  }
};

// Expose upload method for manual upload
defineExpose({
  uploadFiles,
  removeFile
});
</script>
