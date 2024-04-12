import {DocumentFileType} from "../model/document-file-type";
import * as pdfjsLib from 'pdfjs-dist';
import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
export {pdfjsLib};
export const fileTypeHeaders = {
  "89504e47": DocumentFileType.PNG,
  "ffd8ffdb": DocumentFileType.JPEG,
  "ffd8ffe0": DocumentFileType.JPEG,
  "ffd8ffe1": DocumentFileType.JPEG,
  "ffd8ffe2": DocumentFileType.JPEG,
  "ffd8ffe3": DocumentFileType.JPEG,
  "ffd8ffe8": DocumentFileType.JPEG,
  "25504446": DocumentFileType.PDF,
  "4d4d002a": DocumentFileType.TIFF,
  "49492a00": DocumentFileType.TIFF,
  "49492a0": DocumentFileType.TIFF,
};


export const getFileHeader = (file: File): Promise<string> => {
  return new Promise(resolve => {
    const headerBytes = file.slice(0, 4);
    const fileReader = new FileReader();
    fileReader.onloadend = (e: ProgressEvent<FileReader>) => {
      const arr = new Uint8Array(e?.target?.result as ArrayBufferLike).subarray(
        0,
        4,
      );
      let header = '';
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      resolve(header);
    };
    fileReader.readAsArrayBuffer(headerBytes);
  });
};

export function checkPDFPasswordProtection(file: File): Promise<boolean> {
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);

  return new Promise<boolean>((resolve, reject) => {
    fileReader.onload = async () => {
      try {
        const pdfData = new Uint8Array(fileReader.result as ArrayBuffer);
        const loadingTask = pdfjsLib.getDocument({data: pdfData});
        await loadingTask.promise;
        resolve(false); // Password was correct, so not password protected
      } catch (error: any) {
        if (error?.name === 'PasswordException') {
          resolve(true); // Password was incorrect, so password protected
        } else {
          reject(error); // Other error occurred
        }
      }
    }
  });
}

export function checkFilePasswordProtection(file: File): Promise<boolean> {
  return file.text()
    .then((text: string): boolean => !!text && text.includes("Encrypt"));
}

export function calculatePDFPages(pdfFile: string, password?: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const loadingTask = pdfjsLib.getDocument({url: pdfFile, password: password});

    loadingTask.promise
      .then(pdfDocument => {
        const numPages = pdfDocument.numPages;
        resolve(numPages);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export async function PDFtoIMG(url, pageNumber: number, password: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer(), () => {
      return null;
    });
    if (!existingPdfBytes) {
      reject("Failed to open the pdf file");
      return null;
    }
    const fileArray = new Uint8Array(existingPdfBytes);
    const doc = await pdfjsLib.getDocument({
      password: password ? password : null,
      data: fileArray,
      useSystemFonts: true,
    }).promise

    const page = await doc.getPage(pageNumber)
    const viewport = page.getViewport({scale: 5})
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const task = page.render({canvasContext: ctx, viewport: viewport})
    task.promise.then(() => {
      resolve(canvas.toDataURL('image/png'));
    });
  }).catch(e => {
    throw e;
  })
}
