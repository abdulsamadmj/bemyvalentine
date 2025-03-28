import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../../utils/supabaseServer';

// PUT /api/form/update - Update a form record
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Missing form ID' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('forms')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 