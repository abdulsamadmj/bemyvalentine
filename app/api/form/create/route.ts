import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../../utils/supabaseServer';

// POST /api/form/create - Create a new form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, catPerson } = body;
    
    if (!email || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('forms')
      .insert([{ email, name, catPerson }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Failed to create form' }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 