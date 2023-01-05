using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace audio
{
    public class FileRecorder : Recorder
    {
        private string folderName;

        public FileRecorder(Websocket websocket, string folderName)
        {
            this.websocket = websocket;
            this.folderName = folderName;
        }

        public override void StartRecording()
        {

        }

        public override void StopRecording()
        {

        }
    }
}
