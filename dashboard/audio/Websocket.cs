using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace audio
{
    public class Websocket
    {
        WebSocket webscoket;

        public Websocket(int port)
        {
            webscoket = new WebSocket("ws://localhost:" + port.ToString());
            webscoket.Connect();
            Console.WriteLine("Client started");
        }

        public void SendSoundData(byte[] data)
        {
            webscoket.Send(data);
        }

        /*WebSocketServer server;

        public Websocket(int port)
        {
            server = new WebSocketServer(port);

            server.AddWebSocketService<SoundStream>("/stream");
            server.Start();
            Console.WriteLine("Server started");
            Console.ReadKey(true);
            server.Stop();
        }

        public class SoundStream : WebSocketBehavior
        {
            protected override void OnMessage(MessageEventArgs e)
            {
                Console.WriteLine("Data recieved: " + e.Data);
            }
        }

        public void SendSoundData(byte[] data)
        {
            server.WebSocketServices["/stream"].Sessions.Broadcast(data);
        }*/
    }
}