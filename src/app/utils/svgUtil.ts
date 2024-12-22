export function addXmlnsToSvg(svgString: string) {
  // SVGデータがxmlns属性を既に含んでいるかを確認
  if (!/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(svgString)) {
    // xmlns属性を追加
    svgString = svgString.replace(
      '<svg',
      '<svg xmlns="http://www.w3.org/2000/svg"'
    );
  }
  return svgString;
}
