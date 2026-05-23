export type MediaItem = {
  url: string;
  type: 'image' | 'video';
};

export interface UniversalPrompt {
  id: string;
  title: string;
  description: string;
  content: string;
  media: any[];
  source: string;
  sourceLink: string;
  
  // Add the '?' to make these optional
  prompt?: string;     // Optional
  author?: string;     // Optional
  model?: string;      // Optional
  stats?: {            // Optional
    likes?: number;
    views?: number;
  };
}