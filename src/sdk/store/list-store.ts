import { default as queryString } from 'query-string'
import { invokeRequest, onUpdateQuery } from 'sdk'
import create, { GetState, SetState } from 'zustand'

export type Data = { page: number; totalRecords: number; data: unknown[] }
type ColumnSort = Map<string, 'asc' | 'desc' | null | string>

interface ListView {
  url?: string
  isFetching?: boolean
  columnSort?: ColumnSort
  data?: Data
}

interface IListViewStore {
  listViewMap?: Map<string, ListView>
  onPageChange: (id: string, page: number) => Promise<void>
  onPageSizeChange: (id: string, size: number) => void
  onColumnSort: (id: string, sortKey: string) => void
  onSearch: (id: string, key: string) => void
  onDelete: (id: string, key: string) => void
  onEdit: (id: string, key: string) => void
  onLoading: (id: string) => void
  onData: (id: string, data: Data, url?: string) => void
  onRefetch: (id: string, page?: number) => void
  onQuery: (id: string, queryString: {}) => void
}

export const useListViewStore = create<IListViewStore>((set, get) => {
  return {
    async onQuery(id, queryString) {
      const listViewMap = onLoading(id, get, set)
      handleFetch(onUpdateQuery(listViewMap.get(id)?.url, queryString), (data) => {
        onData(id, data, listViewMap, set)
      })
    },
    async onPageSizeChange(id, size) {
      const listViewMap = onLoading(id, get, set)
      handleFetch(onUpdateQuery(listViewMap.get(id)?.url, { size, page: 1 }), (data) => {
        onData(id, data, listViewMap, set)
      })
    },

    async onPageChange(id, page) {
      const listViewMap = onLoading(id, get, set)
      handleFetch(onUpdateQuery(listViewMap.get(id)?.url, { page }), (data) => {
        onData(id, data, listViewMap, set)
      })
    },

    async onColumnSort(id, sortKey) {
      const listViewMap = onLoading(id, get, set)
      let columnSort = listViewMap.get(id)?.columnSort
      if (!columnSort || !columnSort.get(sortKey)) {
        columnSort = new Map()
        columnSort.set(sortKey, 'asc')
      } else if (columnSort.get(sortKey) === 'asc') {
        columnSort.set(sortKey, 'desc')
      } else {
        columnSort = undefined
      }
      const sortOrder = columnSort?.get(sortKey)
      listViewMap.set(id, { ...listViewMap.get(id), columnSort })
      handleFetch(
        onUpdateQuery(
          listViewMap.get(id)?.url,
          columnSort ? { sortKey, sortOrder } : { sortKey: undefined, sortOrder: undefined }
        ),
        (data) => {
          onData(id, data, listViewMap, set)
        }
      )
    },
    onSearch(id, key) {
      const listViewMap = onLoading(id, get, set)
      handleFetch(onUpdateQuery(listViewMap.get(id)?.url, { keyword: key }), (data) => {
        onData(id, data, listViewMap, set)
      })
    },
    onEdit(id, key) {
      //TODO handle edit
    },
    onDelete(id, key) {
      //TODO handle delete
    },
    onRefetch(id, page) {
      const listViewMap = onLoading(id, get, set)
      handleFetch(onUpdateQuery(listViewMap.get(id)?.url, page && { page: page }), (data) => {
        onData(id, data, listViewMap, set)
      })
    },
    onData(id, data, url) {
      const listViewMap = getListViewMap(get)
      listViewMap.set(id, { ...listViewMap.get(id), isFetching: false, data, url })
      set({ listViewMap })
    },
    onLoading(id) {
      onLoading(id, get, set)
    }
  }
})

const onLoading = (id: string, get: GetState<IListViewStore>, set: SetState<IListViewStore>) => {
  const listViewMap = getListViewMap(get)
  const query = queryString.parse(location.search)
  const columnSort: ColumnSort = new Map()
  if (query) {
    columnSort.set(query.sortKey as string, query.sortOrder as string)
  }
  listViewMap.set(id, { ...listViewMap.get(id), columnSort, isFetching: true })
  set({ listViewMap })
  return listViewMap
}

const onData = (id: string, data: Data, listViewMap: Map<string, ListView>, set: SetState<IListViewStore>) => {
  listViewMap.set(id, { ...listViewMap.get(id), isFetching: false, data })
  set({ listViewMap })
}

const getListViewMap = (get: GetState<IListViewStore>) => {
  let listViewMap = get().listViewMap
  if (!listViewMap) listViewMap = new Map()
  return listViewMap
}

export const handleFetch = async (url: string, onData: (data: Data) => void) => {
  invokeRequest({
    baseURL: url,
    onSuccess(data) {
      onData(data)
      history.pushState({}, '', '?' + url.split('?').pop())
    },
    onError() {
      //TODO show Notification Error
    }
  })
}
