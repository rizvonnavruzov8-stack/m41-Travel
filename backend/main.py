from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import ContactForm

app = FastAPI(title="M41 Travel API")

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://127.0.0.1:5500",  # Live Server default
    "http://127.0.0.1:8000",
    "*", # Allow all for development ease
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Backend is running!"}

import httpx

@app.post("/api/submit-form")
async def submit_form(form_data: ContactForm):
    # Verify reCAPTCHA
    RECAPTCHA_SECRET_KEY = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe" # Test Secret Key
    verify_url = "https://www.google.com/recaptcha/api/siteverify"
    
    async with httpx.AsyncClient() as client:
        response = await client.post(verify_url, data={
            "secret": RECAPTCHA_SECRET_KEY,
            "response": form_data.recaptcha_token
        })
        result = response.json()
        
    if not result.get("success"):
        raise HTTPException(status_code=400, detail="reCAPTCHA verification failed")

    # Log to console
    print(f"Received form submission: {form_data}")
    
    # Save to JSON file ("Inbox")
    try:
        data_entry = form_data.model_dump()
        data_entry["timestamp"] = "2024-01-01T12:00:00" # Placeholder, ideally use datetime.now().isoformat()
        
        # We need datetime module
        import datetime
        data_entry["timestamp"] = datetime.datetime.now().isoformat()

        file_path = "backend/submissions.json"
        
        # Read existing data
        import json
        import os
        
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                try:
                    submissions = json.load(f)
                except json.JSONDecodeError:
                    submissions = []
        else:
            submissions = []
            
        submissions.append(data_entry)
        
        with open(file_path, "w") as f:
            json.dump(submissions, f, indent=2)
            
    except Exception as e:
        print(f"Error saving submission: {e}")
        # Continue anyway to return success to user
    
    return {
        "status": "success",
        "message": "Thank you for your inquiry! We will get back to you shortly.",
        "data": form_data
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
