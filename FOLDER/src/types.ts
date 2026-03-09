export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  status: 'Published' | 'Draft';
  views: number;
  imageUrl: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  date: string;
}
