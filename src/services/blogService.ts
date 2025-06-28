
import { api } from './api';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  metaDescription: string;
  content?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export const blogService = {
  // Get all published blogs (public)
  getPublishedBlogs: async (): Promise<Blog[]> => {
    return api.get<Blog[]>('/api/blogs/published');
  },

  // Get blog by slug (public)
  getBlogBySlug: async (slug: string): Promise<Blog> => {
    return api.get<Blog>(`/api/blogs/${slug}`);
  },

  // Admin endpoints - Get all blogs regardless of status
  getAllBlogs: async (): Promise<Blog[]> => {
    return api.get<Blog[]>('/api/blogs');
  },

  // Admin - Create blog
  createBlog: async (blog: Omit<Blog, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<Blog> => {
    return api.post<Blog>('/api/blogs', blog);
  },

  // Admin - Update blog
  updateBlog: async (id: string, blog: Omit<Blog, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<Blog> => {
    return api.put<Blog>(`/api/blogs/${id}`, blog);
  },

  // Admin - Delete blog
  deleteBlog: async (id: string): Promise<void> => {
    return api.delete(`/api/blogs/${id}`);
  },
};
