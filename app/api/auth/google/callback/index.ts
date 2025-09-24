import passport from '@/lib/passport';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  passport.authenticate('google', (err, user) => {
    if (err || !user) {
      return res.redirect('/');
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.redirect('/');
      }
      return res.redirect('/profile');
    });
  })(req, res);
};
