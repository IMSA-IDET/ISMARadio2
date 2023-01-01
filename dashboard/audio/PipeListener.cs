using System;
using System.Collections.Generic;
using System.IO.Pipes;
using System.Linq;
using System.Reactive.Concurrency;
using System.Reactive.Linq;
using System.Text;
using System.Threading.Tasks;

namespace audio
{
    public class PipeListener
    {
        private NamedPipeClientStream pipeClient;

        public PipeListener(Sound sound)
        {
            startListening(sound);
        }

        private async Task startListening(Sound sound)
        {
            pipeClient = new NamedPipeClientStream("audioPipe");

            await pipeClient.ConnectAsync();
            Console.WriteLine("Connected to pipe");

            StreamReader reader = new StreamReader(pipeClient);
            StreamWriter writer = new StreamWriter(pipeClient);

            string output;
            while ((output = await reader.ReadLineAsync()) != null)
            {
                sound.volumeMultiplier = float.Parse(output);
            }
        }
    }
}
