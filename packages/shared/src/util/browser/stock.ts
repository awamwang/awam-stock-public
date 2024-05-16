//
const ExchangeSymbolMap = {
  SH: /60\d{4}|300\d{3}/,
  sh: /60\d{4}|300\d{3}/,
  SZ: /00\d{4}|300\d{3}/,
  sz: /00\d{4}|300\d{3}/,
  SS: /688\d{3}/,
  ss: /688\d{3}/,
}
const SymbolSuffixRegex = new RegExp(`\\.(${Object.keys(ExchangeSymbolMap).join('|')})$`)

/**
 * 600042.SH -> 600042
 * @param symbol
 * @returns
 */
export function symbolToCode(symbol: string): string {
  return (symbol || '').replace(SymbolSuffixRegex, '')
}

/**
 *
 * @param code
 */
export function codeToSymbol(): string {
  throw new Error('Not implemented')
}

/**
 * {} -> 'xxxx 600000'
 * @param obj
 * @returns
 */
export function stockToCsv(obj: any): string {
  return `${obj.name}, ${obj.code}`
}

// console.log(symbolToCode('600042.SH'));
// console.log(codeToSymbol('600042'));

const StockPositionSort = ['龙一', '龙二', '龙三', '龙四', '龙五', '破板', '龙六', '龙七', '龙八', '龙九', '龙十', '龙十一', '龙十二', '龙十三', '龙十四', '龙十五', '破板', '']
const StockPositionSortReversed = StockPositionSort.reverse()

export function compareStockPosition(a: string, b: string): number {
  return (StockPositionSortReversed.indexOf(a) - StockPositionSortReversed.indexOf(b)) * -1
}

// console.log(['龙三', '定点数', '龙二'].sort((a, b) => compareStockPosition(a, b)))
