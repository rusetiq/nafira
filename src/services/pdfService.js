import jsPDF from 'jspdf';
import api from './api.js';

const BRAND_COLOR = [245, 71, 3];
const DARK_BG = [18, 18, 18];
const PAGE_BG = [10, 10, 10];
const CARD_BG = [28, 28, 28];
const TEXT_PRIMARY = [255, 255, 255];
const TEXT_SECONDARY = [180, 180, 180];
const TEXT_MUTED = [120, 120, 120];
const CARD_BORDER = [45, 45, 45];

const addHeader = (doc, pageWidth) => {
  doc.setFillColor(...DARK_BG);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...BRAND_COLOR);
  doc.text('NAFIRA', 20, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_MUTED);
  doc.text('SMART NUTRITION', 20, 25);

  doc.setFontSize(10);
  doc.setTextColor(...TEXT_SECONDARY);
  doc.text('Nutrition Analysis Report', 20, 33);
};

const addFooter = (doc, pageWidth, pageHeight, pageNum, totalPages) => {
  doc.setFillColor(...DARK_BG);
  doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');

  doc.setFontSize(7);
  doc.setTextColor(...TEXT_MUTED);
  doc.text(
    `Generated on ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`,
    20,
    pageHeight - 7
  );

  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - 7, { align: 'center' });

  doc.setTextColor(...TEXT_SECONDARY);
  doc.text('nafira.app', pageWidth - 20, pageHeight - 7, { align: 'right' });
};

const addCard = (doc, x, y, width, height) => {
  doc.setFillColor(...CARD_BG);
  doc.roundedRect(x, y, width, height, 2, 2, 'F');

  doc.setDrawColor(...CARD_BORDER);
  doc.setLineWidth(0.2);
  doc.roundedRect(x, y, width, height, 2, 2, 'S');
};

const addSectionTitle = (doc, title, subtitle, x, y) => {
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_MUTED);
  doc.text(subtitle.toUpperCase(), x, y);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...TEXT_PRIMARY);
  doc.text(title, x, y + 7);
};

const calculateMealCardHeight = (doc, meal, width) => {
  const cardPadding = 8;
  const scoreWidth = 35;
  const availableWidth = width - (cardPadding * 2) - scoreWidth;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(meal.title, availableWidth);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const notesLines = doc.splitTextToSize(meal.notes, availableWidth);

  const titleHeight = titleLines.length * 5;
  const notesHeight = notesLines.length * 3.5;

  return Math.max(32, titleHeight + notesHeight + 22);
};

const addMealCard = (doc, meal, x, y, width) => {
  const cardPadding = 8;
  const scoreWidth = 35;
  const availableWidth = width - (cardPadding * 2) - scoreWidth;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(meal.title, availableWidth);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const notesLines = doc.splitTextToSize(meal.notes, availableWidth);

  const titleHeight = titleLines.length * 5;
  const notesHeight = notesLines.length * 3.5;
  const cardHeight = Math.max(32, titleHeight + notesHeight + 22);

  addCard(doc, x, y, width, cardHeight);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...TEXT_PRIMARY);
  doc.text(titleLines, x + cardPadding, y + 9);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_MUTED);
  doc.text(meal.date, x + cardPadding, y + 9 + titleHeight + 2);

  doc.setFontSize(8);
  doc.setTextColor(...TEXT_SECONDARY);
  doc.text(notesLines, x + cardPadding, y + 9 + titleHeight + 7);

  doc.setFontSize(7);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('SCORE', x + width - 26, y + 9);

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND_COLOR);
  doc.text(meal.score.toString(), x + width - 17, y + 22, { align: 'center' });

  return cardHeight;
};

const drawChart = (doc, data, x, y, width, height, type = 'line') => {
  if (!data || data.length === 0) return;

  addCard(doc, x, y, width, height);

  const chartX = x + 12;
  const chartY = y + 8;
  const chartWidth = width - 20;
  const chartHeight = height - 20;

  doc.setDrawColor(...CARD_BORDER);
  doc.setLineWidth(0.15);
  for (let i = 0; i <= 4; i++) {
    const gridY = chartY + (chartHeight / 4) * i;
    doc.line(chartX, gridY, chartX + chartWidth, gridY);
  }

  const values = data.map(d => d.score || d.calories || 0);
  const maxValue = Math.max(...values, 1);
  const points = data.map((d, i) => {
    const value = d.score || d.calories || 0;
    return {
      x: chartX + (chartWidth / Math.max(data.length - 1, 1)) * i,
      y: chartY + chartHeight - ((value / maxValue) * chartHeight)
    };
  });

  if (type === 'area') {
    doc.setFillColor(245, 71, 3, 0.15);
    const areaPoints = [
      [points[0].x, chartY + chartHeight],
      ...points.map(p => [p.x, p.y]),
      [points[points.length - 1].x, chartY + chartHeight]
    ];
    doc.setDrawColor(253, 139, 93);
    doc.setLineWidth(0.4);
    for (let i = 0; i < areaPoints.length - 1; i++) {
      doc.line(areaPoints[i][0], areaPoints[i][1], areaPoints[i + 1][0], areaPoints[i + 1][1]);
    }
  }

  doc.setDrawColor(...BRAND_COLOR);
  doc.setLineWidth(1.2);
  for (let i = 0; i < points.length - 1; i++) {
    doc.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
  }

  doc.setFillColor(...BRAND_COLOR);
  points.forEach(p => {
    if (isFinite(p.x) && isFinite(p.y)) {
      const size = 1.3;
      doc.rect(p.x - size, p.y - size, size * 2, size * 2, 'F');
    }
  });

  doc.setFontSize(7);
  doc.setTextColor(...TEXT_MUTED);
  data.forEach((d, i) => {
    if (d.day && isFinite(points[i].x)) {
      doc.text(d.day, points[i].x, chartY + chartHeight + 4, { align: 'center' });
    }
  });
};

