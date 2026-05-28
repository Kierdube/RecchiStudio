/** Site copy keys that store a single image URL or site path. */
export function isSiteCopyImageKey(key: string): boolean {
  return /\.image_url$/.test(key);
}
