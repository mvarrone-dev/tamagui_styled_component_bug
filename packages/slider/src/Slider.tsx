// forked from radix-ui

import { usePrevious } from '@radix-ui/react-use-previous'
import { useComposedRefs } from '@tamagui/compose-refs'
import { getVariantExtras, styled, withStaticProperties } from '@tamagui/core'
import { clamp, composeEventHandlers } from '@tamagui/helpers'
// import { useSize } from '@tamagui/react-use-size'
import { SizableStack, SizableStackProps, YStackProps, getCircleSize } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import { useDirection } from '@tamagui/use-direction'
import * as React from 'react'
import { LayoutRectangle, View } from 'react-native'

import {
  SLIDER_NAME,
  SliderOrientationProvider,
  SliderProvider,
  useSliderContext,
  useSliderOrientationContext,
} from './context'
import {
  convertValueToPercentage,
  getClosestValueIndex,
  getDecimalCount,
  getLabel,
  getNextSortedValues,
  getSize,
  getThumbInBoundsOffset,
  hasMinStepsBetweenValues,
  linearScale,
  roundValue,
} from './helpers'
import { SliderFrame, SliderImpl } from './SliderImpl'
import {
  Direction,
  ScopedProps,
  SliderContextValue,
  SliderHorizontalProps,
  SliderImplElement,
  SliderProps,
  SliderTrackProps,
  SliderVerticalProps,
} from './types'

const PAGE_KEYS = ['PageUp', 'PageDown']
const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
const BACK_KEYS: Record<Direction, string[]> = {
  ltr: ['ArrowDown', 'Home', 'ArrowLeft', 'PageDown'],
  rtl: ['ArrowDown', 'Home', 'ArrowRight', 'PageDown'],
}

/* -------------------------------------------------------------------------------------------------
 * SliderHorizontal
 * -----------------------------------------------------------------------------------------------*/

type SliderHorizontalElement = SliderImplElement

