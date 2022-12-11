using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace audio
{
    internal class Audio
    {
        static public void Main()
        {
            Websocket websocket = new Websocket("ws://localhost:3001");
            Sound sound = new Sound(websocket);

            sound.StartRecording(0);
        }
    }
}