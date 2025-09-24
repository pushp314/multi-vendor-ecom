import { NextRequest, NextResponse } from 'next/server';
import passport from 'passport';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../../../lib/auth';
import '../../../../lib/auth'; // side-effect import to initialize passport

export async function GET(req: NextRequest) {
  return new Promise((resolve, reject) => {
    passport.authenticate('google', async (err: any, user: any) => {
      if (err) {
        console.error('Authentication error:', err);
        return resolve(NextResponse.redirect('/login?error=AuthenticationFailed'));
      }
      if (!user) {
        return resolve(NextResponse.redirect('/login?error=AuthenticationFailed'));
      }

      const session = await getIronSession(req as any, {} as any, sessionOptions);
      session.user = user;
      await session.save();

      resolve(NextResponse.redirect('/'));
    })(req as any, {} as any, (err: any) => {
      if (err) {
        reject(err);
      }
    });
  });
}
