import express from 'express';
import currentUser  from '../middlewares/currentUser.js';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  console.log(req.currentUser);
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
