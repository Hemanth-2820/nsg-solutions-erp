import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff, Users, ShieldAlert } from 'lucide-react';

export default function HuddleModal({ peer, onClose }) {
  const [connecting, setConnecting] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  
  const localVideoRef = useRef(null);

  // Setup webcam stream for local participant
  useEffect(() => {
    let activeStream = null;

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        activeStream = stream;
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Webcam permission denied or unavailable:', err);
      }
    };

    // Simulate connection delay
    const timer = setTimeout(() => {
      setConnecting(false);
      startWebcam();
    }, 2000);

    return () => {
      clearTimeout(timer);
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Update track active states when UI toggles are clicked
  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOff;
      });
    }
  }, [isVideoOff, localStream]);

  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, localStream]);

  const handleToggleMute = () => setIsMuted(!isMuted);
  const handleToggleVideo = () => setIsVideoOff(!isVideoOff);
  const handleToggleScreenShare = () => setIsScreenSharing(!isScreenSharing);

  if (connecting) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(11, 15, 25, 0.95)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          gap: '24px'
        }}
      >
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          {/* Pulsing ring animation */}
          <div className="huddle-loading-ring" />
          <div className="huddle-loading-ring-inner" />
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Users size={20} color="white" />
          </div>
        </div>

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px' }}>
            Starting Huddle...
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
            Establishing secure peer connection with {peer.name || 'Team'}
          </p>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes pulseRing {
            0% { transform: translate(-50%, -50%) scale(0.6); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
          }
          .huddle-loading-ring {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 80px;
            height: 80px;
            border: 2px solid rgba(16, 185, 129, 0.4);
            border-radius: 50%;
            animation: pulseRing 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          }
          .huddle-loading-ring-inner {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 80px;
            height: 80px;
            border: 2px solid rgba(16, 185, 129, 0.2);
            border-radius: 50%;
            animation: pulseRing 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
            animation-delay: 0.6s;
          }
        ` }} />
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0b0f19',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        color: '#f9fafb',
        fontFamily: 'var(--font-sans)',
        overflow: 'hidden'
      }}
    >
      {/* Top Header Bar */}
      <div 
        style={{
          height: '60px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(17, 24, 39, 0.6)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 10px #10b981'
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Huddle Live
          </span>
          <span style={{ fontSize: '13px', color: '#64748b' }}>|</span>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>
            Room: {peer.roomName || 'Sarah\'s Workspace Huddle'}
          </span>
        </div>

        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            color: '#cbd5e1'
          }}
        >
          <Users size={13} />
          <span>2 Participants</span>
        </div>
      </div>

      {/* Video Screens Grid */}
      <div 
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '20px',
          padding: '24px',
          alignContent: 'center',
          justifyContent: 'center',
          backgroundColor: '#070a13'
        }}
        className="huddle-grid-layout"
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .huddle-grid-layout {
            grid-template-columns: 1fr;
          }
          @media (min-width: 768px) {
            .huddle-grid-layout {
              grid-template-columns: 1fr 1fr;
              max-width: 1200px;
              margin: 0 auto;
              width: 100%;
            }
          }
        ` }} />

        {/* Video Card 1: Remote participant (Peer) */}
        <div 
          style={{
            position: 'relative',
            backgroundColor: '#111827',
            borderRadius: '16px',
            overflow: 'hidden',
            aspectRatio: '16/10',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Animated pulsing gradient background to represent peer audio */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, rgba(11,15,25,1) 80%)'
            }}
          />

          {/* Avatar representation */}
          <div style={{ textAlign: 'center', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div 
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                backgroundImage: `url(${peer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'})`,
                backgroundSize: 'cover',
                border: '3px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                position: 'relative'
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  width: '90px',
                  height: '90px',
                  top: '-3px',
                  left: '-3px',
                  border: '3px solid #10b981',
                  borderRadius: '50%',
                  animation: 'pulseRing 1.8s infinite',
                  opacity: 0.5
                }}
              />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>{peer.name}</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Speaking...
              </p>
            </div>

            {/* Audio Waves Simulation */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '24px', marginTop: '4px' }}>
              <div className="audio-bar b1" />
              <div className="audio-bar b2" />
              <div className="audio-bar b3" />
              <div className="audio-bar b4" />
              <div className="audio-bar b5" />
            </div>
          </div>

          {/* Tag Info */}
          <div 
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              backdropFilter: 'blur(4px)',
              zIndex: 3
            }}
          >
            {peer.name}
          </div>
        </div>

        {/* Video Card 2: Local Participant (You) */}
        <div 
          style={{
            position: 'relative',
            backgroundColor: '#111827',
            borderRadius: '16px',
            overflow: 'hidden',
            aspectRatio: '16/10',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isVideoOff ? (
            <div style={{ textAlign: 'center', zIndex: 2 }}>
              <div 
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  backgroundColor: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#64748b',
                  margin: '0 auto 16px auto',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                SJ
              </div>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>Sarah Jenkins (You)</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b' }}>Camera Muted</p>
            </div>
          ) : (
            <>
              {localStream ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)' // Mirror local display
                  }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <ShieldAlert size={24} style={{ color: '#f59e0b', marginBottom: '8px' }} />
                  <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700' }}>Camera Blocked or Unavailable</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b', maxWidth: '200px' }}>
                    Using placeholder. Allow camera permissions to broadcast live.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Local participant tag */}
          <div 
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              backdropFilter: 'blur(4px)',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Sarah Jenkins (You)</span>
            {isMuted && <MicOff size={11} color="#ef4444" />}
          </div>
        </div>
      </div>

      {/* Screen Sharing Banner */}
      {isScreenSharing && (
        <div 
          style={{
            position: 'absolute',
            top: '76px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(59, 130, 246, 0.9)',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
        >
          <ScreenShare size={12} />
          <span>You are sharing your screen</span>
        </div>
      )}

      {/* Bottom Meeting Controls Bar */}
      <div 
        style={{
          height: '84px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          backdropFilter: 'blur(15px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '0 24px'
        }}
      >
        {/* Toggle Mute */}
        <button
          type="button"
          onClick={handleToggleMute}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: isMuted ? '#ef4444' : 'rgba(255,255,255,0.08)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          className="huddle-btn"
        >
          {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* Toggle Video */}
        <button
          type="button"
          onClick={handleToggleVideo}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: isVideoOff ? '#ef4444' : 'rgba(255,255,255,0.08)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          className="huddle-btn"
        >
          {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
        </button>

        {/* Share Screen */}
        <button
          type="button"
          onClick={handleToggleScreenShare}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: isScreenSharing ? '#3b82f6' : 'rgba(255,255,255,0.08)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          className="huddle-btn"
        >
          <ScreenShare size={18} />
        </button>

        {/* Spacer */}
        <div style={{ width: '20px' }} />

        {/* Hang Up / Leave */}
        <button
          type="button"
          onClick={onClose}
          style={{
            height: '46px',
            padding: '0 24px',
            borderRadius: '24px',
            border: 'none',
            backgroundColor: '#ef4444',
            color: 'white',
            fontSize: '13px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
        >
          <PhoneOff size={16} />
          <span>Leave Huddle</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .huddle-btn:hover {
          background-color: rgba(255, 255, 255, 0.15) !important;
          transform: scale(1.05);
        }
        
        /* Audio visualizer wave animation */
        @keyframes bounceWave {
          0%, 100% { height: 4px; }
          50% { height: 24px; }
        }
        .audio-bar {
          width: 3px;
          background-color: #10b981;
          border-radius: 2px;
        }
        .audio-bar.b1 { animation: bounceWave 0.8s ease infinite; }
        .audio-bar.b2 { animation: bounceWave 0.8s ease infinite 0.15s; }
        .audio-bar.b3 { animation: bounceWave 0.8s ease infinite 0.3s; }
        .audio-bar.b4 { animation: bounceWave 0.8s ease infinite 0.1s; }
        .audio-bar.b5 { animation: bounceWave 0.8s ease infinite 0.4s; }
      ` }} />
    </div>
  );
}
