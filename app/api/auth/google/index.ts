import passport from '@/lib/passport';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
};
