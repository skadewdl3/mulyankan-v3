export const downloadPDF = (fcanvases, updateProgress) => {
  // Initialize doc using default config
  let jspdf = window.jspdf.jsPDF
  let doc = new jspdf('1', 'pt', 'a4')

  //
  fcanvases.forEach((fcanvas, i) => {
    updateProgress((i / (fcanvases.length - 1)) * 100)
    // Set some variables based on dimensions and dataurl of image
    let src = fcanvas.toDataURL({ format: 'png' })
    let width = fcanvas.width
    let height = fcanvas.height

    /*
    If width > height ---> Page is in landscape orientation, use landscape (l) as orientation
    If height >= width --> Page in in portrait orientation, use portrait (p) as orientation
    */
    let orientation = width > height ? 'l' : 'p'
    doc.addPage([width, height], orientation)
    doc.addImage(src, 'PNG', 0, 0, width, height, null, 'NONE')
  })

  // First page takes default config. Pages might have changed orientation, so delete first page.
  doc.deletePage(1)

  // Download PDF
  doc.save('test.pdf')
}
