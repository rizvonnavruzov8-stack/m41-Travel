from pydantic import BaseModel, EmailStr
from typing import Optional

class ContactForm(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    email: EmailStr
    num_travelers: Optional[int] = 1
    message: Optional[str] = None
    recaptcha_token: str
