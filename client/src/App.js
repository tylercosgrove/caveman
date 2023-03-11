import './App.css';
import { useEffect, useState, useRef } from "react";
import caveman1 from "./caveman1.svg";
import caveman2 from "./caveman2.svg";
import useAutosizeTextArea from "./useAutosizeTextArea";



function App() {

  const [prompt, setPrompt] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(caveman1);
  const [currChat, setCurrChate] = useState([]);
  const textAreaRef = useRef(null);

  const scrollableDivRef = useRef(null);

  useAutosizeTextArea(textAreaRef.current, prompt);

  useEffect(() => {
    if(text.length > 0 && text != "Loading...") {
      setCurrChate([...currChat, {"role":"assistant", "content":text}]);

      // animate by switching between images
      for(let i = 0; i < 11; i++) {
        setTimeout(() => {
          setImage(i % 2 ? caveman2 : caveman1);
        }, i * 300);

      }
    }
  }, [text]);

  useEffect(() => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
    }
  }, [currChat.length]);

  const handleChange = (event) => {
    const val = event.target?.value;
    setPrompt(val);
  };


  const askChat = async () => {
    setText("Loading...");
    setImage(caveman1);

    let tempChat = [...currChat, {"role":"user", "content":prompt}];
    setCurrChate(tempChat);

    const response = await fetch("/query", {
      headers: {
        'Content-Type': 'application/json',
      },
      method: "POST",
      body: JSON.stringify(tempChat)
    });

    if(response.ok) {
      let output = await response.text();
      setText(output.replace(/^\n+/, ""));
    } else {
      setText("Me think something wrong.");
    }
  }

  const clearHistory = () => {
    setCurrChate([]);
    setText("");
  }

  const getHistory = () => {
    return <>
      {currChat.slice(0).map(x => 
        <div id="message-container">
          <div className={x.role == "user" ? "user" : "grug"}>
            {x.content}
          </div>
        </div>
      )}
    </>;
  }

/**
 * <p class="white">Grug says:</p>
            <p id="output">{text}</p>
 */

  return (<>
    <div id="header">
      <h1 class="white">Talk to AI Caveman</h1>
      <div id="clear-container">
        <button onClick={clearHistory}>Clear message history</button>
      </div>
    </div>
    <div className="main">
      


      <div id="response-container">
          <img id="grug-image" src={image} />
          
          <div ref={scrollableDivRef} id="output-container">
            {getHistory()}
          </div>
      </div>


      <div id="input-container">
        <textarea id="new-note" onChange={handleChange} placeholder="Prompt:" rows={1} value={prompt} ref={textAreaRef}/>
        <button id="go" onClick={askChat}>Go</button>
      </div>

    </div>
    </>
  );
}

export default App;