const addBadge = (doc, badge, x, y, width) => {
  addCard(doc, x, y, width, 38);

  doc.setDrawColor(...BRAND_COLOR);
  doc.setLineWidth(0.4);
  const centerX = x + width / 2;
  const centerY = y + 13;
  const radius = 7;
  const segments = 32;
  for (let i = 0; i < segments; i++) {
    const angle1 = (i / segments) * Math.PI * 2;
    const angle2 = ((i + 1) / segments) * Math.PI * 2;
    const x1 = centerX + Math.cos(angle1) * radius;
    const y1 = centerY + Math.sin(angle1) * radius;
    const x2 = centerX + Math.cos(angle2) * radius;
    const y2 = centerY + Math.sin(angle2) * radius;
    doc.line(x1, y1, x2, y2);
  }

  doc.setFontSize(14);
  doc.setTextColor(...BRAND_COLOR);
  doc.text('★', x + width / 2, y + 16, { align: 'center' });

  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_MUTED);
  doc.text('ACHIEVEMENT UNLOCKED', x + width / 2, y + 24, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...TEXT_PRIMARY);
  const titleLines = doc.splitTextToSize(badge.title, width - 8);
  doc.text(titleLines, x + width / 2, y + 31, { align: 'center' });
};

export const exportToPDF = async (elementId, fileName) => {
  try {
    const [meals, stats, badges] = await Promise.all([
      api.getMealHistory(10),
      api.getWeeklyStats(),
      api.getBadges()
    ]);

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    const footerHeight = 15;
    const maxY = pageHeight - footerHeight - 5;

    let currentPage = 1;
    let yPos = 48;

    doc.setFillColor(...PAGE_BG);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    addHeader(doc, pageWidth);

    addSectionTitle(doc, 'Performance Metrics', 'Weekly Overview', margin, yPos);
    yPos += 14;

    drawChart(doc, stats, margin, yPos, contentWidth / 2 - 5, 55, 'line');
    drawChart(doc, stats, margin + contentWidth / 2 + 5, yPos, contentWidth / 2 - 5, 55, 'area');
    yPos += 65;

    addSectionTitle(doc, 'Recent Meals', 'Meal Timeline', margin, yPos);
    yPos += 14;

    meals.forEach((meal, idx) => {
      const cardHeight = calculateMealCardHeight(doc, meal, contentWidth);

      if (yPos + cardHeight > maxY) {
        addFooter(doc, pageWidth, pageHeight, currentPage, '?');
        doc.addPage();
        currentPage++;
        doc.setFillColor(...PAGE_BG);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        addHeader(doc, pageWidth);
        yPos = 48;
      }

      addMealCard(doc, meal, margin, yPos, contentWidth);
      yPos += cardHeight + 4;
    });

    if (badges.length > 0) {
      if (yPos + 55 > maxY) {
        addFooter(doc, pageWidth, pageHeight, currentPage, '?');
        doc.addPage();
        currentPage++;
        doc.setFillColor(...PAGE_BG);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        addHeader(doc, pageWidth);
        yPos = 48;
      }

      addSectionTitle(doc, 'Your Milestones', 'Achievements', margin, yPos);
      yPos += 14;

      const badgeWidth = (contentWidth - 10) / 3;
      badges.forEach((badge, idx) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);

        if (col === 0 && row > 0) {
          yPos += 42;
        }

        if (col === 0 && yPos + 38 > maxY) {
          addFooter(doc, pageWidth, pageHeight, currentPage, '?');
          doc.addPage();
          currentPage++;
          doc.setFillColor(...PAGE_BG);
          doc.rect(0, 0, pageWidth, pageHeight, 'F');
          addHeader(doc, pageWidth);
          yPos = 48;
        }

        addBadge(doc, badge, margin + col * (badgeWidth + 5), yPos, badgeWidth);
      });
    }

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(doc, pageWidth, pageHeight, i, totalPages);
    }

    doc.save(`${fileName}-${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};