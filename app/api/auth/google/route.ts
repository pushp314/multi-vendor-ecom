import { NextRequest, NextResponse } from 'next/server';
import passport from 'passport';
import '../../../../lib/auth'; // side-effect import to initialize passport

export async function GET(req: NextRequest) {
  return new Promise((resolve, reject) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req as any, {} as any, (err: any) => {
      if (err) {
        return reject(err);
      }
      // This part will not be reached as authenticate redirects
      resolve(NextResponse.redirect('/'));
    });
  });
}
