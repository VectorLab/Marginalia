export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  rawContent?: string | null;
  published: boolean | null;
  publishedAt?: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type Note = {
  id: number;
  postId: number | null;
  context: string | null;
  content: string;
  createdAt?: Date | null;
};

export type SiteSettings = {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  adminEmail: string;
};

export type ConfigStatus = {
  BETTER_AUTH_SECRET: boolean;
  SUUD_OAUTH_CLIENT_ID: boolean;
  SUUD_OAUTH_CLIENT_SECRET: boolean;
  VITE_SUUD_BASE_URL: boolean;
  adminConfigured: boolean;
};
