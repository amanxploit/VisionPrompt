// lib/meigen.ts

export async function fetchMeigenData(params: { 
  offset?: number; 
  limit?: number; 
  sort?: string; 
  model?: string; 
  type?: 'images' | 'videos' 
}) {
  const { 
    offset = 0, 
    limit = 100, 
    sort = 'featured', 
    model = '', 
    type = 'images' 
  } = params;

  const endpoint = type === 'videos' ? 'videos' : 'images';
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
        'Referer': 'https://www.meigen.ai/', // Critical to prevent empty responses
      },
    });

    if (!res.ok) return [];
    const json = await res.json();
    
    // Meigen returns data in .images or .data or as the root array
    return json.images || json.data || (Array.isArray(json) ? json : []);
  } catch (error) {
    console.error('Meigen Fetch Error:', error);
    return [];
  }
}