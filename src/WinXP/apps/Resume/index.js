import React from 'react';
import styled from 'styled-components';

export default function Resume({ pdfUrl, maskTopPx }) {
  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('resumePdfUrl') : null;
  const storedMask = typeof window !== 'undefined' ? localStorage.getItem('resumePdfMaskTopPx') : null;
  const url = pdfUrl || storedUrl || process.env.PUBLIC_URL + '/resume.pdf';
  const maskPx = Number(maskTopPx ?? storedMask ?? 0) || 0;
  return (
    <Container>
      <PDFViewer>
        <object
          data={url}
          type="application/pdf"
          aria-label="Resume PDF"
          className="pdf-object"
        >
          <iframe src={url} title="Resume PDF" className="pdf-iframe" />
          <div className="fallback">
            Unable to display PDF in this browser. You can download it instead:
            <a href={url} target="_blank" rel="noopener noreferrer"> resume.pdf</a>
          </div>
        </object>
        {maskPx > 0 && <div className="mask" style={{ height: maskPx }} />}
      </PDFViewer>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

const PDFViewer = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  height: 100%;
  .pdf-object,
  .pdf-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  .fallback {
    padding: 12px;
    font-size: 13px;
    line-height: 1.4;
    color: #222;
  }
`;
