
import { api } from './api';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  author_name?: string;
  featured_image?: string;
  published_at: string;
  category?: string;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export const blogService = {
  // Get all published blogs
  getBlogs: async (): Promise<Blog[]> => {
    return api.get<Blog[]>('/api/blogs');
  },

  // Get blog by slug
  getBlogBySlug: async (slug: string): Promise<Blog> => {
    return api.get<Blog>(`/api/blogs/${slug}`);
  },

  // Admin endpoints
  getAllBlogs: async (): Promise<Blog[]> => {
    return api.get<Blog[]>('/api/blogs/');
  },

  createBlog: async (blog: Omit<Blog, 'id' | 'created_at' | 'updated_at'>): Promise<Blog> => {
    return api.post<Blog>('/api/blogs', blog);
  },

  updateBlog: async (id: string, blog: Partial<Blog>): Promise<Blog> => {
    return api.put<Blog>(`/api/blogs/${id}`, blog);
  },

  deleteBlog: async (id: string): Promise<void> => {
    return api.delete(`/api/blogs/${id}`);
  },
};
