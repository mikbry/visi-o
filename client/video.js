import React, {createRef} from 'https://unpkg.com/es-react';
import htm from 'https://unpkg.com/htm?module';
import { useCamera } from './usecamera.js';

const html = htm.bind(React.createElement);
const Video = () => {
    const videoRef = createRef();
    const [video, isCameraInitialised, running, setPlaying, error] = useCamera(videoRef);

    return html`
        <div class="self-video" >
            <video
                ref=${videoRef}
                autoPlay=${true}
                muted=${true}
                controls
                width=${480}
                height=${270}
            />
            <button
                onClick=${() => setPlaying(!running)}
                ariaLabel='Start/Stop Audio'
            >${running ? 'Stop' : 'Start'}</button>
        </div>
    `;
};

export default Video;