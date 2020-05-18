import { React, ReactDOM, useState, useRef, useEffect } from 'https://unpkg.com/es-react';
// https://github.com/developit/htm
import htm from 'https://unpkg.com/htm?module';
import config from './config.js';
import webRtc from './webRtc.js';

const html = htm.bind(React.createElement);

const Lobby = () => {
  const [data, setData] = useState({ rooms: [] });
  const isMounted = useRef(true);
  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      const response = await fetch(config.apiServer + '/room');
      const data = await response.json();
      if (!ignore) setData(data);
    }

    fetchData();
    return () => { ignore = true; }
  }, []);

  const handleJoinRoom = () => {
    console.log('todo join room');
  }
  return html`
  <div>
    <li>
      ${data.rooms.map(room =>html`
        <ul id=${room.id}>${room.name}</ul>
      `)}
    </li>
    <button onClick=${e => handleJoinRoom()}>Join Room</button>
  </div>
  `;
};

const VideoRoom = () => {
  return html`
  <div id="chat-room" style="display: none;">
    <div id="videos">
      <video id="self-view" autoplay ></video>
      <video id="remote-view" autoplay></video>
    </div>
  </div>
  `;
}

ReactDOM.render(
  html`
  <div>
    <h1>Dino-O</h1>
    <p>Experimental Video-conversation app using Deno</p>
    <${Lobby} />
  </div>
`,
  document.body
);
