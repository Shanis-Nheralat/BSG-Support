import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { translateFields, generateLocalizedSlug } from '@/lib/deepl';

// POST - Auto-translate fields via DeepL
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { fields, targetLang, sourceLang } = body as {
      fields: Record<string, string | null | undefined>;
      targetLang: string;
      sourceLang?: string;
    };

    if (!fields || typeof fields !== 'object') {
      return NextResponse.json(
        { error: 'fields object is required' },
        { status: 400 }
      );
    }

    if (!targetLang) {
      return NextResponse.json(
        { error: 'targetLang is required' },
        { status: 400 }
      );
    }

    const translated = await translateFields(
      fields,
      targetLang,
      sourceLang || 'EN'
    );

    // Auto-generate slug from translated title if title was translated
    if (translated.title) {
      translated.slug = generateLocalizedSlug(translated.title);
    }

    return NextResponse.json({ translated });
  } catch (error) {
    console.error('Translation error:', error);
    const message =
      error instanceof Error ? error.message : 'Translation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
