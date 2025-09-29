from gtts import gTTS
import io
import re

def clean_text(text: str) -> str:
    """
    Bersihkan teks dari tanda asterisk (*) supaya tidak dibaca literal oleh TTS.
    Kalau ada **teks** → jadikan 'teks'.
    """
    # hapus tanda ** atau *
    text = re.sub(r"\*+", "", text)
    return text.strip()

# def text_to_speech(text: str, lang: str = "ar") -> io.BytesIO:
#     """Convert text to speech (gTTS) and return BytesIO MP3"""
#     buf = io.BytesIO()
#     safe_text = clean_text(text)
#     tts = gTTS(text=safe_text, lang=lang)
#     tts.write_to_fp(buf)
#     buf.seek(0)
#     return buf
import re
import io
from gtts import gTTS
from pydub import AudioSegment

def split_text_by_language(text: str):
    """
    Pisahkan teks ke blok Arab utuh vs Non-Arab.
    Indo tidak dipecah per kata.
    """
    parts = []
    pattern = re.compile(r'[\u0600-\u06FF]+(?:\s+[\u0600-\u06FF]+)*')  # blok Arab full kalimat

    last_end = 0
    for match in pattern.finditer(text):
        start, end = match.span()
        if start > last_end:
            # Gabungkan Indo jadi satu blok
            non_arab = text[last_end:start].strip()
            if non_arab:
                parts.append(("id", non_arab))
        # Tambahkan blok Arab
        arabic_text = match.group().strip()
        if arabic_text:
            parts.append(("ar", arabic_text))
        last_end = end

    if last_end < len(text):
        non_arab = text[last_end:].strip()
        if non_arab:
            parts.append(("id", non_arab))

    return parts


def text_to_speech_mixed(text: str) -> io.BytesIO:
    """
    Convert teks campuran Indo + Arab ke audio MP3 dengan gTTS.
    """
    text = clean_text(text)
    parts = split_text_by_language(text)

    combined = AudioSegment.silent(duration=500)
    for lang, segment in parts:
        if not segment.strip():
            continue

        # Kalau Arab, jangan pecah → baca utuh
        if lang == "ar":
            tts = gTTS(text=segment, lang="ar", slow=False)
        else:
            tts = gTTS(text=segment, lang="id", slow=False)

        buf = io.BytesIO()
        tts.write_to_fp(buf)
        buf.seek(0)
        audio_part = AudioSegment.from_file(buf, format="mp3")

        combined += audio_part + AudioSegment.silent(duration=300)

    out_buf = io.BytesIO()
    combined.export(out_buf, format="mp3")
    out_buf.seek(0)
    return out_buf
