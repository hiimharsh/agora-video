import AgoraRTC from "agora-rtc-sdk";
import config from "./config";

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'h264' });
client.init(config.appId!);

export default client;