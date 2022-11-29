import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { Sheet } from '@tamagui/sheet'
import { SheetProps } from '@tamagui/sheet/types/types'
import { useState } from 'react'
import { Button, XStack } from 'tamagui'

export const SheetDemo = () => {
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(false)
  const [modal, setModal] = useState(true)
  const [innerOpen, setInnerOpen] = useState(false)

  return (
    <>
      <XStack space>
        <Button onPress={() => setOpen(true)}>Open</Button>
        <Button onPress={() => setModal((x) => !x)}>{modal ? 'Modal' : 'Inline'}</Button>
      </XStack>

      <Sheet
        modal={modal}
        open={open}
        onOpenChange={setOpen}
        snapPoints={[85, 50, 25]}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame f={1} p="$4" jc="center" ai="center" space="$5">
          <Button size="$6" circular icon={ChevronDown} onPress={() => setOpen(false)} />
          <Button size="$6" circular icon={ChevronUp} onPress={() => setInnerOpen(true)}></Button>
          <InnerSheet open={innerOpen} onOpenChange={setInnerOpen} />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

function InnerSheet(props: SheetProps) {
  return (
    <Sheet modal snapPoints={[90]} dismissOnSnapToBottom {...props}>
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame f={1} p="$4" jc="center" ai="center" space="$5">
        <Button size="$4" circular icon={ChevronDown} onPress={() => props.onOpenChange?.(false)} />
      </Sheet.Frame>
    </Sheet>
  )
}
