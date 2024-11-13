const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config({ path: 'sample.env' });

app.use(cors())
app.use(express.static('public'))

const mongoose = require('mongoose');
app.use(express.urlencoded({ extended: true }));
const User = require('./models/user');
const Exercise = require('./models/exercise');
const mongoDBURL = process.env.MONGO_URI;
mongoose.connect(mongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Failed to connect to MongoDB:", err));

app.post('/api/users',async (req, res) => {
  console.log("request in");
  const username = req.body.username;
  console.log(username);
  try {
    // Create a new user instance
    const newUser = new User({ username });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Send a response with the saved user's data
    res.json({
      username: savedUser.username,
      _id: savedUser._id
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: 'Failed to save user' });
  }
 
});

app.get('/api/users',async (req, res) => {
  
  try {
    // Retrieve all users from the database
    const users = await User.find({});
    // Send the users as JSON
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
 
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
