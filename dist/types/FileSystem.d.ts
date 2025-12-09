/**
 * ==============================
 * File System
 * ==============================
 */
import { RequestOptions } from './Request';
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
export declare class FileSystem {
    /**
     * Read a file from a remote URL.
     *
     * @param url - The URL to fetch
     * @param type - The format to return ('text', 'base64', 'buffer', 'binary')
     * @param options - Request options
     */
    static readRemote<T extends FileReadType>(url: string, type?: T, options?: RequestOptions): Promise<FileReadResult[T]>;
    /**
     * Read a local File or Blob.
     *
     * @param file - The File or Blob to read
     * @param type - The format to return
     */
    static read<T extends FileReadType>(file: File | Blob, type?: T): Promise<FileReadResult[T]>;
    /**
     * Create a File object.
     * This is a synchronous operation.
     *
     * @param name - Filename
     * @param content - Data (String, Blob, ArrayBuffer)
     * @param mimeType - MIME type (e.g. 'application/json')
     */
    static create(name: string, content: BlobPart, mimeType?: string): File;
    /**
     * Trigger a browser download for a specific File or Blob.
     * This will creates a temporary anchor tag to force the download.
     *
     * @param file - The file to download
     * @param name - Optional rename for the downloaded file
     */
    static download(file: File | Blob, name?: string): void;
    /**
     * Get the file extension safely
     *
     * @param name - Filename or path
     * @returns Lowercase extension without the dot, or empty string
     */
    static extension(name: string, allowHiddenFiles?: boolean): string;
    /**
     * Check if a file is an image based on extension.
     *
     * @param name - Filename to check
     */
    static isImage(name: string): boolean;
    /**
     * Check if a file is a video based on extension.
     *
     * @param name - Filename to check
     */
    static isVideo(name: string): boolean;
    /**
     * Check if a file is audio based on extension.
     *
     * @param name - Filename to check
     */
    static isAudio(name: string): boolean;
    /**
     * Convert bytes to human-readable size.
     *
     * @param bytes - Size in bytes
     * @param decimals - Number of decimal places
     */
    static humanSize(bytes: number, decimals?: number): string;
}
//# sourceMappingURL=FileSystem.d.ts.map