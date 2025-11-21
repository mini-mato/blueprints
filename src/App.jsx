import { useState } from 'react'
import PdfViewer from './components/PdfViewer'
import './App.css'

function App() {
  const pdfFile = "/blueprints.pdf";

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Innovation Systems</h1>
        <h2>Blueprints and Lessons from MIT</h2>
        <p className="authors">Tim Miano & Fiona E. Murray</p>
      </header>

      <main>
        <section className="intro-section">
          <p>
            A blueprint for MIT's expansive innovation system, guiding the next generation of innovators toward real-world impact.
            The goal of this report is to provide a clear and systematic view of MIT's expansive and complex innovation system
            as a blueprint of a mature university innovation system.
          </p>
        </section>

        <section className="pdf-section">
          <PdfViewer file={pdfFile} />
        </section>

        <div className="download-section">
          <a href={pdfFile} download className="download-button">
            Download PDF
          </a>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Innovation Blueprints. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
