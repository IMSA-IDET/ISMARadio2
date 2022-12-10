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
    }
}