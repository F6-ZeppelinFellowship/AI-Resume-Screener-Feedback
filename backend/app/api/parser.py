import pdfplumber
import docx2txt
import re

def clean_text(text: str) -> str:
    """Removes broken encoding artifacts, hidden system characters, and normalizes whitespaces."""
    if not text:
        return ""
    # Replace multiple spaces/newlines with a single space
    text = re.sub(r'\s+', ' ', text)
    # Strip non-printable or corrupted ascii anomalies if needed
    text = text.strip()
    return text

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts raw text stream from a PDF binary block."""
    raw_text = ""
    # Use io.BytesIO(file_bytes) if loading directly from stream bytes
    import io
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                raw_text += page_text + "\n"
    return clean_text(raw_text)

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extracts raw text stream from a DOCX binary block."""
    import io
    # docx2txt can process file-like objects directly
    raw_text = docx2txt.process(io.BytesIO(file_bytes))
    return clean_text(raw_text)