import jsPDF from 'jspdf';

export const exportToPDF = async (messages, sessionDate) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    pdf.setFontSize(18);
    pdf.text('AI Shine Chat', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.text(`Date: ${sessionDate}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    messages.forEach((msg) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text(msg.role === 'human' ? 'You:' : 'AI Shine:', 15, yPosition);
      yPosition += 7;

      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(10);
      
      const content = typeof msg.content === 'string' 
        ? msg.content.replace(/<[^>]*>/g, '') 
        : msg.content.answer?.replace(/<[^>]*>/g, '') || '';
      
      const lines = pdf.splitTextToSize(content, pageWidth - 30);
      lines.forEach(line => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, 15, yPosition);
        yPosition += 5;
      });

      yPosition += 10;
    });

    pdf.save(`AI-Shine-Chat-${sessionDate}.pdf`);
    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
};

export const exportToMarkdown = (messages, sessionDate) => {
  let markdown = `# AI Shine Chat\n**Date:** ${sessionDate}\n\n---\n\n`;
  
  messages.forEach((msg) => {
    const role = msg.role === 'human' ? '**You:**' : '**AI Shine:**';
    const content = typeof msg.content === 'string' 
      ? msg.content.replace(/<[^>]*>/g, '') 
      : msg.content.answer?.replace(/<[^>]*>/g, '') || '';
    
    markdown += `${role}\n${content}\n\n---\n\n`;
  });
  
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AI-Shine-Chat-${sessionDate}.md`;
  a.click();
  URL.revokeObjectURL(url);
};