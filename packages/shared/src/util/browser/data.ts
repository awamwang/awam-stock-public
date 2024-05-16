import { PlainData, IDataObject, IDataObjectSingle } from '../../type/index'

export function flatListData<T extends PlainData>(dataObject: IDataObject<T>) {
  dataObject.data = dataObject.data || {}

  if (Array.isArray(dataObject.data)) {
    dataObject.data = dataObject.data[0]
  }

  return dataObject as IDataObjectSingle<T>
}