const SliderHorizontal = React.forwardRef<SliderHorizontalElement, SliderHorizontalProps>(
  (props: ScopedProps<SliderHorizontalProps>, forwardedRef) => {
    const { min, max, dir, onSlideStart, onSlideMove, onStepKeyDown, ...sliderProps } = props
    const layoutRef = React.useRef<LayoutRectangle | null>(null)
    const direction = useDirection(dir)
    const isDirectionLTR = direction === 'ltr'
    const [size, setSize] = React.useState(0)

    function getValueFromPointer(pointerPosition: number) {
      const layout = layoutRef.current
      if (!layout) return
      const input: [number, number] = [0, layout.width]
      const output: [number, number] = isDirectionLTR ? [min, max] : [max, min]
      const value = linearScale(input, output)
      return value(pointerPosition - layout.x)
    }

    return (
      <SliderOrientationProvider
        scope={props.__scopeSlider}
        startEdge={isDirectionLTR ? 'left' : 'right'}
        endEdge={isDirectionLTR ? 'right' : 'left'}
        direction={isDirectionLTR ? 1 : -1}
        sizeProp="width"
        size={size}
      >
        <SliderImpl
          dir={direction}
          orientation="horizontal"
          {...sliderProps}
          onLayout={(e) => {
            const layout = e.nativeEvent.layout
            layoutRef.current = layout
            setSize(layout.height)
          }}
          ref={forwardedRef}
          onSlideStart={(event) => {
            const value = getValueFromPointer(event.nativeEvent.pageX)
            if (value) {
              onSlideStart?.(value)
            }
          }}
          onSlideMove={(event) => {
            const value = getValueFromPointer(event.nativeEvent.pageX)
            if (value) {
              onSlideMove?.(value)
            }
          }}
          onSlideEnd={() => {}}
          onStepKeyDown={(event) => {
            const isBackKey = BACK_KEYS[direction].includes(event.key)
            onStepKeyDown?.({ event, direction: isBackKey ? -1 : 1 })
          }}
        />
      </SliderOrientationProvider>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * SliderVertical
 * -----------------------------------------------------------------------------------------------*/

type SliderVerticalElement = SliderImplElement

const SliderVertical = React.forwardRef<SliderVerticalElement, SliderVerticalProps>(
  (props: ScopedProps<SliderVerticalProps>, forwardedRef) => {
    const { min, max, onSlideStart, onSlideMove, onStepKeyDown, ...sliderProps } = props
    const sliderRef = React.useRef<SliderImplElement>(null)
    const ref = useComposedRefs(forwardedRef, sliderRef)
    const rectRef = React.useRef<ClientRect>()

    function getValueFromPointer(pointerPosition: number) {
      // @ts-ignore
      const rect = rectRef.current || sliderRef.current!.getBoundingClientRect()
      const input: [number, number] = [0, rect.height]
      const output: [number, number] = [max, min]
      const value = linearScale(input, output)
      rectRef.current = rect
      return value(pointerPosition - rect.top)
    }

    return (
      <SliderOrientationProvider
        scope={props.__scopeSlider}
        startEdge="bottom"
        endEdge="top"
        sizeProp="height"
        size={0}
        direction={1}
      >
        <SliderImpl
          {...sliderProps}
          orientation="vertical"
          ref={ref}
          onSlideStart={(event) => {
            const value = getValueFromPointer(event.nativeEvent.locationY)
            onSlideStart?.(value)
          }}
          onSlideMove={(event) => {
            const value = getValueFromPointer(event.nativeEvent.locationY)
            onSlideMove?.(value)
          }}
          onSlideEnd={() => (rectRef.current = undefined)}
          onStepKeyDown={(event) => {
            const isBackKey = BACK_KEYS.ltr.includes(event.key)
            onStepKeyDown?.({ event, direction: isBackKey ? -1 : 1 })
          }}
        />
      </SliderOrientationProvider>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * SliderTrack
 * -----------------------------------------------------------------------------------------------*/

const TRACK_NAME = 'SliderTrack'

type SliderTrackElement = HTMLElement | View

const SliderTrackFrame = styled(SliderFrame, {
  name: 'SliderTrackFrame',
})

const SliderTrack = React.forwardRef<SliderTrackElement, SliderTrackProps>(
  (props: ScopedProps<SliderTrackProps>, forwardedRef) => {
    const { __scopeSlider, ...trackProps } = props
    const context = useSliderContext(TRACK_NAME, __scopeSlider)
    return (
      <SliderTrackFrame
        data-disabled={context.disabled ? '' : undefined}
        data-orientation={context.orientation}
        orientation={context.orientation}
        {...trackProps}
        ref={forwardedRef}
      />
    )
  }
)

SliderTrack.displayName = TRACK_NAME

/* -------------------------------------------------------------------------------------------------
 * SliderTrackActive
 * -----------------------------------------------------------------------------------------------*/

const RANGE_NAME = 'SliderTrackActive'

type SliderTrackActiveElement = HTMLElement | View
interface SliderTrackActiveProps extends YStackProps {}

const SliderTrackActiveFrame = styled(SliderFrame, {
  name: 'SliderTrackActive',
})

const SliderTrackActive = React.forwardRef<SliderTrackActiveElement, SliderTrackActiveProps>(
  (props: ScopedProps<SliderTrackActiveProps>, forwardedRef) => {
    const { __scopeSlider, ...rangeProps } = props
    const context = useSliderContext(RANGE_NAME, __scopeSlider)
    const orientation = useSliderOrientationContext(RANGE_NAME, __scopeSlider)
    const ref = React.useRef<HTMLSpanElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)
    const valuesCount = context.values.length
    const percentages = context.values.map((value) =>
      convertValueToPercentage(value, context.min, context.max)
    )
    const offsetStart = valuesCount > 1 ? Math.min(...percentages) : 0
    const offsetEnd = 100 - Math.max(...percentages)

    return (
      <SliderTrackActiveFrame
        orientation={context.orientation}
        data-orientation={context.orientation}
        data-disabled={context.disabled ? '' : undefined}
        {...rangeProps}
        ref={composedRefs}
        {...{
          [orientation.startEdge]: offsetStart + '%',
          [orientation.endEdge]: offsetEnd + '%',
        }}
      />
    )
  }
)

SliderTrackActive.displayName = RANGE_NAME

/* -------------------------------------------------------------------------------------------------
 * SliderThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_NAME = 'SliderThumb'

const SliderThumbFrame = styled(SizableStack, {
  name: 'SliderThumb',
  position: 'absolute',
})

type SliderThumbElement = HTMLElement | View
interface SliderThumbProps extends SizableStackProps {
  index: number
}

const SliderThumb = React.forwardRef<SliderThumbElement, SliderThumbProps>(
  (props: ScopedProps<SliderThumbProps>, forwardedRef) => {
    const { __scopeSlider, index, size: sizeProp, ...thumbProps } = props
    const context = useSliderContext(THUMB_NAME, __scopeSlider)
    const orientation = useSliderOrientationContext(THUMB_NAME, __scopeSlider)
    // const [thumb, setThumb] = React.useState<HTMLSpanElement | null>(null)
    // const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node))
    const sizeVal = sizeProp ?? context.size ?? 40
    const size = getCircleSize(sizeVal, getVariantExtras(props))
    console.log('s', sizeProp, context.size, sizeVal, size)

    // We cast because index could be `-1` which would return undefined
    const value = context.values[index] as number | undefined
    const percent =
      value === undefined ? 0 : convertValueToPercentage(value, context.min, context.max)
    const label = getLabel(index, context.values.length)

    const thumbInBoundsOffset = size
      ? getThumbInBoundsOffset(size, percent, orientation.direction)
      : 0

    console.log('thumbInBoundsOffset', thumbInBoundsOffset, size, percent)

    // React.useEffect(() => {
    //   if (thumb) {
    //     context.thumbs.add(thumb)
    //     return () => {
    //       context.thumbs.delete(thumb)
    //     }
    //   }
    // }, [thumb, context.thumbs])

    return (
      <SliderThumbFrame
        ref={forwardedRef}
        // role="slider"
        aria-label={props['aria-label'] || label}
        aria-valuemin={context.min}
        aria-valuenow={value}
        aria-valuemax={context.max}
        aria-orientation={context.orientation}
        data-orientation={context.orientation}
        data-disabled={context.disabled ? '' : undefined}
        // tabIndex={context.disabled ? undefined : 0}
        {...thumbProps}
        x={thumbInBoundsOffset}
        y={-size / 2}
        size={100}
        {...{
          [orientation.startEdge]: `${percent}%`,
        }}
        /**
         * There will be no value on initial render while we work out the index so we hide thumbs
         * without a value, otherwise SSR will render them in the wrong position before they
         * snap into the correct position during hydration which would be visually jarring for
         * slower connections.
         */
        style={value === undefined ? { display: 'none' } : props.style}
        onFocus={composeEventHandlers(props.onFocus, () => {
          context.valueIndexToChangeRef.current = index
        })}
      />
    )
  }
)

SliderThumb.displayName = THUMB_NAME

/* -------------------------------------------------------------------------------------------------
 * Slider
 * -----------------------------------------------------------------------------------------------*/

type SliderElement = SliderHorizontalElement | SliderVerticalElement

const Slider = withStaticProperties(
  React.forwardRef<SliderElement, SliderProps>((props: ScopedProps<SliderProps>, forwardedRef) => {
    const {
      name,
      min = 0,
      max = 100,
      step = 1,
      orientation = 'horizontal',
      disabled = false,
      minStepsBetweenThumbs = 0,
      defaultValue = [min],
      value,
      onValueChange = () => {},
      size: sizeProp,
      ...sliderProps
    } = props
    // const [slider, setSlider] = React.useState<HTMLElement | View | null>(null)
    // const composedRefs = useComposedRefs(forwardedRef, (node) => setSlider(node))
    const size = getSize(sizeProp)
    console.log('go', size, sizeProp)
    const thumbRefs = React.useRef<SliderContextValue['thumbs']>(new Set())
    const valueIndexToChangeRef = React.useRef<number>(0)
    const isHorizontal = orientation === 'horizontal'
    // We set this to true by default so that events bubble to forms without JS (SSR)
    // TODO
    // const isFormControl = slider ? Boolean(slider.closest('form')) : true

    const [values = [], setValues] = useControllableState({
      prop: value,
      defaultProp: defaultValue,
      onChange: (value) => {
        // const thumbs = [...thumbRefs.current]
        // thumbs[valueIndexToChangeRef.current]?.focus()
        onValueChange(value)
      },
    })

    function handleSlideStart(value: number) {
      const closestIndex = getClosestValueIndex(values, value)
      updateValues(value, closestIndex)
    }

    function handleSlideMove(value: number) {
      updateValues(value, valueIndexToChangeRef.current)
    }

    function updateValues(value: number, atIndex: number) {
      const decimalCount = getDecimalCount(step)
      const snapToStep = roundValue(Math.round((value - min) / step) * step + min, decimalCount)
      const nextValue = clamp(snapToStep, [min, max])
      setValues((prevValues = []) => {
        const nextValues = getNextSortedValues(prevValues, nextValue, atIndex)
        if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) {
          valueIndexToChangeRef.current = nextValues.indexOf(nextValue)
          return String(nextValues) === String(prevValues) ? prevValues : nextValues
        } else {
          return prevValues
        }
      })
    }

    const SliderOriented = isHorizontal ? SliderHorizontal : SliderVertical

    return (
      <SliderProvider
        scope={props.__scopeSlider}
        disabled={disabled}
        min={min}
        max={max}
        valueIndexToChangeRef={valueIndexToChangeRef}
        thumbs={thumbRefs.current}
        values={values}
        orientation={orientation}
        size={size}
      >
        <SliderOriented
          aria-disabled={disabled}
          data-disabled={disabled ? '' : undefined}
          {...sliderProps}
          ref={forwardedRef}
          min={min}
          max={max}
          onSlideStart={disabled ? undefined : handleSlideStart}
          onSlideMove={disabled ? undefined : handleSlideMove}
          onHomeKeyDown={() => !disabled && updateValues(min, 0)}
          onEndKeyDown={() => !disabled && updateValues(max, values.length - 1)}
          onStepKeyDown={({ event, direction: stepDirection }) => {
            if (!disabled) {
              const isPageKey = PAGE_KEYS.includes(event.key)
              const isSkipKey = isPageKey || (event.shiftKey && ARROW_KEYS.includes(event.key))
              const multiplier = isSkipKey ? 10 : 1
              const atIndex = valueIndexToChangeRef.current
              const value = values[atIndex]
              const stepInDirection = step * multiplier * stepDirection
              updateValues(value + stepInDirection, atIndex)
            }
          }}
        />
        {/* {isFormControl &&
          values.map((value, index) => (
            <BubbleInput
              key={index}
              name={name ? name + (values.length > 1 ? '[]' : '') : undefined}
              value={value}
            />
          ))} */}
      </SliderProvider>
    )
  }),
  {
    Track: SliderTrack,
    TrackActive: SliderTrackActive,
    Thumb: SliderThumb,
  }
)

Slider.displayName = SLIDER_NAME

/* -----------------------------------------------------------------------------------------------*/

// TODO
const BubbleInput = (props: any) => {
  const { value, ...inputProps } = props
  const ref = React.useRef<HTMLInputElement>(null)
  const prevValue = usePrevious(value)

  // Bubble value change to parents (e.g form change event)
  React.useEffect(() => {
    const input = ref.current!
    const inputProto = window.HTMLInputElement.prototype
    const descriptor = Object.getOwnPropertyDescriptor(inputProto, 'value') as PropertyDescriptor
    const setValue = descriptor.set
    if (prevValue !== value && setValue) {
      const event = new Event('input', { bubbles: true })
      setValue.call(input, value)
      input.dispatchEvent(event)
    }
  }, [prevValue, value])

  /**
   * We purposefully do not use `type="hidden"` here otherwise forms that
   * wrap it will not be able to access its value via the FormData API.
   *
   * We purposefully do not add the `value` attribute here to allow the value
   * to be set programatically and bubble to any parent form `onChange` event.
   * Adding the `value` will cause React to consider the programatic
   * dispatch a duplicate and it will get swallowed.
   */
  return <input style={{ display: 'none' }} {...inputProps} ref={ref} defaultValue={value} />
}

/* -----------------------------------------------------------------------------------------------*/

const Track = SliderTrack
const Range = SliderTrackActive
const Thumb = SliderThumb

export {
  Slider,
  SliderTrack,
  SliderTrackActive,
  SliderThumb,
  //
  Track,
  Range,
  Thumb,
}
export type { SliderProps, SliderTrackProps, SliderTrackActiveProps, SliderThumbProps }
