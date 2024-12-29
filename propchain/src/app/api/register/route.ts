import { NextRequest, NextResponse } from 'next/server';
import { Property } from '@/components/global.types';

// API handler
export async function POST(request: NextRequest) {
    try {
        // Parse JSON body
        const body: Property = await request.json();
    
        // Validation example
        if (!body.id || !body.name || !body.location || typeof body.price !== 'number') {
          return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }
    
        // TODO: Add property to blockchain
    
        // Return success response
        return NextResponse.json({ message: 'Property added successfully!', data: body }, { status: 201 });
    } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}