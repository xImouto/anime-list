import { Response, NextFunction, Request } from 'express';
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import local from 'passport-local';
import jwt, { Algorithm } from 'jsonwebtoken';
import { Users } from '../models';
import { handleError } from '../utils';

passport.use(new local.Strategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.jwtSecret,
	algorithms: process.env.jwtAlgorithm ? [process.env.jwtAlgorithm] : undefined,
};

export default {
	getToken: (user: any) =>
		jwt.sign(user, process.env.jwtSecret || 'a>]A1<', {
			expiresIn: process.env.jwtExpiresIn,
			algorithm: process.env.jwtAlgorithm as unknown as Algorithm,
		}),

	jwtPassport: passport.use(
		new Strategy(opts, (jwt_payload, done) => {
			// eslint-disable-next-line no-underscore-dangle
			Users.findOne({ _id: jwt_payload._id }, (err: Error, user: any) => {
				if (err) {
					return done(err, false);
				} else if (user) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			});
		})
	),

	verifyUser: (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate('jwt', { session: false }, (err, user) => {
			if (err) handleError(res, 401, 'Unauthorized', err);
			else if (!user) handleError(res, 401, 'Unauthorized', err);
			else {
				req.logIn(user, (error) => {
					if (error) handleError(res, 401, 'Unauthorized', error);
					else next();
				});
			}
		})(req, res, next);
	},

	verifyAccess:
		(access: number, self?: boolean) => (req: Request, res: Response, next: NextFunction) => {
			if (req.user) {
				if (req.user.access === 5) next();
				else if (self && req.params.username === req.user.username) next();
				else if (!self && access <= req.user.access) next();
				else {
					console.log('verifyAccess');

					handleError(res, 403, 'You are not authorized to perform this operation!');
				}
			} else {
				handleError(res, 401, 'You are not authenticated!');
			}
		},
};
