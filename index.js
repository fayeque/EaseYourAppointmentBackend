import express from 'express';
import 'express-async-errors';
// import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import mongoose from 'mongoose';
import cors from 'cors';
// import { currentUserRouter } from './routes/current-user';
// import { signinRouter } from './routes/signin';
// import { signoutRouter } from './routes/signout';
import { signupRouter } from './src/routes/signup.js';
import { signinRouter } from './src/routes/signin.js';
import { doctorsRouter } from './src/routes/doctors.js';
import { currentUserRouter } from './src/routes/current-user.js';
import { signoutRouter } from './src/routes/signout.js';
import { patientAppnRouter } from './src/routes/patientAppn.js';
import { appointmentRouter } from './src/routes/appointment.js';
import { errorHandler,currentUser} from '@fhannan/common';

import bodyParser from 'body-parser';
// import { NotFoundError } from './errors/not-found-error';



const app = express();
app.use(
  cookieSession({
    signed:false
  })
);
app.use(bodyParser.json());
app.use(
  cors(
  //   {
  //   origin: "",
  //   methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  //   credentials: true,
  // }
  )
);
// app.use(json());
// support parsing of application/json type post data


// app.use(currentUserRouter);
// app.use(signinRouter);
// app.use(signoutRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(currentUser);
app.use(currentUserRouter);
app.use(signoutRouter);
app.use(doctorsRouter);
app.use(patientAppnRouter);
app.use(appointmentRouter);
// app.all('*', async (req, res) => {
//   throw new NotFoundError();
// });

app.use(errorHandler);

const start = async () => {
  try{  
  // await mongoose.connect('mongodb://amsauth-mongo-srv:27017/auth');
  await mongoose.connect('mongodb://fayeque123:fayeque123@devconnector-shard-00-00.mxfos.mongodb.net:27017,devconnector-shard-00-01.mxfos.mongodb.net:27017,devconnector-shard-00-02.mxfos.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=devConnector-shard-0&authSource=admin&retryWrites=true&w=majority');
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
