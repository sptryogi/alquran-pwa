import re

def normalize_arabic(text: str) -> str:
    if not text:
        return ""
    # remove tashkeel/harakat
    text = re.sub(r'[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED]', '', text)
    # normalize alef variants
    text = re.sub(r'[إأآا]', 'ا', text)
    # normalize ya
    text = re.sub(r'[ى]', 'ي', text)
    # remove tatweel
    text = text.replace('\u0640', '')
    # remove punctuation and non Arabic letters/digits
    text = re.sub(r'[^\u0600-\u06FF\s]', '', text)
    # collapse spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text


