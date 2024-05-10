const express = require('express')
var bodyParser = require('body-parser')
const cors = require('cors')
var jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 4000;

const { MongoClient} = require('mongodb');

const dbName = 'certificatedata';
const uri = `mongodb://localhost:27017/${dbName}`;
const client = new MongoClient(uri);

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
	console.log('Global middleware');
	next();
})

function middleware(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), 'MMEAC@22');
      req.user = decoded; // Attach user information to request
      next();
  } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
  }
}


app.post('/login', async (req, res) => {
  let inputData = req.body;
  try {
      // Query MongoDB to check if credentials are valid
      const user = await getUserFromDB(inputData.username, inputData.password);
      if (!user) {
          return res.status(401).send('Username or password doesn\'t match');
      }

      // Generate JWT token
      const token = jwt.sign({ username: user.username, id: user._id }, 'MMEAC@22');

      res.json({ token: token });
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to query MongoDB for user
async function getUserFromDB(username, password) {
  const db = client.db(dbName);
  const users = db.collection('data');
  return await users.findOne({ username, password });
}



app.get('/api/data',middleware, async (req, res) => {
  try {
    const { username } = req.user;

    const db = client.db(dbName);
    const certificates = db.collection('data'); 
    console.log(username)

    const userCertificates = await certificates.find({ username }).toArray();
    console.log(userCertificates)
    res.json(userCertificates);
  } catch (err) {
    console.error('Error querying the database:', err); // Handle database query errors
    res.status(500).json({ message: 'Database Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})