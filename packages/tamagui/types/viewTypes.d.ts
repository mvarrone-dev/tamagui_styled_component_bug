import { TextStyle, ViewStyle } from 'react-native';
export type ShorthandViewStyleProps = {
    w?: ViewStyle['width'];
    h?: ViewStyle['height'];
    p?: ViewStyle['padding'];
    pt?: ViewStyle['paddingTop'];
    pb?: ViewStyle['paddingBottom'];
    pl?: ViewStyle['paddingLeft'];
    pr?: ViewStyle['paddingRight'];
    px?: ViewStyle['paddingHorizontal'];
    py?: ViewStyle['paddingVertical'];
    m?: ViewStyle['margin'];
    mt?: ViewStyle['marginTop'];
    mb?: ViewStyle['marginBottom'];
    ml?: ViewStyle['marginLeft'];
    mr?: ViewStyle['marginRight'];
    mx?: ViewStyle['marginHorizontal'];
    my?: ViewStyle['marginVertical'];
    f?: ViewStyle['flex'];
    fd?: ViewStyle['flexDirection'];
    fw?: ViewStyle['flexWrap'];
    fg?: ViewStyle['flexGrow'];
    fs?: ViewStyle['flexShrink'];
    fb?: ViewStyle['flexBasis'];
    ai?: ViewStyle['alignItems'];
    ac?: ViewStyle['alignContent'];
    jc?: ViewStyle['justifyContent'];
    als?: ViewStyle['alignSelf'];
    bc?: ViewStyle['backgroundColor'];
    br?: ViewStyle['borderRadius'];
    btrr?: ViewStyle['borderTopRightRadius'];
    bbrr?: ViewStyle['borderBottomRightRadius'];
    bblr?: ViewStyle['borderBottomLeftRadius'];
    btlr?: ViewStyle['borderTopLeftRadius'];
    pe?: 'box-none' | 'none' | 'box-only' | 'auto';
    zi?: ViewStyle['zIndex'];
};
export type ShorthandTextStyleProps = ShorthandViewStyleProps & {
    ta?: TextStyle['textAlign'];
    fs?: TextStyle['fontSize'];
    lh?: TextStyle['lineHeight'];
};
//# sourceMappingURL=viewTypes.d.ts.map