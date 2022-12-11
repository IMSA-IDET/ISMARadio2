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

        public Websocket(string url)
        {
            webscoket = new WebSocket(url);
            webscoket.Connect();
            Console.WriteLine("Client started");
        }

        public void SendSoundData(byte[] data)
        {
            webscoket.Send(data);
        }
    }
}