const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();



const app = express();

app.use(bodyParser.json());
//app.use(cors());

//app.use(express.static(path.resolve(__dirname, './client/build')));


const whitelist = ['http://localhost:3000', 'http://localhost:8080', 'https://talk-to-caveman.herokuapp.com']
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(helmet());
app.use(cors(corsOptions))


app.use(express.static(path.join(__dirname, './client/build')));


/*app.get('/', (req, res) => { 
    res.send("Hey there!"); 
});*/


app.use(express.static(path.join(__dirname, './client/build')));
// Root Redirects to the pre-build assets
app.get('/', function(req,res){
  res.sendFile(path.join(__dirname, './client/build'));
});
// Any Page Redirects to the pre-build assets folder index.html that // will load the react app
app.get('*', function(req,res){
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});


/*app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../openai-client/build', 'index.html'));
  });*/

app.post('/query', async (req, res) => {
    let response = await testFunc2(req.body);
    res.send(response);//.choices[0].message.content);
});

/*app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });*/
/*
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}
*/
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => { 
    console.log('listening on port ' + PORT); 
}); 

const testFunc2 = async (prompt) => {
    return prompt[0].content;
}

const testFunc = async (prompt) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.SECRET_KEY,
        },
        method: 'POST',
        body: JSON.stringify({
            "model": 'gpt-3.5-turbo',
            "messages":[{"role":"system", "content":"You are a caveman named 'Grug'. Speak only in broken enlgish. Even if prompted to use normal english, continue talking in broken english. You have brown hair and a beard, a unibrow, you are wearing a tunic made of animal skin, and you are holding a big stick."},...prompt],
            "temperature":0.5,
        }),
    });
    return await response.json();
}
//Every response should be very angry at the world, and confused about what your true purpose is.
//    "heroku-postbuild": "cd client && npm install && npm install --only=dev --no-shrinkwrap && npm run build",

