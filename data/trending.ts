export interface PromptData {
  id: string;
  title: string;
  text: string; // The prompt you copied
  media: { url: string }[];
  category?: string;
}

export const TRENDING_PROMPTS: PromptData[] = [
  {
    id: 't1',
    title: 'Cyberpunk Samurai',
    text: 'A futuristic samurai standing in a rain-slicked Tokyo street, neon signs reflecting in puddles, cinematic lighting, 8k, highly detailed',
    media: [{ url: 'https://rajaneditz.com/wp-content/uploads/2026/05/Instagram-Lofi-Dusk-Filter-Ai-Photo-Editing-Prompts-Chatpt-225x300.webp' }],
    category: 'Sci-Fi',
  },
  {
    id: 't2',
    title: 'Golden Hour Forest',
    text: 'Hyper-realistic magical forest at sunset, golden light filtering through ancient trees, floating dust particles, unreal engine 5',
    media: [{ url: 'https://your-video-url.com/forest.mp4' }], // Works with the video logic we built
    category: 'Nature',
  },
  {
    id: 't3',
    title: 'Abstract Glass Art',
    text: 'Transparent iridescent glass sculptures floating in a white void, soft pastel colors, refraction, minimalist, 4k',
    media: [{ url: 'https://your-image-url.com/glass.jpg' }],
    category: 'Abstract',
  },
  // Just copy-paste and add more objects here!
];