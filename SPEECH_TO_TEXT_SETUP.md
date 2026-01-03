# Google Cloud Speech-to-Text Setup Guide

## Current Status
The app is running in **fallback mode**. It analyzes audio based on a sample transcription. To enable real audio transcription and get personalized feedback, follow these steps:

## Setup Instructions

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Note your Project ID

### 2. Enable Speech-to-Text API
1. In the Google Cloud Console, go to **APIs & Services > Library**
2. Search for "Cloud Speech-to-Text API"
3. Click **Enable**

### 3. Create a Service Account
1. Go to **IAM & Admin > Service Accounts**
2. Click **Create Service Account**
3. Name it (e.g., "the-path-speech-to-text")
4. Grant role: **Cloud Speech Client**
5. Click **Done**

### 4. Generate JSON Key
1. Find your new service account in the list
2. Click the three dots (⋮) > **Manage keys**
3. Click **Add Key > Create new key**
4. Choose **JSON** format
5. The key file will download automatically
6. Save it securely (e.g., `/home/vibecode/workspace/google-cloud-key.json`)

### 5. Set Environment Variable
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/home/vibecode/workspace/google-cloud-key.json"
```

To make it permanent, add to your `~/.bashrc` or `~/.profile`:
```bash
echo 'export GOOGLE_APPLICATION_CREDENTIALS="/home/vibecode/workspace/google-cloud-key.json"' >> ~/.bashrc
source ~/.bashrc
```

### 6. Restart the API Server
```bash
pkill -f "node api-server.js"
node api-server.js &
```

You should see:
```
✓ Google Cloud Speech-to-Text initialized
API server running on port 3001
Speech-to-Text: ENABLED
```

## How It Works

### With Google Cloud Enabled:
1. You record your mission debrief (up to 45 seconds)
2. Audio is sent to the backend
3. Backend transcribes your audio using Google Cloud Speech-to-Text
4. AI analyzes your transcription for:
   - **Specificity**: Did you give concrete examples?
   - **Reflection**: Did you explain what you learned?
   - **Action**: Did you describe what you actually did?
   - **Quest relevance**: Did you apply the specific principle?
5. You receive personalized feedback based on what you said

### Without Google Cloud (Fallback Mode):
- Uses a sample transcription for analysis
- Still provides feedback structure
- Good for testing, but not personalized to your voice

## Cost Information
- First 60 minutes per month: **FREE**
- After that: ~$0.024 per minute
- Typical 45-second debrief: **<$0.02**
- 100 debriefs per month: **~$2**

See [Google Cloud Speech-to-Text Pricing](https://cloud.google.com/speech-to-text/pricing)

## Testing
Once configured, test with:
```bash
curl http://localhost:3001/api/health
```

Response should show:
```json
{
  "status": "ok",
  "speechToText": "enabled"
}
```

## Troubleshooting

### "MetadataLookupWarning" in logs
- This is expected when credentials aren't configured
- Server falls back to sample transcription
- No impact on functionality

### "Error: GOOGLE_APPLICATION_CREDENTIALS not set"
- Make sure you exported the environment variable
- Check the path is correct and file exists
- Restart the server after setting the variable

### "Permission denied" when transcribing
- Verify the service account has "Cloud Speech Client" role
- Check the API is enabled for your project
- Confirm the JSON key file is valid

### "Audio format not supported"
- The app records in WEBM_OPUS format
- This is supported by Google Cloud Speech-to-Text
- If uploading files, use MP3, WAV, or WEBM

## Security Notes
- **Never commit** the JSON key file to git (it's in .gitignore)
- Keep your service account key secure
- Consider using environment-specific credentials for production
- Rotate keys periodically

## Advanced Configuration
Edit `api-server.js` to customize:
- Audio encoding settings (line 34)
- Language code (line 36)
- Model selection (line 37)
- Analysis criteria (lines 55-120)
