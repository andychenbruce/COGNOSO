use itertools::Itertools;

pub fn extract_text(pdf_bytes: &[u8]) -> Result<(), pdf::error::PdfError> {
    let file = pdf::file::FileOptions::cached().load(pdf_bytes)?;

    let resolver = file.resolver();

    for (page_nr, page) in file.pages().enumerate() {
        let page = page.expect("can't read page");
        let flow = pdf_text::run(&file, &page, &resolver).expect("can't render page");
        println!("# page {}", page_nr + 1);
        for run in flow.runs {
            for line in run.lines {
                println!("{}", line.words.iter().map(|w| &w.text).format(" "));
            }
            println!();
        }
    }

    todo!()
}
