import { NextRequest, NextResponse } from 'next/server';
import { getPromptsData } from '@/lib/prompts';
import { UniversalPrompt } from '@/lib/types';

// --- Normalizers ---
function normalizeMeigen(item: any): UniversalPrompt {
  if (!item) throw new Error("Invalid data received from Meigen");
  return {
    id: `meigen-${item.id}`,
    title: item.title || 'Meigen Prompt',
    description: item.description || '',
    content: item.prompt || item.content || 'No prompt provided',
    media: item.images ? [item.images[0]] : (item.image ? [item.image] : []),
    source: 'meigen',
    sourceLink: `https://www.meigen.ai/prompt/${item.id}`,
  };
}

function normalizeLocal(item: any): UniversalPrompt {
  return {
    id: item.id,
    title: item.title || 'Untitled',
    description: item.description || '',
    content: item.content || '',
    media: item.media || [],
    source: 'local',
    sourceLink: item.sourceLink,
  };
}

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    // --- CASE A: External Meigen Prompt ---
    if (id.startsWith('meigen-')) {
      const actualId = id.replace('meigen-', '');
      
      // Implement a timeout so your server doesn't hang if Meigen is slow
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second limit

      try {
        const res = await fetch(`https://www.meigen.ai/api/prompt/${actualId}`, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          return NextResponse.json(
            { success: false, error: `Source API returned ${res.status}` }, 
            { status: res.status === 404 ? 404 : 502 }
          );
        }

        const data = await res.json();
        return NextResponse.json({ 
          success: true, 
          data: normalizeMeigen(data) 
        });

      } catch (error: any) {
        if (error.name === 'AbortError') {
          return NextResponse.json({ success: false, error: 'Source API timed out' }, { status: 504 });
        }
        throw error; // Pass to outer catch
      }
    }

    // --- CASE B: Local JSON Prompt ---
    const allPrompts = await getPromptsData();
    // Ensure we handle ID comparison correctly (string vs number)
    const prompt = allPrompts.find((item: any) => String(item.id) === String(id));
    
    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: normalizeLocal(prompt) 
    });

  } catch (error: any) {
    console.error('Detail API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}