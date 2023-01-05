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
         * 
         * 
         * [0]: socket server URL
         * [1]: play from microphone ("-m") or file ("-f")
         * 
         * microhpone:
         * [2]: microphone ID
         * [3]: recoding's file name
         * 
         * file:
         * [2]: folder to play
         */
        static public void Main(string[] args)
        {
            if (args.Length > 0)
            {
                Websocket websocket = new Websocket(args[0]);
                Recorder recorder;

                if (args[1] == "-m")
                {
                    recorder = new MicrophoneRecorder(websocket, int.Parse(args[2]), args[3]);
                } else
                {
                    recorder = new FileRecorder(websocket, args[2]);
                }

                PipeListener listener = new PipeListener(recorder);
                recorder.StartRecording();
            } else
            {
                Console.WriteLine("No arguments provided");
                Environment.Exit(1);
            }
        }
    }
}