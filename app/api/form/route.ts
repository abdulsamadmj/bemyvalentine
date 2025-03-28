import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../utils/supabaseServer';

// GET /api/form?id=XXX - Get a specific form by ID
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing form ID' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('forms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 