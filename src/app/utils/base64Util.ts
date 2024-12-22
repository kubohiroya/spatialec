export function base64Encode(str: string) {
  // Unicode文字列をエンコードするために、まずUTF-8にエンコード
  const utf8Str = new TextEncoder().encode(str);

  // Uint8Arrayを取得し、それをバイナリ文字列に変換
  const binaryStr = String.fromCharCode(...utf8Str);

  // btoa関数を使ってバイナリ文字列をBase64エンコード
  return window.btoa(binaryStr);
}
