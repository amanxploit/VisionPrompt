import fs from 'fs';
import path from 'path';

let cachedData: any[] = null;

export async function getPromptsData() {
  // Return cache if it exists to prevent browser/server hang
  if (cachedData) return cachedData;

  try {
    // Use process.cwd() to ensure path works in both dev and production
    const filePath = path.join(process.cwd(), 'data', 'prompts.json');
    
    if (!fs.existsSync(filePath)) {
      console.error('File not found at:', filePath);
      return [];
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    cachedData = Array.isArray(data) ? data : data.prompts || [];
    return cachedData;
  } catch (error) {
    console.error('Error loading JSON data:', error);
    return [];
  }
}


// lib/meigen.ts

export async function fetchMeigenData(params: { 
  offset?: number; 
  limit?: number; 
  sort?: string; 
  model?: string; 
  type?: 'images' | 'videos' 
}) {
  const { offset = 0, limit = 100, sort = 'featured', model = '', type = 'images' } = params;
  const endpoint = type === 'videos' ? 'videos' : 'images';
  
  // IMPORTANT: If the browser works but the server doesn't, 
  // try removing the model param first to see if it's the cause.
  
  const url = new URL(`https://www.meigen.ai/api/${endpoint}`);
  url.searchParams.set('offset', offset.toString());
  url.searchParams.set('limit', limit.toString());
  url.searchParams.set('sort', sort);
  if (model) url.searchParams.set('model', model);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.meigen.ai/', // <--- ADD THIS: Tells Meigen you are coming from their site
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!res.ok) return [];
    const json = await res.json();


    const data = json.images || json.data || (Array.isArray(json) ? json : []);
    return data;
  } catch (error) {
    return [];
  }
}



