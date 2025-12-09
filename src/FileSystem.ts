/**
 * ==============================
 * File System
 * ==============================
 */

import { Request, RequestOptions } from './Request';

export type FileReadType = 'text' | 'base64' | 'buffer' | 'binary';

/**
 * Return type mapping for file read operations
 */
export interface FileReadResult {
  text: string;
  base64: string;
  buffer: ArrayBuffer;
  binary: string;
}

/**
 * A utility wrapper for File/Blob operations
 */
export class FileSystem {

  /**
   * Read a file from a remote URL.
   *
   * @param url - The URL to fetch
   * @param type - The format to return ('text', 'base64', 'buffer', 'binary')
   * @param options - Request options
   */
  static async readRemote<T extends FileReadType>(
    url: string,
    type: T = 'base64' as T,
    options: RequestOptions = {}
  ): Promise<FileReadResult[T]> {
    const blob = await Request.blob(url, {}, options);
    return FileSystem.read(blob, type);
  }

  /**
   * Read a local File or Blob.
   *
   * @param file - The File or Blob to read
   * @param type - The format to return
   */
  static async read<T extends FileReadType>(file: File | Blob, type: T = 'text' as T): Promise<FileReadResult[T]> {
    switch (type) {
      case 'text':
        return file.text() as Promise<FileReadResult[T]>;

      case 'buffer':
        return file.arrayBuffer() as Promise<FileReadResult[T]>;

      case 'base64':
        return new Promise<FileReadResult[T]>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as FileReadResult[T]);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });

      case 'binary':
        return new Promise<FileReadResult[T]>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const buffer = reader.result as ArrayBuffer;
            let binary = '';
            const bytes = new Uint8Array(buffer);
            const length = bytes.byteLength;
            for (let i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            resolve(binary as FileReadResult[T]);
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsArrayBuffer(file);
        });

      default: {
        const exhaustiveCheck: never = type;
        throw new Error(`FileSystem.read: Unknown type ${exhaustiveCheck}`);
      }
    }
  }

  /**
   * Create a File object.
   * This is a synchronous operation.
   *
   * @param name - Filename
   * @param content - Data (String, Blob, ArrayBuffer)
   * @param mimeType - MIME type (e.g. 'application/json')
   */
  static create(name: string, content: BlobPart, mimeType: string = 'text/plain'): File {
    return new File([content], name, { type: mimeType });
  }

  /**
   * Trigger a browser download for a specific File or Blob.
   * This will creates a temporary anchor tag to force the download.
   *
   * @param file - The file to download
   * @param name - Optional rename for the downloaded file
   */
  static download(file: File | Blob, name?: string): void {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');

    a.href = url;

    // Determine filename: use provided name, or File.name if available, or fallback
    let filename: string;
    if (name !== undefined && name !== '') {
      filename = name;
    } else if (file instanceof File && file.name !== '') {
      filename = file.name;
    } else {
      filename = 'download';
    }

    a.download = filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Get the file extension safely
   *
   * @param name - Filename or path
   * @returns Lowercase extension without the dot, or empty string
   */
  static extension(name: string, allowHiddenFiles: boolean = false): string {
    const parts = name.split('.');

    // No extension: "file" or hidden file ".gitignore"
    if (parts.length === 1 || (parts[0] === '' && parts.length === 2 && !allowHiddenFiles)) {
      return '';
    }

    return parts.pop()?.toLowerCase() ?? '';
  }

  /**
   * Check if a file is an image based on extension.
   *
   * @param name - Filename to check
   */
  static isImage(name: string): boolean {
    const ext = FileSystem.extension(name);
    const valid = new Set([
      'jpg', 'jpeg', 'png', 'gif', 'svg',
      'webp', 'avif', 'bmp', 'ico', 'tiff', 'heic'
    ]);
    return valid.has(ext);
  }

  /**
   * Check if a file is a video based on extension.
   *
   * @param name - Filename to check
   */
  static isVideo(name: string): boolean {
    const ext = FileSystem.extension(name);
    const valid = new Set([
      'mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'm4v'
    ]);
    return valid.has(ext);
  }

  /**
   * Check if a file is audio based on extension.
   *
   * @param name - Filename to check
   */
  static isAudio(name: string): boolean {
    const ext = FileSystem.extension(name);
    const valid = new Set([
      'mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'
    ]);
    return valid.has(ext);
  }

  /**
   * Convert bytes to human-readable size.
   *
   * @param bytes - Size in bytes
   * @param decimals - Number of decimal places
   */
  static humanSize(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  }
}
