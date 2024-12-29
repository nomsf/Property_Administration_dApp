import { NextResponse } from 'next/server';

// Mock data
const properties = [
  {
    id: '1',
    location: '333 Second St, Sheffield, AD, 433212',
    type: 'Flat',
    description: 'Yosemite National Park is a national park spanning 747,956 acres (1,169.4 sq mi; 3,025.2 km2) in the western Sierra Nevada of Central California.',
    area: 100,
    valuation: [100000, 200000, 300000]
  },
  {
    id: '2',
    location: '123 Second St, Sheffield, AD, 433212',
    type: 'House',
    description: 'Yosemite National Park is a national park spanning 747,956 acres (1,169.4 sq mi; 3,025.2 km2) in the western Sierra Nevada of Central California.',
    area: 200,
    valuation: [200000, 300000, 400000]
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