// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req : NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  const res = NextResponse.next();
  res.headers.set('x-real-ip', ip); // 
  return res;
}
