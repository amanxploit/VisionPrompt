import { NextRequest, NextResponse } from 'next/server';
import { fetchMeigenData } from '@/lib/meigen';

function normalizeMeigen(item: any) {
  const isVideo = item.mediaType === 'video';
  return {
    id: `meigen-${item.id}`,
    title: item.title || 'Untitled',
    description: item.description || '',
    content: item.prompt || item.content || '',
    media: isVideo 
      ? [{ url: item.videoUrl, type: 'video' }, { url: item.image, type: 'image' }] 
      : (item.images || [item.image]).map((url: string) => ({ url, type: 'image' })),
    author: { 
      name: item.author?.name || 'Unknown', 
      avatar: item.author?.avatar || '' 
    },
    stats: { 
      likes: item.stats?.likes || 0, 
      views: item.stats?.views || 0 
    },
    model: item.model || 'Unknown',
    source: 'meigen',
    sourceLink: `https://www.meigen.ai/prompt/${item.id}`,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const model = searchParams.get('model') || ''; 
    const sort = searchParams.get('sort') || 'featured';

    // 1. Fetch both Images and Videos in parallel
    // We pass the model param directly to Meigen API for efficiency
    const [imageResults, videoResults] = await Promise.all([
      fetchMeigenData({ limit: 100, sort, model, type: 'images' }),
      fetchMeigenData({ limit: 100, sort, model, type: 'videos' })
    ]);

    // 2. Merge and Normalize
    const allMeigenData = [...imageResults, ...videoResults].map(normalizeMeigen);

    // 3. Server-side Safety Filter
    // Sometimes API returns other models even if we ask for one. 
    // This ensures the user ONLY sees the model they clicked.
    let filteredData = allMeigenData;
    if (model !== '') {
      filteredData = allMeigenData.filter(item => 
        item.model.toLowerCase().includes(model.toLowerCase())
      );
    }

    // 4. Sorting (if not already sorted by API)
    if (sort === 'likes') {
      filteredData.sort((a, b) => b.stats.likes - a.stats.likes);
    }

    // 5. Pagination
    const total = filteredData.length;
    const start = (page - 1) * limit;
    const end = start + limit;

    return NextResponse.json({
      success: true,
      data: filteredData.slice(start, end),
      pagination: { 
        total, 
        hasNext: end < total, 
        page 
      }
    });

  } catch (error) {
    console.error('Route Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}