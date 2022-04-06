import { HelpCircle, Link } from '@tamagui/feather-icons'
import NextLink from 'next/link'
import NextRouter from 'next/router'
import rangeParser from 'parse-numeric-range'
import React from 'react'
import { ScrollView } from 'react-native'
import {
  EnsureFlexed,
  H1,
  H2,
  H3,
  H4,
  H5,
  Image,
  Paragraph,
  Separator,
  StackProps,
  Text,
  Theme,
  XStack,
  YStack,
} from 'tamagui'

import { Frontmatter } from '../frontmatter'
import { BenchmarkChart } from './BenchmarkChart'
import { Code, CodeInline } from './Code'
import { DemoButton } from './DemoButton'
import * as Demos from './demos'
import { DocCodeBlock } from './DocsCodeBlock'
import { ExternalIcon } from './ExternalIcon'
import { HeroContainer } from './HeroContainer'
import { Highlights } from './Highlights'
import { MediaPlayer } from './MediaPlayer'
import { OffsetBox } from './OffsetBox'
import { Preview } from './Preview'
import { PropsTable } from './PropsTable'
import { SubTitle } from './SubTitle'

export const components = {
  ScrollView,
  Text,
  Paragraph,
  YStack,
  XStack,
  BenchmarkChart,
  Separator,
  Code,
  HeroContainer,

  ...Demos,

  Highlights,
  PropsTable,
  Description: SubTitle,

  IntroParagraph: ({ children, ...props }) => {
    return (
      <Paragraph size="$6" className="paragraph" display="block" mt="$2" my="$4" {...props}>
        {children.props.children}
      </Paragraph>
    )
  },

  Note: (props) => (
    <YStack
      tag="aside"
      mt="$5"
      mb="$5"
      borderRadius="$3"
      // & & p
      // fontSize: '$3',
      // color: '$slate11',
      // lineHeight: '23px',
      // margin: 0,
      {...props}
    />
  ),

  Notice: ({ children, ...props }) => {
    return (
      <Theme name="yellow">
        <XStack
          borderWidth={1}
          borderColor="$borderColor"
          p="$5"
          py="$4"
          bc="$background"
          br="$2"
          mb="$2"
          mt="$2"
          space="$3"
          {...props}
        >
          {/* TODO could unwrapText to get proper coloring */}
          <Paragraph py="$1" theme="alt1" mt={-3} mb={-3} className="paragraph-parent" size="$3">
            {children}
          </Paragraph>
          <YStack
            ml="auto"
            mt={-2}
            w={30}
            h={30}
            ai="center"
            jc="center"
            bc="$backgroundFocus"
            br={100}
          >
            <HelpCircle size={18} color="var(--yellow11)" />
          </YStack>
        </XStack>
      </Theme>
    )
  },

  h1: (props) => <H1 mb="$2" {...props} />,

  h2: ({ children, ...props }) => (
    <H2 color="$color" mt="$3" size="$8" letterSpacing={-0.5} data-heading {...props}>
      {children}
    </H2>
  ),

  h3: ({ children, id, ...props }) => (
    <LinkHeading mt="$3" id={id}>
      <H3 data-heading size="$7" {...props}>
        {children}
      </H3>
    </LinkHeading>
  ),

  h4: (props) => <H4 mt="$3" size="$6" {...props} />,
  h5: (props) => <H5 mt="$3" size="$5" {...props} />,

  p: (props) => (
    <Paragraph
      // color="$colorHover"
      className="paragraph"
      display="block"
      mb="$1"
      mt="$1"
      {...props}
    />
  ),

  a: ({ href = '', children, ...props }) => {
    return (
      <NextLink href={href} passHref>
        <Text tag="a" display="inline" {...props}>
          {children}
          {href.startsWith('http') ? (
            <>
              &nbsp;
              <Text display="inline-flex" y={2} mr={2}>
                <ExternalIcon />
              </Text>
            </>
          ) : null}
        </Text>
      </NextLink>
    )
  },

  hr: (props) => (
    <YStack my="$6" mx="auto" maxWidth="50%">
      <EnsureFlexed />
      <YStack borderBottomColor="$borderColor" borderBottomWidth={1} flex={1} />
    </YStack>
  ),

  ul: ({ children }) => {
    return (
      <YStack tag="ul" my="$1">
        {React.Children.toArray(children).map((x) => (typeof x === 'string' ? null : x))}
      </YStack>
    )
  },

  ol: (props) => <YStack {...props} tag="ol" mb="$3" />,

  li: (props) => (
    <YStack pb="$0.5">
      <li>
        <Paragraph {...props} />
      </li>
    </YStack>
  ),

  strong: (props) => <Text {...props} fontWeight="700" />,

  img: ({ ...props }) => (
    <YStack my="$6">
      {/* TODO make this a proper <Image /> component */}
      <YStack tag="img" {...props} maxWidth="100%" />
    </YStack>
  ),

  pre: ({ children }) => <>{children}</>,

  code: (props) => {
    const { hero, line, scrollable, className, children, id, showLineNumbers, collapsed, ...rest } =
      props
    if (!className) {
      return <CodeInline>{children}</CodeInline>
    }
    return (
      <DocCodeBlock
        isHighlightingLines={line !== undefined}
        className={className}
        isHero={hero !== undefined}
        isCollapsible={hero !== undefined || collapsed !== undefined}
        isScrollable={scrollable !== undefined}
        showLineNumbers={showLineNumbers !== undefined}
        {...(rest as any)}
      >
        {children}
      </DocCodeBlock>
    )
  },

  Image: ({ children, size, ...props }) => (
    <YStack tag="figure" mx={0} mb="$3">
      <OffsetBox size={size}>
        <Image maxWidth="100%" {...props} />
      </OffsetBox>
      <Text tag="figcaption" lineHeight={23} color="$colorPress" mt="$2">
        {children}
      </Text>
    </YStack>
  ),

  Video: ({
    small,
    large,
    src,
    children = '',
    muted = true,
    autoPlay = true,
    controls,
    size,
    ...props
  }) => (
    <YStack tag="figure" mx={0} my="$6">
      <OffsetBox size={size}>
        <video
          src={src}
          autoPlay={autoPlay}
          playsInline
          muted={muted}
          controls={controls}
          loop
          style={{ width: '100%', display: 'block' }}
        ></video>
      </OffsetBox>
      <Text tag="figcaption" lineHeight={23} mt="$2" color="$colorPress">
        {children}
      </Text>
    </YStack>
  ),

  blockquote: ({ children, ...props }) => {
    return (
      <YStack
        my="$4"
        pl="$4"
        ml="$3"
        borderLeftWidth={1}
        borderColor="$borderColor"
        jc="center"
        {...props}
      >
        <Paragraph whiteSpace="revert" size="$4" color="$color" opacity={0.65}>
          {/* @ts-ignore */}
          {React.Children.toArray(children).map((x) => (x?.props?.children ? x.props.children : x))}
        </Paragraph>
      </YStack>
    )
  },

  DemoButton,

  Preview: (props) => {
    return <Preview {...props} mt="$5" />
  },

  RegisterLink: ({ id, index, href }) => {
    const isExternal = href.startsWith('http')

    React.useEffect(() => {
      const codeBlock = document.getElementById(id)
      if (!codeBlock) return

      const allHighlightWords = codeBlock.querySelectorAll('.highlight-word')
      const target = allHighlightWords[index - 1]
      if (!target) return

      const addClass = () => target.classList.add('on')
      const removeClass = () => target.classList.remove('on')
      const addClick = () => (isExternal ? window.location.replace(href) : NextRouter.push(href))

      target.addEventListener('mouseenter', addClass)
      target.addEventListener('mouseleave', removeClass)
      target.addEventListener('click', addClick)

      return () => {
        target.removeEventListener('mouseenter', addClass)
        target.removeEventListener('mouseleave', removeClass)
        target.removeEventListener('click', addClick)
      }
    }, [])

    return null
  },

  H: ({ id, index, ...props }) => {
    const triggerRef = React.useRef<HTMLElement>(null)

    React.useEffect(() => {
      const trigger = triggerRef.current

      const codeBlock = document.getElementById(id)
      if (!codeBlock) return

      const allHighlightWords = codeBlock.querySelectorAll('.highlight-word')
      const targetIndex = rangeParser(index).map((i) => i - 1)
      // exit if the `index` passed is bigger than the total number of highlighted words
      if (Math.max(...targetIndex) >= allHighlightWords.length) return

      const addClass = () => targetIndex.forEach((i) => allHighlightWords[i].classList.add('on'))
      const removeClass = () =>
        targetIndex.forEach((i) => allHighlightWords[i].classList.remove('on'))

      trigger?.addEventListener('mouseenter', addClass)
      trigger?.addEventListener('mouseleave', removeClass)

      return () => {
        trigger?.removeEventListener('mouseenter', addClass)
        trigger?.removeEventListener('mouseleave', removeClass)
      }
    }, [])

    return <Paragraph fontFamily="$mono" cursor="default" ref={triggerRef} {...props} />
  },

  MediaPlayerDemo: ({ theme, ...props }) => {
    return (
      <Theme name={theme}>
        <MediaPlayer {...props} />
      </Theme>
    )
  },
}

const LinkHeading = ({ id, children, ...props }: { id: string } & StackProps) => (
  <XStack
    tag="a"
    href={`#${id}`}
    // used by `scrollToUrlHash`
    // not using the `id` attribute for that because we may get ids that start with a number
    // and that is not a valid css selector
    data-id={id}
    display="inline-flex"
    ai="center"
    space
    {...props}
    // css={{
    //   textDecoration: 'none',
    //   color: 'inherit',
    //   display: 'inline-flex',
    //   alignItems: 'center',
    //   svg: {
    //     opacity: 0,
    //   },
    //   '&:hover svg': {
    //     opacity: 1,
    //   },
    // }}
  >
    {children}
    <YStack tag="span" opacity={0.3}>
      <Link size={12} color="var(--color)" aria-hidden />
    </YStack>
  </XStack>
)

export const FrontmatterContext = React.createContext<Frontmatter>({} as any)

// Custom provider for next-mdx-remote
// https://github.com/hashicorp/next-mdx-remote#using-providers
export function MDXProvider(props) {
  const { frontmatter, children } = props
  return (
    <>
      <FrontmatterContext.Provider value={frontmatter}>{children}</FrontmatterContext.Provider>
    </>
  )
}
