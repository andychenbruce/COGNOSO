pub type AndyPdfError = pdf_extract::OutputError;

pub fn extract_text(pdf_bytes: &[u8]) -> Result<String, AndyPdfError> {
    //todo sort by pages and stuff
    pdf_extract::extract_text_from_mem(pdf_bytes)
}
