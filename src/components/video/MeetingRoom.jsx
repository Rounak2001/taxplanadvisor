import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useAuthStore } from '@/stores/useAuthStore';

export default function MeetingRoom() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const containerRef = useRef(null);

    useEffect(() => {
        let zp;
        const myMeeting = async () => {
            const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
            const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

            console.log("Meeting Init - AppID:", appID, "Secret Present:", !!serverSecret);
            console.log("User:", user);
            console.log("BookingID:", bookingId);

            if (!appID || !serverSecret) {
                console.error('ZegoCloud AppID or ServerSecret is missing in .env');
                return;
            }

            if (!user) {
                console.error('User is missing in MeetingRoom');
                return;
            }

            if (!containerRef.current) {
                console.error("Container ref is null");
                return;
            }

            try {
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    appID,
                    serverSecret,
                    bookingId,
                    user.id?.toString() || Date.now().toString(),
                    user.full_name || user.username || `User-${Date.now()}`
                );

                zp = ZegoUIKitPrebuilt.create(kitToken);

                zp.joinRoom({
                    container: containerRef.current,
                    scenario: {
                        mode: ZegoUIKitPrebuilt.VideoConference,
                    },
                    showScreenSharingButton: true,
                    onLeaveRoom: () => {
                        navigate('/dashboard'); // or /client for clients, ideally detected dynamically
                    },
                });
            } catch (err) {
                console.error("ZegoCloud Join Error:", err);
            }
        };

        if (user && bookingId) {
            myMeeting();
        }

        return () => {
            if (zp) {
                zp.destroy();
            }
        };
    }, [user, bookingId, navigate]);

    // Validation checks for rendering
    const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

    if (!appID || !serverSecret) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background p-4 text-center">
                <h2 className="text-xl font-bold text-destructive mb-2">Configuration Error</h2>
                <p className="text-muted-foreground">ZegoCloud credentials are missing in the environment variables.</p>
                <p className="text-sm text-muted-foreground mt-2">Please check VITE_ZEGO_APP_ID in .env</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mb-4"></div>
                <p className="text-muted-foreground">Initializing meeting info...</p>
            </div>
        );
    }

    return (
        <div
            className="w-full h-screen bg-white"
            ref={containerRef}
            id="zego-cloud-container"
        />
    );
}
