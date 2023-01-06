using NAudio.Gui;
using NAudio.Wave;
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
        private string folderDir;

        public FileRecorder(Websocket websocket, string folderName)
        {
            this.websocket = websocket;
            this.folderName = folderName;

            folderDir = Path.Combine(Environment.CurrentDirectory, folderName);
        }

        public override void StartRecording()
        {
            DirectoryInfo info = new DirectoryInfo(folderDir);
            FileInfo[] files = info.GetFiles("*.wav");

            for (int fileIndex = 0; fileIndex < files.Length; fileIndex++)
            {
                WaveFileReader reader = new WaveFileReader(files[fileIndex].FullName);

                byte[] buffer = new byte[reader.Length];
                int read = reader.Read(buffer, 0, buffer.Length);

                int bytesPerSample = 44100 * (reader.WaveFormat.BitsPerSample / 8) * reader.WaveFormat.Channels;
                float songLength = read / bytesPerSample;

                for (int second = 0; second < read / bytesPerSample; second++)
                {
                    int sampleByte = second * bytesPerSample;
                    byte[] sample = buffer[sampleByte..(sampleByte + bytesPerSample)];

                    Task.Delay((int)(1000 * (second + songLength * fileIndex))).ContinueWith((task) => websocket.SendSoundData(sample));
                }

                reader.Dispose();
            }
        }

        public override void StopRecording()
        {

        }
    }
}
