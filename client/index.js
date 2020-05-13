import { React, ReactDOM } from 'https://unpkg.com/es-react';
import htm from 'https://unpkg.com/htm?module';
import config from './config.js';
import webRtc from './webRtc.js';

const html = htm.bind(React.createElement);

const Lobby = () => {
  const handleJoinRoom = () => {
    console.log('todo join room');
  }
  return html`
  <div>
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
