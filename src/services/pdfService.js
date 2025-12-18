import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BRAND_COLOR = '#f54703'; // Nafira's primary orange

const addBranding = (doc) => {
  // Add header
  doc.setFillColor(34, 34, 34); // Dark background
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, 'F');

  // Add logo text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(BRAND_COLOR);
  doc.text('nafira', 20, 20);

  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('Metabolic Radiance Report', 22, 26);

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, doc.internal.pageSize.getHeight() - 10);
  }
};

export const exportToPDF = async (elementId, fileName) => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error('Element not found for PDF export');
    return;
  }

  // Hide export button before capturing
  const exportButton = input.querySelector('.export-button');
  if (exportButton) {
    exportButton.style.display = 'none';
  }

  const canvas = await html2canvas(input, {
    backgroundColor: '#1a1a1a', // Dark background
    scale: 2, // Higher resolution
  });

  // Show export button again
  if (exportButton) {
    exportButton.style.display = 'block';
  }

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

  addBranding(pdf);

  pdf.save(`${fileName}.pdf`);
};
