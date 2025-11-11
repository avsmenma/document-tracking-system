import { Document } from '../types';

const STORAGE_KEY = 'document-tracking-data';

export interface StorageData {
  documents: Document[];
  nextDocumentNumber: number;
}

export const LocalStorageService = {
  // Get all data from localStorage
  getData(): StorageData {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }

    // Return default data if nothing found
    return {
      documents: [],
      nextDocumentNumber: 1
    };
  },

  // Save all data to localStorage
  saveData(data: StorageData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Get all documents
  getDocuments(): Document[] {
    return this.getData().documents;
  },

  // Add a new document
  addDocument(documentData: Omit<Document, 'docId'>): Document {
    const data = this.getData();
    const newDocument: Document = {
      ...documentData,
      docId: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    data.documents.push(newDocument);
    data.nextDocumentNumber += 1;

    this.saveData(data);
    return newDocument;
  },

  // Get next document number
  getNextDocumentNumber(): string {
    const data = this.getData();
    return data.nextDocumentNumber.toString().padStart(4, '0');
  },

  // Update document status
  updateDocumentStatus(docId: string, newStatus: string, catatan?: string, olehUser?: string): boolean {
    const data = this.getData();
    const documentIndex = data.documents.findIndex(doc => doc.docId === docId);

    if (documentIndex === -1) return false;

    data.documents[documentIndex].statusSaatIni = newStatus as any;

    // Add to process history
    if (olehUser) {
      data.documents[documentIndex].riwayatProses.push({
        timestamp: new Date(),
        status: newStatus,
        olehUser,
        catatan
      });
    }

    this.saveData(data);
    return true;
  },

  // Get documents by status
  getDocumentsByStatus(status: string): Document[] {
    return this.getDocuments().filter(doc => doc.statusSaatIni === status);
  },

  // Get documents by creator
  getDocumentsByCreator(creator: string): Document[] {
    return this.getDocuments().filter(doc => doc.pembuatDokumen === creator);
  },

  // Clear all data (for testing)
  clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};