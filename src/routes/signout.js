import express from 'express';

const router = express.Router();

router.get('/api/users/signout', (req, res) => {
  console.log("making logout null");
  res.send({});
});

export { router as signoutRouter };