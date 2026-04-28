# content_extractor.py

def extract_text_from_youtube(url):
    # existing logic (reuse your current code)
    return transcript_text


def extract_text_from_pdf(file_path):
    import fitz  # PyMuPDF
    text = ""

    doc = fitz.open(file_path)
    for page in doc:
        text += page.get_text()

    return text


def extract_text_from_image(file_path):
    import easyocr

    reader = easyocr.Reader(['en'])
    result = reader.readtext(file_path, detail=0)

    return " ".join(result)