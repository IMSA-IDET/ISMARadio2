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
        WebSocketServer server;

        public Websocket()
        {
            server = new WebSocketServer("ws://dragonsnest.far");

            server.AddWebSocketService<Test>("/stream");
            server.Start();
            Console.ReadKey(true);
            server.Stop();
        }

        public class Test : WebSocketBehavior
        {
            protected override void OnMessage(MessageEventArgs e)
            {
                //Send(msg);
            }
        }

        public void SendSoundData(byte[] data)
        {
            
        }
    }
}