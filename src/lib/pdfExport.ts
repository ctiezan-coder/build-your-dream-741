import { jsPDF } from 'jspdf';
import type { Product, ExportParams, CostBreakdown } from '@/types/simulation';
import { INCOTERM_INFO, CURRENCIES, TRANSPORT_MODES } from '@/types/simulation';
import { COUNTRIES } from '@/lib/countries';
import { formatCurrency, getTotalByIncoterm } from '@/lib/calculator';

interface ExportPDFParams {
  product: Product;
  params: ExportParams;
  breakdown: CostBreakdown;
}

export function generateSimulationPDF({ product, params, breakdown }: ExportPDFParams): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  
  const origin = COUNTRIES.find(c => c.code === params.originCountry);
  const dest = COUNTRIES.find(c => c.code === params.destinationCountry);
  const finalTotal = getTotalByIncoterm(breakdown, params.incoterm);
  const incotermLevel = INCOTERM_INFO[params.incoterm].level;
  const currency = params.outputCurrency;
  
  let y = margin;
  
  // Helper functions
  const addTitle = (text: string, size: number = 16) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 48, 73); // Primary color
    doc.text(text, margin, y);
    y += size * 0.5;
  };
  
  const addSubtitle = (text: string) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(text, margin, y);
    y += 6;
  };
  
  const addLine = (label: string, value: string, isBold: boolean = false) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(isBold ? 0 : 60, isBold ? 48 : 60, isBold ? 73 : 60);
    doc.text(label, margin, y);
    doc.text(value, pageWidth - margin, y, { align: 'right' });
    y += 6;
  };
  
  const addSectionHeader = (title: string, subtitle: string, color: [number, number, number]) => {
    doc.setFillColor(...color);
    doc.roundedRect(margin, y - 4, contentWidth, 14, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(title, margin + 4, y + 5);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, pageWidth - margin - 4, y + 5, { align: 'right' });
    y += 16;
  };
  
  const addSeparator = () => {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;
  };
  
  // Header
  addTitle('ACIEXSimul', 20);
  addSubtitle('Simulation des coûts à l\'exportation');
  y += 4;
  
  // Date
  const now = new Date();
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Généré le ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR')}`, margin, y);
  y += 10;
  
  addSeparator();
  y += 4;
  
  // Product Information
  addTitle('Informations Produit', 12);
  y += 4;
  addLine('Désignation', product.name);
  addLine('Code SH', product.hsCode || 'Non spécifié');
  addLine('Quantité', `${params.quantity} unité${params.quantity > 1 ? 's' : ''}`);
  addLine('Poids net', `${product.netWeightKg} kg`);
  addLine('Poids brut', `${product.grossWeightKg} kg`);
  addLine('Volume', `${product.volumeM3} m³`);
  addLine('Valeur unitaire', formatCurrency(product.unitValue, product.currency));
  y += 4;
  
  addSeparator();
  y += 4;
  
  // Export Parameters
  addTitle('Paramètres d\'export', 12);
  y += 4;
  addLine('Origine', `${origin?.flag || ''} ${origin?.name || params.originCountry}`);
  addLine('Destination', `${dest?.flag || ''} ${dest?.name || params.destinationCountry}`);
  addLine('Incoterm', `${params.incoterm} - ${INCOTERM_INFO[params.incoterm].name}`);
  addLine('Mode de transport', TRANSPORT_MODES[params.transportMode].name);
  addLine('Devise de sortie', `${currency} (${CURRENCIES[currency].name})`);
  addLine('Taux de marge', `${(params.marginRate * 100).toFixed(1)}%`);
  addLine('Taux d\'assurance', `${(params.insuranceRate * 100).toFixed(2)}%`);
  addLine('Poids taxable', `${breakdown.chargeableWeight.toFixed(2)} kg`);
  y += 6;
  
  addSeparator();
  y += 4;
  
  // Cost Breakdown
  addTitle('Décomposition des coûts', 12);
  y += 6;
  
  // Level 1: EXW
  const exwColor: [number, number, number] = incotermLevel >= 1 ? [59, 130, 246] : [180, 180, 180]; // Blue
  addSectionHeader('Niveau 1: EXW', 'Ex-Works (Départ usine)', exwColor);
  addLine('Prix de revient', formatCurrency(breakdown.productionCost, currency));
  addLine('Emballage export', formatCurrency(breakdown.packagingCost, currency));
  addLine(`Marge (${(params.marginRate * 100).toFixed(0)}%)`, formatCurrency(breakdown.margin, currency));
  addLine('Sous-total EXW', formatCurrency(breakdown.exwTotal, currency), true);
  y += 4;
  
  // Level 2: FOB
  const fobColor: [number, number, number] = incotermLevel >= 2 ? [16, 185, 129] : [180, 180, 180]; // Green
  addSectionHeader('Niveau 2: FOB', 'Pré-acheminement', fobColor);
  addLine('Transport local', formatCurrency(breakdown.localTransport, currency));
  addLine('Manutention', formatCurrency(breakdown.handling, currency));
  addLine('Douane export', formatCurrency(breakdown.exportCustoms, currency));
  addLine('Sous-total FOB', formatCurrency(breakdown.fobTotal, currency), true);
  y += 4;
  
  // Level 3: CIF
  const cifColor: [number, number, number] = incotermLevel >= 3 ? [245, 158, 11] : [180, 180, 180]; // Amber
  addSectionHeader('Niveau 3: CIF', 'Fret et assurance', cifColor);
  addLine('Fret', formatCurrency(breakdown.freight, currency));
  addLine(`Assurance (${(params.insuranceRate * 100).toFixed(2)}%)`, formatCurrency(breakdown.insurance, currency));
  addLine('Sous-total CIF', formatCurrency(breakdown.cifTotal, currency), true);
  y += 4;
  
  // Level 4: DDP
  const ddpColor: [number, number, number] = incotermLevel >= 4 ? [239, 68, 68] : [180, 180, 180]; // Red
  addSectionHeader('Niveau 4: DDP', 'Droits et livraison', ddpColor);
  addLine('Droits de douane', formatCurrency(breakdown.customsDuty, currency));
  addLine('TVA import', formatCurrency(breakdown.importVat, currency));
  addLine('Livraison finale', formatCurrency(breakdown.finalDelivery, currency));
  addLine('Sous-total DDP', formatCurrency(breakdown.ddpTotal, currency), true);
  y += 8;
  
  // Final Total
  doc.setFillColor(0, 48, 73);
  doc.roundedRect(margin, y - 4, contentWidth, 18, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`COÛT TOTAL ${params.incoterm}`, margin + 6, y + 7);
  doc.setFontSize(14);
  doc.text(formatCurrency(finalTotal, currency), pageWidth - margin - 6, y + 7, { align: 'right' });
  y += 24;
  
  // Disclaimer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120, 120, 120);
  const disclaimer = 'Cette simulation est indicative. Les coûts réels peuvent varier selon les conditions du marché, les transitaires et les accords commerciaux en vigueur.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);
  doc.text(disclaimerLines, margin, y);
  y += disclaimerLines.length * 4 + 6;
  
  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 48, 73);
  doc.text('ACIEXSimul - Incoterms® 2026', margin, doc.internal.pageSize.getHeight() - 10);
  doc.text('www.aciexsimul.com', pageWidth - margin, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
  
  // Save the PDF
  const filename = `ACIEXSimul_${product.name.replace(/\s+/g, '_')}_${params.incoterm}_${now.toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
