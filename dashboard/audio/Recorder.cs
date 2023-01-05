using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace audio
{
    public abstract class Recorder
    {
        public float volumeMultiplier = 1.0f;
        public Websocket websocket;

        public abstract void StartRecording();
        public abstract void StopRecording();
    }
}
