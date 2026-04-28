from services.content_extractor import (
    extract_text_from_youtube,
    extract_text_from_pdf,
    extract_text_from_image
)

def get_text(input_type, source):
    if input_type == "youtube":
        return extract_text_from_youtube(source)

    elif input_type == "pdf":
        return extract_text_from_pdf(source)

    elif input_type == "image":
        return extract_text_from_image(source)

    else:
        raise ValueError("Invalid input type")