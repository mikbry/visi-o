(function () {
  "use strict";

  const MESSAGE_TYPE = {
    SDP: 'SDP',
    CANDIDATE: 'CANDIDATE',
  }

  document.addEventListener('click', async (event) => {
    if (event.target.id === 'start') {
      startChat();
    }
  });

  const startChat = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true }, video: {width: {exact: 1280}, height: {exact: 720}} });
      showChatRoom();

      const signaling = new WebSocket(`wss://192.168.1.21:4000/ws`);
      signaling.onopen = () => {
        const peerConnection = createPeerConnection(signaling);

        addMessageHandler(signaling, peerConnection);
  
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
        document.getElementById('self-view').srcObject = stream;
      };
      signaling.onerror = err => {
        console.error(err);
        signaling.close();
      };

    } catch (err) {
      console.error(err);
    }
  };

  const createPeerConnection = (signaling) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.test.com:19000' }],
    });
    
    peerConnection.onnegotiationneeded = async () => {
     await createAndSendOffer(signaling, peerConnection);
    };

    peerConnection.onicecandidate = (iceEvent) => {
      if (iceEvent && iceEvent.candidate) {
        signaling.send(JSON.stringify({
          message_type: MESSAGE_TYPE.CANDIDATE,
          content: iceEvent.candidate,
        }));
      }
    };

    peerConnection.ontrack = (event) => {
      const video = document.getElementById('remote-view');
      if (!video.srcObject) {
        video.srcObject = event.streams[0];
      }
    };

    return peerConnection;
  };

  const addMessageHandler = (signaling, peerConnection) => {
    signaling.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      console.log('got message', message, data);
      if (!data) {
        return;
      }
      /* if (RTCRtpSender.getCapabilities) {
        const capabilityCodecs = RTCRtpSender.getCapabilities('video').codecs;
        console.log('capabilities=', capabilityCodecs);  
      } */
      const { message_type, content } = data;
      try {
        if (message_type === MESSAGE_TYPE.CANDIDATE && content) {
          await peerConnection.addIceCandidate(content);
        } else if (message_type === MESSAGE_TYPE.SDP) {
          if (content.type === 'offer') {
            await peerConnection.setRemoteDescription(content);
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            signaling.send(JSON.stringify({
              message_type: MESSAGE_TYPE.SDP,
              content: answer,
            }));
          } else if (content.type === 'answer') {
            await peerConnection.setRemoteDescription(content);
          } else {
            console.log('Unsupported SDP type.');
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
  };

  const createAndSendOffer = async (signaling, peerConnection) => {
    const offer = await peerConnection.createOffer();
    // console.log('sdp=', offer.sdp);
    await peerConnection.setLocalDescription(offer);

    signaling.send(JSON.stringify({ message_type: MESSAGE_TYPE.SDP, content: offer }));
  };

  const showChatRoom = () => {
    document.getElementById('start').style.display = 'none';
    document.getElementById('chat-room').style.display = 'block';
  };
})();
