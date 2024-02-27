/**
 * 区切り文字の後に続く数字を返す
 * @param name 区切り文字と数字を終端に含む文字列
 * @param delimiter 区切り文字
 * @returns 区切り文字の後に続く数字, 区切り文字が存在しない場合は0を返す
 */
export const getSuffixNumber = (name: string, delimiter: string): number => {
    const lastIndex = name.lastIndexOf(delimiter);
    if (lastIndex >= 0 && lastIndex < name.length - 1) {
      return parseInt(name.slice(lastIndex + delimiter.length ));
    }
    return 0;
  };
  
/**
 * 与えられた文字列の配列から、区切り文字の後に続く数字のうち、最大のものを返す
 * @param names 区切り文字の後に続く数字を返す
 * @param delimiter 区切り文字
 */
export const getMaxSuffixNumber = (names: string[], delimiter: string): number => {
  return Math.max(...names.map((name) => getSuffixNumber(name, delimiter)));
};

/**
 * 「#数字」を含む文字列の配列から、次の数字の名前を生成する
 * @param names 「#数字」を含む文字列の配列
 * @param delimiter 接頭文字列+区切り文字
 * @returns MapTiler 窃盗文字列+#+次の数値
 */
export const generateNewName = (names: string[], delimiter: string): string => {
  const maxSuffixNumber = (names.length === 0) ? 0 : getMaxSuffixNumber(names, delimiter);
  return `${delimiter}${maxSuffixNumber + 1}`;
};