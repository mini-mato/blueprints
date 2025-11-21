import { useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function PdfViewer({ file }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [width, setWidth] = useState(window.innerWidth);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Navigation
    const changePage = (offset) => {
        setPageNumber((prevPageNumber) => {
            const newPageNumber = prevPageNumber + offset;
            return Math.min(Math.max(1, newPageNumber), numPages);
        });
    };

    const previousPage = () => {
        if (isMobile) {
            // Mobile is scroll-based, but if we had buttons:
            changePage(-1);
        } else {
            // Desktop Book View
            // If we are on page 2 (showing 2 & 3), go to 1.
            // If we are on page 1, do nothing (disabled).
            // If we are on page 4 (showing 4 & 5), go to 2.
            if (pageNumber === 2) {
                setPageNumber(1);
            } else {
                changePage(-2);
            }
        }
    };

    const nextPage = () => {
        if (isMobile) {
            changePage(1);
        } else {
            // Desktop Book View
            // If we are on page 1, go to 2 (showing 2 & 3).
            // If we are on page 2, go to 4 (showing 4 & 5).
            if (pageNumber === 1) {
                setPageNumber(2);
            } else {
                changePage(2);
            }
        }
    };

    // Ensure we don't show a non-existent page in 2-page view
    // In Book View:
    // Page 1: Single
    // Page 2: Shows 2 & 3
    // Page 4: Shows 4 & 5
    const isCover = !isMobile && pageNumber === 1;
    const secondPageNumber = pageNumber + 1;
    const showSecondPage = !isMobile && !isCover && secondPageNumber <= numPages;

    if (isMobile) {
        return (
            <div className="pdf-viewer-container mobile-scroll">
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="pdf-document-mobile"
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={Math.min(width - 40, 600)}
                            className="pdf-page-mobile"
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    ))}
                </Document>
            </div>
        );
    }

    return (
        <div className="pdf-viewer-container">
            <div className="pdf-controls">
                <button
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                    className="nav-button"
                >
                    Previous
                </button>
                <p>
                    Page {pageNumber} {showSecondPage ? `& ${secondPageNumber}` : ''} of {numPages}
                </p>
                <button
                    disabled={pageNumber >= numPages || (showSecondPage && secondPageNumber >= numPages)}
                    onClick={nextPage}
                    className="nav-button"
                >
                    Next
                </button>
            </div>

            <div className="pdf-document-wrapper">
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="pdf-document"
                >
                    <div className={`pdf-page-container ${isCover ? 'cover-page' : ''}`}>
                        <Page
                            pageNumber={pageNumber}
                            width={Math.min(width * 0.45, 600)}
                            className="pdf-page"
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                        {showSecondPage && (
                            <Page
                                pageNumber={secondPageNumber}
                                width={Math.min(width * 0.45, 600)}
                                className="pdf-page"
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                            />
                        )}
                    </div>
                </Document>
            </div>
        </div>
    );
}
