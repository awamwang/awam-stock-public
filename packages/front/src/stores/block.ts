import { IDataObjectList } from '@awamstock/shared/type'
import { IBlockDay, IBlock, BlockFrom, IStockPool, IMoodBlockStock, IRadar } from '@awamstock/model'
import { BlockFromList } from '@awamstock/model/types'

export interface IDingPanStore {
  blocks: IBlock[]
  blockIndexMap: Record<string, IBlock>
  blockDays: IBlockDay[]
  blockDayIndexMap: Record<string, IBlockDay>
}

export const useBlockStore = defineStore('block', {
  state: (): IDingPanStore => ({
    blocks: [],
    blockIndexMap: {},
    blockDays: [],
    blockDayIndexMap: {},
  }),
  getters: {
    classifiedBlocks: (state) => _.groupBy(state.blocks, 'from') as Record<BlockFrom, IBlock[]>,
    getLongTouBlocksByCode(): (code?: string) => IBlock[] {
      return (code?: string): IBlock[] => (code && this.classifiedBlocks['long-tou']?.filter((block: IBlock) => block.codeList.includes(code))) || []
    },
  },
  actions: {
    setBlocks(data: IDataObjectList<IBlock>) {
      this.blockIndexMap = (this.blocks = data.data).reduce((map, block) => ({ ...map, [block.code]: block }), {})
      useGlobalStore().setStrNameMap('block', data.strNameMap)
    },
    setBlockDays(data: IDataObjectList<IBlockDay>) {
      this.blockDayIndexMap = (this.blockDays = data.data).reduce((map, block) => ({ ...map, [block.code]: block }), {})
      useGlobalStore().setStrNameMap('blockDay', data.strNameMap)
    },

    getLinkedBlock(block: Partial<IBlock>, from: BlockFrom = 'tdx') {
      if (!block || !block.link || !block.link[from]) return null

      return this.blockIndexMap[block.link[from]] || null
    },
    getBlockDayProp(block: IBlock, prop: keyof IBlockDay) {
      if (!this.blockDayIndexMap[block.code]) return 0

      return this.blockDayIndexMap[block.code][prop] || 0
    },
    getZt(block: IBlock) {
      return this.getBlockDayProp(block, 'zt') as number
    },

    // getBlocksByName(name?: string, from?: BlockFrom): IBlock[] | null {
    //   if (!name) return null
    //   const blocks = from ? this.classifiedBlocks[from] : this.blocks
    //   return blocks?.filter((block: IBlock) => block.name === name) || null
    // },
    // getTdxBlocksByName(name?: string): IBlock | null {
    //   return (name && this.classifiedBlocks['tdx']?.find((block: IBlock) => block.name === name)) || null
    // },
    filterStocksByBlock<T extends IStockPool | IMoodBlockStock | IRadar>(stocks: T[], block?: Partial<IBlock>) {
      if (!block) return stocks

      let blockCode = block.code
      const blockName = block.name
      if (!blockCode && blockName) {
        const block = this.blocks.find((block) => block.name === blockName)
        blockCode = block?.code
      }

      if (!blockCode) return stocks

      return stocks.filter((stock) => {
        if ((stock as IMoodBlockStock).block_code) return (stock as IMoodBlockStock).block_code === blockCode

        const block = this.blockIndexMap[blockCode as string]
        const linkedBlocks = BlockFromList.filter((from) => from !== block?.from).map((from) => this.getLinkedBlock(block, from))
        const includedByLinkedBlock = linkedBlocks.some((block) => block?.codeList.includes(stock.code))
        const blockNames = (stock as IMoodBlockStock).blocks ? (stock as IMoodBlockStock).blocks.split('、') : undefined

        return block?.codeList.includes(stock.code) || includedByLinkedBlock || (blockNames ? blockNames.includes(block.name) || blockNames.includes(blockName || '') : false)
      })
    },
  },
})

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useGlobalStore, import.meta.hot))
// }
