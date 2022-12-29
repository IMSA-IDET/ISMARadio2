using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Websocket.Client;

namespace audio
{
    public class Websocket
    {
        WebsocketClient websocket;

        public Websocket(string url)
        {
            Uri uri = new Uri(url);
            websocket = new WebsocketClient(uri);

            websocket.ReconnectTimeout = TimeSpan.FromSeconds(30);
            websocket.ReconnectionHappened.Subscribe(info => Console.WriteLine($"Reconnection type: {info.Type}"));

            websocket.Start();
            Console.WriteLine("Client started");
        }

        public void SendSoundData(byte[] data)
        {
            websocket.Send(data);
        }
    }
}