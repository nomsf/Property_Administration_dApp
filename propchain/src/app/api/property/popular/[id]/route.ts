import { Property } from '@/components/global.types';
import { NextResponse } from 'next/server';

// Mock data
const properties: Property[] = [
  {
    id: '1',
    name: 'Property One',
    location: '333 Second St, Sheffield, AD, 433212',
    zoning: 'Residential',
    price: 100000,
    tenant: 'John Doe',
    forsale: true
  },
  {
    id: '2',
    name: 'Property Two',
    location: '123 Second St, Sheffield, AD, 433212',
    zoning: 'Commercial',
    price: 200000,
    tenant: 'Jane Smith',
    forsale: false
  }
];

// API handler
export async function GET(
    request: Request,
    context: { params: { id: string } }
  ) {
    const params = await context.params; // Await params if required
    const property = properties.find((p) => p.id === params.id);
  
    return property
      ? NextResponse.json(property)
      : NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }