import { jsPDF } from 'jspdf'
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
  AlignmentType,
} from 'docx'
import { snapshotToPlainLines } from './exportSnapshot'

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function safeFileBase(snapshot) {
  const raw = snapshot.project_label || 'kma-parm'
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9åäö]+/gi, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
}

/** Genererar och laddar ner PDF från snapshot (endast valda flikar). */
export function downloadSnapshotPdf(snapshot) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const margin = 48
  const pageWidth = doc.internal.pageSize.getWidth()
  const maxWidth = pageWidth - margin * 2
  let y = margin
  const lineHeight = 14

  const ensureSpace = (needed = lineHeight) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }
  }

  const write = (text, opts = {}) => {
    const fontSize = opts.fontSize || 10
    const fontStyle = opts.bold ? 'bold' : 'normal'
    doc.setFont('helvetica', fontStyle)
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(String(text || ''), maxWidth)
    lines.forEach((line) => {
      ensureSpace(lineHeight + 2)
      doc.text(line, margin, y)
      y += lineHeight
    })
    if (opts.gap) y += opts.gap
  }

  write(`KMA-pärm – ${snapshot.project_label}`, { fontSize: 16, bold: true, gap: 6 })
  write(`Exporterad: ${new Date(snapshot.generated_at).toLocaleString('sv-SE')}`, { gap: 2 })
  write(`Valda flikar: ${snapshot.flik_nrs.join(', ')}`, { gap: 12 })

  snapshot.sections.forEach((section) => {
    write(section.title, { fontSize: 13, bold: true, gap: 4 })
    if (section.helper) write(section.helper, { gap: 4 })
    if (section.note) {
      write(section.note, { gap: 10 })
      return
    }
    section.records.forEach((rec, idx) => {
      write(`Post ${idx + 1}`, { bold: true, gap: 2 })
      const lines = snapshotToPlainLines({
        ...snapshot,
        sections: [{ ...section, records: [rec], note: null }],
      }).filter((l) => l.includes(':'))
      lines.forEach((l) => write(l))
      y += 8
    })
    y += 6
  })

  doc.save(`${safeFileBase(snapshot)}-kma.pdf`)
}

/** Genererar och laddar ner Word (.docx) från snapshot. */
export async function downloadSnapshotWord(snapshot) {
  const children = [
    new Paragraph({
      text: `KMA-pärm – ${snapshot.project_label}`,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.LEFT,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Exporterad: ${new Date(snapshot.generated_at).toLocaleString('sv-SE')}`,
          size: 20,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Valda flikar: ${snapshot.flik_nrs.join(', ')}`,
          size: 20,
        }),
      ],
      spacing: { after: 240 },
    }),
  ]

  snapshot.sections.forEach((section) => {
    children.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 80 },
      }),
    )
    if (section.helper) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: section.helper, italics: true, size: 20 })],
          spacing: { after: 120 },
        }),
      )
    }
    if (section.note) {
      children.push(new Paragraph({ text: section.note, spacing: { after: 160 } }))
      return
    }
    const plain = snapshotToPlainLines({
      generated_at: snapshot.generated_at,
      project_label: snapshot.project_label,
      flik_nrs: [section.flik_nr],
      sections: [section],
    })
    plain
      .filter((l) => l && !l.startsWith('=') && !l.startsWith('KMA-pärm') && !l.startsWith('Exporterad') && !l.startsWith('Flikar:'))
      .forEach((line) => {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: line, size: 20 })],
            spacing: { after: 40 },
          }),
        )
      })
  })

  const doc = new Document({
    sections: [{ properties: {}, children }],
  })
  const blob = await Packer.toBlob(doc)
  downloadBlob(blob, `${safeFileBase(snapshot)}-kma.docx`)
}
