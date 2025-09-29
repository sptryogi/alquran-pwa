from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import endpoints

app = FastAPI(title="Belajar Quran API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router)

@app.get("/")
async def root():
    return {"message": "Backend Running"}
