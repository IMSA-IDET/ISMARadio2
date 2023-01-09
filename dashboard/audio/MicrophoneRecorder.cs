using NAudio.CoreAudioApi;
using NAudio.Wave;

namespace audio
{
    public class MicrophoneRecorder : Recorder
    {
        private int deviceID;
        private string recordingName;

        private WaveInEvent waveIn;
        private WaveFileWriter writer = null;

        public MicrophoneRecorder(Websocket websocket, int deviceID, string recordingName)
        {
            this.websocket = websocket;
            this.deviceID = deviceID;
            this.recordingName = recordingName;
        }

        public WaveInCapabilities[] GetDeviceList()
        {
            WaveInCapabilities[] devices = new WaveInCapabilities[WaveIn.DeviceCount];

            for (int i = 0; i < WaveIn.DeviceCount; i++)
            {
                WaveInCapabilities capabilities = WaveIn.GetCapabilities(i);
                devices[i] = capabilities;
            }

            return devices;
        }

        public float GetVolume()
        {
            var devEnum = new MMDeviceEnumerator();
            var defaultDevice = devEnum.GetDefaultAudioEndpoint(DataFlow.Render, Role.Multimedia);
            var volume = defaultDevice.AudioEndpointVolume;
            float masterVolumePercent = volume.MasterVolumeLevelScalar;

            return masterVolumePercent;
        }

        public override void StartRecording()
        {
            waveIn = new WaveInEvent
            {
                DeviceNumber = deviceID,
                WaveFormat = new WaveFormat(rate: 44100, bits: 32, channels: 1),
                BufferMilliseconds = 1000
            };


            string projectDir = Environment.CurrentDirectory;
            string outputDir = Path.Combine(projectDir, @"record");
            Directory.CreateDirectory(outputDir);
            string outputPath = Path.Combine(outputDir, recordingName + ".wav");

            writer = new WaveFileWriter(outputPath, waveIn.WaveFormat);

            waveIn.DataAvailable += new EventHandler<WaveInEventArgs>(waveInDataHandler);
            waveIn.RecordingStopped += new EventHandler<StoppedEventArgs>(waveInStopHandler);
            waveIn.StartRecording();
            Console.WriteLine("Recording started");

            ManualResetEvent exitEvent = new ManualResetEvent(false);
            exitEvent.WaitOne();

            void waveInDataHandler(object? sender, WaveInEventArgs e)
            {
                byte[] buffer = e.Buffer;
                for (int i = 0; i < buffer.Length; i++) {
                    buffer[i] = (byte)(buffer[i] * volumeMultiplier);
                }

                websocket.SendSoundData(buffer);

                // Stop recording at 30 seconds
                if (writer.Position < waveIn.WaveFormat.AverageBytesPerSecond * 60 * 60)
                {
                    writer.Write(e.Buffer, 0, e.BytesRecorded);
                }
            }

            void waveInStopHandler(object? sender, StoppedEventArgs e)
            {
                waveIn.Dispose();
                writer.Dispose();
            }
        }

        public override void StopRecording()
        {
            waveIn.StopRecording();
        }
    }
}