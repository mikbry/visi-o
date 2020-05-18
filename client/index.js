// No official React ESM support https://github.com/facebook/react/issues/11503
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
  <div class="rooms-box">
    <ul>
      ${data.rooms.map(room =>html`
        <li id=${room.id}>${room.name}</li>
      `)}
    </ul>
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
    <div class="header-container">
      <div>
        <div>
          <h1>Din-O</h1>
          <p>Experimental Video-conversation app</p>
        </div>
        <${Lobby} />
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#bca9a9" fill-opacity="1" d="M0,256L130.9,160L261.8,64L392.7,128L523.6,96L654.5,320L785.5,256L916.4,160L1047.3,288L1178.2,0L1309.1,128L1440,0L1440,320L1309.1,320L1178.2,320L1047.3,320L916.4,320L785.5,320L654.5,320L523.6,320L392.7,320L261.8,320L130.9,320L0,320Z"></path></svg>
      </div>
  </div>
`,
  document.body
);
