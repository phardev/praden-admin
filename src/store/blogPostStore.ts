import {
  BlogPost,
  BlogPostListItem,
  BlogPostStatus
} from '@core/entities/blogPost'
import { UUID } from '@core/types/types'
import { defineStore } from 'pinia'

export const useBlogPostStore = defineStore('BlogPostStore', {
  state: () => {
    return {
      items: [] as Array<BlogPostListItem>,
      current: undefined as BlogPost | undefined,
      isLoading: false,
      isSaving: false,
      isDeleting: false
    }
  },
  getters: {
    blogPost: (state) => state.current
  },
  actions: {
    list(items: Array<BlogPostListItem>) {
      this.items = items
    },
    setCurrent(blogPost: BlogPost) {
      this.current = JSON.parse(JSON.stringify(blogPost))
    },
    applyStatus(uuid: UUID, status: BlogPostStatus) {
      const index = this.items.findIndex((item) => item.uuid === uuid)
      if (index === -1) return
      this.items.splice(index, 1, { ...this.items[index], status })
    },
    highlightInOrder(blogPostUuids: Array<UUID>) {
      this.items = this.items.map((item) => {
        const order = blogPostUuids.indexOf(item.uuid)
        return {
          ...item,
          highlightOrder: order === -1 ? undefined : order
        }
      })
    },
    remove(uuid: UUID) {
      this.items = this.items.filter((item) => item.uuid !== uuid)
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    },
    startSaving() {
      this.isSaving = true
    },
    stopSaving() {
      this.isSaving = false
    },
    startDeleting() {
      this.isDeleting = true
    },
    stopDeleting() {
      this.isDeleting = false
    }
  }
})
