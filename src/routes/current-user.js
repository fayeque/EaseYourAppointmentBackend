import express from 'express';
import { currentUser } from '@fhannan/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {

  console.log("current user here session " , req.session);
  console.log("current user here cookies " , req.cookies);
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
