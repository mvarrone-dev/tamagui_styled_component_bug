import { TextStyle, ViewStyle } from 'react-native'

// duplicate of ui-static, we need shared types..

export type StaticConfig = {
  neverFlatten?: boolean
  isText?: boolean
  postProcessStyles?: (styles: { [key: string]: any }) => any
  validStyles?: { [key: string]: boolean }
  defaultProps?: any
  expansionProps?: {
    [key: string]: ViewStyle | TextStyle | ((props: any) => ViewStyle | TextStyle)
  }
}
