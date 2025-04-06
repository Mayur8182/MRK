declare module 'pdfkit' {
  import { Readable } from 'stream';
  
  namespace PDFDocument {
    interface PDFDocumentOptions {
      size?: string | [number, number];
      margins?: { top: number; bottom: number; left: number; right: number };
      info?: { title?: string; author?: string; subject?: string; keywords?: string; creator?: string; producer?: string; creationDate?: Date; modDate?: Date };
      bufferPages?: boolean;
      permissions?: { printing?: string; modifying?: boolean; copying?: boolean; annotating?: boolean; fillingForms?: boolean; contentAccessibility?: boolean; documentAssembly?: boolean };
      autoFirstPage?: boolean;
      layout?: 'portrait' | 'landscape';
      pdfVersion?: string;
      compress?: boolean;
      userPassword?: string;
      ownerPassword?: string;
      encrypt?: 'rc4' | 'aes' | string;
      keyBits?: number;
      font?: string;
    }
    
    interface PDFDocument {
      page: {
        width: number;
        height: number;
      };
      addPage(options?: { size?: string | [number, number]; margins?: { top: number; bottom: number; left: number; right: number }; layout?: 'portrait' | 'landscape' }): PDFDocument;
      x: number;
      y: number;
      fontSize(size: number): PDFDocument;
      font(name: string, size?: number): PDFDocument;
      text(text: string, x?: number, y?: number, options?: { width?: number; height?: number; align?: 'left' | 'center' | 'right' | 'justify'; underline?: boolean; strike?: boolean; continued?: boolean; ellipsis?: boolean | string; paragraphGap?: number }): PDFDocument;
      fillColor(color: string, opacity?: number): PDFDocument;
      strokeColor(color: string, opacity?: number): PDFDocument;
      lineWidth(width: number): PDFDocument;
      rect(x: number, y: number, width: number, height: number): PDFDocument;
      ellipse(x: number, y: number, radiusX: number, radiusY?: number): PDFDocument;
      circle(x: number, y: number, radius: number): PDFDocument;
      polygon(...points: Array<number>): PDFDocument;
      fill(rule?: string): PDFDocument;
      stroke(): PDFDocument;
      fillAndStroke(): PDFDocument;
      lineCap(style: string): PDFDocument;
      lineJoin(style: string): PDFDocument;
      miterLimit(limit: number): PDFDocument;
      dash(length: number, options?: { space?: number, phase?: number }): PDFDocument;
      undash(): PDFDocument;
      moveTo(x: number, y: number): PDFDocument;
      lineTo(x: number, y: number): PDFDocument;
      bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): PDFDocument;
      quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): PDFDocument;
      closePath(): PDFDocument;
      clip(rule?: string): PDFDocument;
      save(): PDFDocument;
      restore(): PDFDocument;
      rotate(angle: number, options?: { origin?: [number, number] }): PDFDocument;
      scale(xFactor: number, yFactor?: number, options?: { origin?: [number, number] }): PDFDocument;
      translate(x: number, y: number): PDFDocument;
      transform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): PDFDocument;
      path(path: string): PDFDocument;
      end(): void;
      pipe(destination: NodeJS.WritableStream): PDFDocument;
      image(src: string | Buffer, x?: number, y?: number, options?: { width?: number; height?: number; scale?: number; fit?: [number, number] }): PDFDocument;
      addContent(content: string): PDFDocument;
      moveDown(lines?: number): PDFDocument;
      moveUp(lines?: number): PDFDocument;
    }
  }
  
  class PDFDocument extends Readable implements PDFDocument.PDFDocument {
    constructor(options?: PDFDocument.PDFDocumentOptions);
    
    page: {
      width: number;
      height: number;
    };
    
    addPage(options?: { size?: string | [number, number]; margins?: { top: number; bottom: number; left: number; right: number }; layout?: 'portrait' | 'landscape' }): this;
    fontSize(size: number): this;
    font(name: string, size?: number): this;
    text(text: string, x?: number, y?: number, options?: { width?: number; height?: number; align?: 'left' | 'center' | 'right' | 'justify'; underline?: boolean; strike?: boolean; continued?: boolean; ellipsis?: boolean | string; paragraphGap?: number }): this;
    fillColor(color: string, opacity?: number): this;
    strokeColor(color: string, opacity?: number): this;
    lineWidth(width: number): this;
    rect(x: number, y: number, width: number, height: number): this;
    ellipse(x: number, y: number, radiusX: number, radiusY?: number): this;
    circle(x: number, y: number, radius: number): this;
    polygon(...points: Array<number>): this;
    fill(rule?: string): this;
    stroke(): this;
    fillAndStroke(): this;
    lineCap(style: string): this;
    lineJoin(style: string): this;
    miterLimit(limit: number): this;
    dash(length: number, options?: { space?: number, phase?: number }): this;
    undash(): this;
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): this;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): this;
    closePath(): this;
    clip(rule?: string): this;
    save(): this;
    restore(): this;
    rotate(angle: number, options?: { origin?: [number, number] }): this;
    scale(xFactor: number, yFactor?: number, options?: { origin?: [number, number] }): this;
    translate(x: number, y: number): this;
    transform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): this;
    path(path: string): this;
    end(): void;
    pipe(destination: NodeJS.WritableStream): this;
    image(src: string | Buffer, x?: number, y?: number, options?: { width?: number; height?: number; scale?: number; fit?: [number, number] }): this;
    addContent(content: string): this;
    moveDown(lines?: number): this;
    moveUp(lines?: number): this;
    x: number;
    y: number;
  }
  
  export = PDFDocument;
}