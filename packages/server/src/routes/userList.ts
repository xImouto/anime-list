import express from 'express';
import { userListController } from '../controllers';
import { authenticate } from '../middlewares';

const userListRouter = express.Router();

userListRouter
	.put('/', authenticate.verifyUser, userListController.addOrUpdate)
	.put('/:animeId', authenticate.verifyUser, userListController.addOrUpdate)
	.delete('/', authenticate.verifyUser, userListController.delete)
	.delete('/:animeId', authenticate.verifyUser, userListController.delete);

export default userListRouter;
