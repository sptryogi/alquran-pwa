from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from app.core.ocr import do_ocr
from app.core.stt import do_stt
from app.core.scoring import score_text
from fastapi.responses import JSONResponse
from fastapi.responses import StreamingResponse
# from app.core.gtts_utils import text_to_speech
from app.core.gtts_utils import text_to_speech_mixed
router = APIRouter()

# simple in-memory progress store (not persistent)
_progress_store = {
    "write": {"total_score": 0.0, "count": 0},
    "read": {"total_score": 0.0, "count": 0}
}


# @router.get("/feedback-tts")
# async def feedback_tts(feedback: str, lang: str = "ar"):
#     try:
#         buf = text_to_speech(feedback, lang)
#         return StreamingResponse(buf, media_type="audio/mpeg")
#     except Exception as e:
#         return JSONResponse({"error": str(e)}, status_code=500)
@router.get("/feedback-tts")
async def feedback_tts(feedback: str):
    try:
        audio_buf = text_to_speech_mixed(feedback)
        return StreamingResponse(audio_buf, media_type="audio/mpeg")
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@router.post("/scan-image")
async def scan_image(file: UploadFile = File(...)):
    try:
        img_bytes = await file.read()
        recognized = do_ocr(img_bytes)

        score, feedback = score_text(recognized)

        return JSONResponse({
            "recognized": recognized,
            "score": score,
            "feedback": feedback
        })
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


@router.post("/scan-audio")
async def scan_audio(file: UploadFile = File(...)):
    try:
        audio_bytes = await file.read()
        recognized = do_stt(audio_bytes)

        score, feedback = score_text(recognized)

        return JSONResponse({
            "recognized": recognized,
            "score": score,
            "feedback": feedback
        })
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@router.post("/progress")
async def post_progress(payload: dict):
    # payload: {type: "write"|"read", score: number}
    t = payload.get("type")
    s = float(payload.get("score", 0))
    if t not in ("write", "read"):
        return JSONResponse({"error": "invalid type"}, status_code=400)
    store = _progress_store[t]
    store["total_score"] += s
    store["count"] += 1
    return {"status": "ok", "stored": store}

@router.get("/progress")
async def get_progress():
    res = {}
    for k, v in _progress_store.items():
        avg = (v["total_score"] / v["count"]) if v["count"] > 0 else 0
        res[k] = round(avg, 2)
        res[f"{k}Count"] = v["count"]
    return {
        "write": res["write"],
        "writeCount": _progress_store["write"]["count"],
        "read": res["read"],
        "readCount": _progress_store["read"]["count"]
    }

@router.get("/health")
async def health():
    return {"status": "ok"}
