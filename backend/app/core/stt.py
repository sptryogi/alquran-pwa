# Minimal STT implementation (dummy) — replace with Whisper or cloud STT later.
# import tempfile
# import os

# def do_stt(audio_bytes: bytes) -> str:
#     """
#     Current implementation returns a placeholder.
#     Replace with Whisper or cloud STT integration for real Arabic transcription.
#     """
#     # For demo: write file to temp then return placeholder
#     try:
#         with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
#             tmp.write(audio_bytes)
#             tmp.flush()
#             temp_path = tmp.name
#         # Here you would call your STT model/service with temp_path
#         # Example return (dummy)
#         return "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
#     finally:
#         try:
#             os.unlink(temp_path)
#         except Exception:
#             pass
from faster_whisper import WhisperModel
import tempfile, os

model = WhisperModel("small", device="cpu")

def do_stt(audio_bytes: bytes) -> str:
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            tmp.write(audio_bytes)
            tmp.flush()
            temp_path = tmp.name

        segments, _ = model.transcribe(temp_path, language="ar")
        return " ".join([seg.text for seg in segments]).strip()

    finally:
        try:
            os.unlink(temp_path)
        except:
            pass


