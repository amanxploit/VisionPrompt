export type MediaItem = {
  url: string;
  type: 'image' | 'video';
};

export interface UniversalPrompt {
  id: string;
  title: string;
  prompt: string;
  media: MediaItem[];
  author: {
    name: string;
    avatar: string;
  };
  stats: {
    likes: number;
    views: number;
  };
  model: string;
  source: string; // e.g., 'meigen', 'midjourney_hub', 'local'
  sourceLink: string;
}