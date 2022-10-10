type ColumnDecorator = (object: Object, propertyName: string) => void
type FilterSource = { value: number; label: string }

type Options = {
  key: string
}

export interface Type<T = any> extends Function {
  new (...args: any[]): T
}

export interface RenderOptions {
  render?: (record: any, index?: number) => JSX.Element
}

export interface ColumnOptions extends RenderOptions {
  key: string
  title: string | React.ReactNode
  className?: string
  responsive?: string[]
  align?: string
  sort?: boolean
  dataIndex?: string
}

export type Translate = (key?: string) => string
export interface BaseOptions {
  key?: string
  title?: string
  className?: string
  width?: string | number
  sort?: boolean
  align?: 'left' | 'center' | 'right'
  render?: (record: any, index?: number) => JSX.Element
}

const _metaColumns = new Map<string, unknown>()

function addTableMetadata(target: object, key: string, value: object) {
  const metaKey = `${target.constructor.name}-${key}`
  _metaColumns.set(metaKey, Object.assign(value, _metaColumns.get(metaKey)))
}

export function getTableMetadata() {
  return _metaColumns
}

export function Column(options: BaseOptions = {}): ColumnDecorator {
  return function (object: Object, propertyName: string) {
    addTableMetadata(object, propertyName, { ...options, key: propertyName })
  }
}

export function getMetadataColumns(options: Options): BaseOptions[] {
  const { key } = options
  const columns: object[] = []
  getTableMetadata().forEach((col: unknown, metakey: string) => {
    const value = col as ColumnOptions

    if (`${key}-${value.key}` === metakey) {
      columns.push(value)
    }
  })
  return columns as BaseOptions[]
}

export type ListHeaderProps = {
  id: string
  title?: string
  search?: boolean
  sort?: string[]
  extraHeader?: React.ReactNode
}
