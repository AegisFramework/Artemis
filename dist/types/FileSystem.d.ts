/**
 * ==============================
 * File System
 * ==============================
 */
import { RequestOptions } from './Request';
/**
 * File read type options
 */
export type FileReadType = 'text' | 'base64' | 'buffer';
/**
 * File read result type based on read type
 */
export interface FileReadResult {
    event: ProgressEvent<FileReader>;
    content: string | ArrayBuffer | null;
}
/**
 * A simple class wrapper for the File and FileReader web API, while this class
 * doesn't actually provide access to the host file system, it does provide useful
 * utilities for form file inputs and remote content loading.
 */
export declare class FileSystem {
    /**
     * Read a file from a remote location given a URL. This function will fetch
     * the file blob using the Request class and then use the read() function
     * to read the blob in the format required.
     *
     * @param url - URL to fetch the file from
     * @param type - Type of data to be read, values can be 'text', 'base64' and 'buffer'
     * @param props - Props to send to the Request object
     * @returns Content of the file. The format depends on the type parameter used.
     */
    static readRemote(url: string, type?: FileReadType, props?: RequestOptions): Promise<FileReadResult>;
    /**
     * Read a given File or Blob object.
     *
     * @param file - File to read
     * @param type - Type of data to be read, values can be 'text', 'base64' and 'buffer'
     * @returns Promise that resolves to the load event and content of the file
     */
    static read(file: File | Blob, type?: FileReadType): Promise<FileReadResult>;
    /**
     * Create a new File, this uses the File API and will not actually create
     * a file in the user's file system, however using it with other features,
     * that may be possible
     *
     * @param name - Name of the file (Including extension)
     * @param content - Content to save in the file
     * @param type - Mime Type for the file
     * @returns Promise resolving to the created File
     */
    static create(name: string, content: BlobPart, type?: string): Promise<File>;
    /**
     * Returns the extension of a file given its file name.
     *
     * @param name - Name or full path of the file
     * @returns File extension without the leading dot (.)
     */
    static extension(name: string): string;
    /**
     * Check if a file is an image by its extension.
     *
     * @param name - Name or full path of the file
     * @returns Whether the file is an image
     */
    static isImage(name: string): boolean;
}
//# sourceMappingURL=FileSystem.d.ts.map