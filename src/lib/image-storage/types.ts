export type StoredImage = {
  url: string;
};

export type ImageStorageBackend = {
  id: string;
  store(bytes: Buffer, contentType: string, filename: string): Promise<StoredImage>;
};
