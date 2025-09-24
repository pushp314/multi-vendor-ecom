import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  const session = await getIronSession(req as any, {} as any, sessionOptions);
  session.destroy();
  return NextResponse.redirect('/');
}
