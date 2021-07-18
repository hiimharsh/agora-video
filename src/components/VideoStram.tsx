import { Box, Button, Flex, Text } from "@chakra-ui/react"
import AgoraRTC, { SessionStats } from "agora-rtc-sdk";
import { useCallback, useEffect, useState } from "react";
import client from "../lib/agora";
import config from "../lib/config";

const agoraClient: any = client;
const queryParams = window.location.search;

const VideoStream = () => {
    const { token, channel, uid } = config;

    const [isHost, setIsHost] = useState<Boolean>(false);
    const [localStream, setLocalStreamId] = useState<AgoraRTC.Stream | null>(null);
    const [hostUid, setHostUid] = useState<String>('');
    const [videoState, setVideoState] = useState<Boolean>(true);
    const [audioState, setAudioState] = useState<Boolean>(true);
    const [views, setViews] = useState<number>(0);

    const joinChannel = useCallback((role: string) => {
        agoraClient.join(token, channel, uid, (uid: string) => {
            setHostUid(uid);
            if (role === 'host') {
                const localStream: AgoraRTC.Stream = AgoraRTC.createStream({
                    streamID: uid,
                    video: true,
                    audio: true,
                    screen: false,
                });

                localStream.init(() => {
                    localStream.play('host');
                    setLocalStreamId(localStream);
                    agoraClient.publish(localStream, (err: any) => console.error('publish failed', err));
                }, err => console.error('local stream failed', err));

                agoraClient.on('peer-online', (event: any) => {
                    agoraClient.getSessionStats((stats: SessionStats) => {
                        const userCount: number = parseInt(stats.UserCount!);
                        setViews(userCount);
                    });
                });

                agoraClient.on('peer-leave', (event: any) => {
                    agoraClient.getSessionStats((stats: SessionStats) => {
                        const userCount: number = parseInt(stats.UserCount!);
                        setViews(userCount);
                    });
                });
            }

            if (role === 'guest') {
                agoraClient.on('connection-state-change', (event: any) => console.log('guest', event));

                agoraClient.on('stream-added', (event: any) => {
                    const stream = event.stream;
                    const streamId = String(stream.getId());
                    if (hostUid !== streamId) {
                        agoraClient.subscribe(stream,
                            { video: true, audio: true, screen: false },
                            (err: any) => console.error(err));
                    }
                });

                agoraClient.on('stream-subscribed', (event: any) => {
                    const stream = event.stream;
                    stream.play('guest');
                });

                agoraClient.on('stream-removed', (event: any) => {
                    const stream = event.stream;
                    stream.close();
                });
            }
        }, (err: any) => console.error(err))
    }, [channel, hostUid, token, uid]);

    const toggleVideo = () => {
        if (videoState) localStream!.muteVideo();
        else localStream!.unmuteVideo();
        setVideoState(!videoState);
    }

    const toggleAudio = () => {
        if (audioState) localStream!.muteAudio();
        else localStream!.unmuteAudio();
        setAudioState(!audioState);
    }

    useEffect(() => {
        if (queryParams === '?host=true') {
            setIsHost(true);
            joinChannel('host');
        } else {
            setIsHost(false);
            joinChannel('guest');
        }
    }, [setIsHost, joinChannel]);

    return <>
        <Flex w={['100%', '100%', '80%', '80%', '60%']} mx="auto">
            <Box w="40%" h="100%" p="4">
                <Box w="100%" h="400px" id="host"
                    borderWidth="1px" borderRadius="sm"
                    bg="white"></Box>
                {
                    isHost ?
                    <>
                        <Flex pt="4">
                            <Flex>
                                <Button colorScheme="red" onClick={() => toggleAudio()}>
                                    {audioState ? 'Mute' : 'Unmute'}
                                </Button>
                                <Button colorScheme="blackAlpha" ml="2" onClick={() => toggleVideo()}>
                                    {videoState ? 'Disable' : 'Enable'} Camera
                                </Button>
                            </Flex>
                        </Flex>
                        <Flex justifyContent="center" alignItems="center"
                            borderWidth="1px" mt="4" p="4">
                            <Text colorScheme="gray">{views} Views watching the stream</Text>
                        </Flex>
                    </> : null
                }
            </Box>
            <Box w="60%" h="100%" p="4">
                <Box w="100%" h="600px" id="guest"
                    borderWidth="1px" borderRadius="sm"
                    bg="white"></Box>
            </Box>
        </Flex>
    </>;
}

export default VideoStream;