<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
    <!-- Search & Filters -->
    <div v-if="searchable || filterable" class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex gap-3">
        <div v-if="searchable" class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
          />
        </div>
        <slot name="filters"></slot>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              @click="column.sortable && handleSort(column.key)"
              :class="[
                'px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider',
                column.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'
              ]"
            >
              <div class="flex items-center gap-2">
                {{ column.label }}
                <span v-if="column.sortable" class="material-symbols-outlined text-sm">
                  {{ getSortIcon(column.key) }}
                </span>
              </div>
            </th>
            <th v-if="$slots.actions" class="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-if="loading">
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="px-4 py-12 text-center">
              <Loading />
            </td>
          </tr>
          <tr v-else-if="paginatedData.length === 0">
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="px-4 py-12 text-center">
              <div class="flex flex-col items-center gap-3">
                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span class="material-symbols-outlined text-3xl text-gray-400">inbox</span>
                </div>
                <p class="text-gray-500 dark:text-gray-400">No data found</p>
              </div>
            </td>
          </tr>
          <tr
            v-else
            v-for="(row, index) in paginatedData"
            :key="getRowKey(row, index)"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3 text-sm text-gray-900 dark:text-white"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="getValue(row, column.key)">
                {{ getValue(row, column.key) }}
              </slot>
            </td>
            <td v-if="$slots.actions" class="px-4 py-3 text-right">
              <slot name="actions" :row="row"></slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="paginated && totalPages > 1" class="px-4 py-3 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ startItem }} to {{ endItem }} of {{ filteredData.length }} results
      </p>
      <div class="flex gap-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Previous
        </button>
        <button
          v-for="page in displayedPages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-3 py-1 border rounded text-sm',
            page === currentPage
              ? 'bg-primary text-white border-primary'
              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Loading from './Loading.vue';

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
    // Example: [{ key: 'name', label: 'Name', sortable: true }]
  },
  loading: Boolean,
  searchable: Boolean,
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  },
  filterable: Boolean,
  paginated: {
    type: Boolean,
    default: true
  },
  perPage: {
    type: Number,
    default: 10
  },
  rowKey: {
    type: String,
    default: 'id'
  }
});

const searchQuery = ref('');
const currentPage = ref(1);
const sortKey = ref('');
const sortOrder = ref('asc'); // 'asc' or 'desc'

// Filtered data based on search
const filteredData = computed(() => {
  if (!searchQuery.value) return props.data;

  const query = searchQuery.value.toLowerCase();
  return props.data.filter(row => {
    return props.columns.some(column => {
      const value = getValue(row, column.key);
      return String(value).toLowerCase().includes(query);
    });
  });
});

// Sorted data
const sortedData = computed(() => {
  if (!sortKey.value) return filteredData.value;

  return [...filteredData.value].sort((a, b) => {
    const aVal = getValue(a, sortKey.value);
    const bVal = getValue(b, sortKey.value);

    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
});

// Paginated data
const paginatedData = computed(() => {
  if (!props.paginated) return sortedData.value;

  const start = (currentPage.value - 1) * props.perPage;
  const end = start + props.perPage;
  return sortedData.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / props.perPage);
});

const startItem = computed(() => {
  return (currentPage.value - 1) * props.perPage + 1;
});

const endItem = computed(() => {
  return Math.min(currentPage.value * props.perPage, filteredData.value.length);
});

const displayedPages = computed(() => {
  const pages = [];
  const maxPages = 5;
  let start = Math.max(1, currentPage.value - 2);
  let end = Math.min(totalPages.value, start + maxPages - 1);

  if (end - start < maxPages - 1) {
    start = Math.max(1, end - maxPages + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const handleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const getSortIcon = (key) => {
  if (sortKey.value !== key) return 'unfold_more';
  return sortOrder.value === 'asc' ? 'arrow_upward' : 'arrow_downward';
};

const getValue = (row, key) => {
  return key.split('.').reduce((obj, k) => obj?.[k], row) ?? '';
};

const getRowKey = (row, index) => {
  return row[props.rowKey] || index;
};
</script>
