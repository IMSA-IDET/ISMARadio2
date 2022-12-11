using NAudio.CoreAudioApi;
using NAudio.Wave;

namespace audio
{
    public class Sound
    {
        private Websocket websocket;
        private WaveInEvent waveIn;
        private WaveFileWriter writer = null;


        public Sound(Websocket ws)
        {
            websocket = ws;
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

        public void StartRecording(int deviceID)
        {
            waveIn = new WaveInEvent
            {
                DeviceNumber = deviceID,
                WaveFormat = new WaveFormat(rate: 44100, bits: 32, channels: 1),
                BufferMilliseconds = 1000
            };

            var outputFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Desktop), "test");
            Directory.CreateDirectory(outputFolder);
            var outputFilePath = Path.Combine(outputFolder, "test.wav");

            writer = new WaveFileWriter(outputFilePath, waveIn.WaveFormat);

            waveIn.DataAvailable += new EventHandler<WaveInEventArgs>(waveInDataHandler);
            waveIn.RecordingStopped += new EventHandler<StoppedEventArgs>(waveInStopHandler);
            waveIn.StartRecording();

            Console.ReadKey();

            void waveInDataHandler(object? sender, WaveInEventArgs e)
            {
                byte[] buffer = e.Buffer;
                websocket.SendSoundData(buffer);

                // Stop recording at 30 seconds
                if (writer.Position < waveIn.WaveFormat.AverageBytesPerSecond * 30)
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

        public void StopRecording()
        {
            waveIn.StopRecording();
        }
    }
}