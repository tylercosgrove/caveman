const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();



const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.resolve(__dirname, './client/build')));


app.get('/', (req, res) => { 
    res.send("Hello World!"); 
});

/*app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../openai-client/build', 'index.html'));
  });*/

app.post('/query', async (req, res) => {
    let response = await testFunc(req.body);
    res.send(response.choices[0].message.content);
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });

app.listen(process.env.PORT || 8080, () => { 
    console.log('listening on port ' + (process.env.PORT || 8080)); 
}); 

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
