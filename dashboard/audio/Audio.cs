using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace audio
{
    internal class Audio
    {
        /*
         * Arguments:
         * [0]: socket server URL
         * [1]: microphone ID
         * [2]: recoding's file name
         * [3]: volume multiplier
         */
        static public void Main(string[] args)
        {
            if (args.Length > 0)
            {
                Websocket websocket = new Websocket(args[0]);
                Sound sound = new Sound(websocket);

                sound.StartRecording(int.Parse(args[1]), args[2], float.Parse(args[3]));
            } else
            {
                Console.WriteLine("No arguments provided");
                Environment.Exit(1);
            }
        }
    }
}