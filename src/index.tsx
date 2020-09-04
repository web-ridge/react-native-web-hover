import * as React from 'react';
import type {
  ViewProps,
  StyleProp,
  ViewStyle,
  PressableStateCallbackType,
  FlatListProps,
  VirtualizedListProps,
  ScrollViewProps,
} from 'react-native';

import {
  View,
  Pressable as NativePressable,
  ScrollView as NativeScrollView,
  FlatList as NativeFlatList,
  VirtualizedList as NativeVirtualizedList,
  //@ts-ignore
} from 'react-native-web';

const isServer =
  typeof process !== 'undefined' &&
  process.release &&
  process.release.name === 'node';

const hoverListener = createHoverListener();

interface PressableStateCallbackTypeWeb extends PressableStateCallbackType {
  focused?: boolean;
  hovered?: boolean;
}

type ChildrenType =
  | React.ReactNode
  | ((state: PressableStateCallbackTypeWeb) => React.ReactNode);

type StylesType =
  | StyleProp<ViewStyle>
  | ((state: PressableStateCallbackTypeWeb) => StyleProp<ViewStyle>);

interface HoverableProps extends ViewProps {
  children:
    | React.ReactNode
    | ((state: { hovered: boolean }) => React.ReactNode);
}

interface PressableProps extends Omit<ViewProps, 'style'> {
  children: ChildrenType;
  style?: StylesType;
}

export function Hoverable({ children, ...rest }: HoverableProps) {
  const hostRef = React.useRef<View | null>(null);
  const [hovered, setHovered] = React.useState<boolean>(false);
  React.useEffect(() => {
    const hr = hostRef.current;
    hoverListener.add(hr, setHovered);
    return () => {
      hoverListener.remove(hr);
    };
  }, [setHovered, hostRef]);

  return (
    <View
      ref={hostRef}
      children={
        typeof children === 'function' ? children({ hovered }) : children
      }
      {...rest}
    />
  );
}

function PressableWithoutRef(
  { style, children, ...rest }: PressableProps,
  forwardedRef: any
) {
  const hostRef = React.useRef<View | null>(null);
  const [hovered, setHovered] = React.useState<boolean>(false);

  const setRef = setAndForwardRef({
    getForwardedRef: () => forwardedRef,
    setLocalRef: (hostNode: any) => {
      hostRef.current = hostNode;
    },
  });

  React.useEffect(() => {
    const hr = hostRef.current;
    hoverListener.add(hr, setHovered);
    return () => {
      hoverListener.remove(hr);
    };
  }, [setHovered, hostRef]);

  return (
    <NativePressable
      //@ts-ignore
      ref={setRef}
      style={(interactionState: any) =>
        typeof style === 'function'
          ? style({ ...interactionState, hovered })
          : style
      }
      children={(interactionState: any) =>
        typeof children === 'function'
          ? children({ ...interactionState, hovered })
          : children
      }
      {...rest}
    />
  );
}

function containsEvent(parent: any, clickTarget: any) {
  if (parent === clickTarget) {
    return true;
  }
  if (!parent) {
    return false;
  }
  for (let child of parent.childNodes) {
    if (containsEvent(child, clickTarget)) {
      return true;
    }
  }
  return false;
}

function createHoverListener() {
  let hasMouse = isServer ? false : window.matchMedia('(pointer:fine)').matches;

  let refs = new Map<any, (h: boolean) => any>();
  let previousHoverFunc: undefined | ((h: boolean) => any);
  let mousePosition = {
    x: 0,
    y: 0,
  };

  function hover(target: any) {
    // hover is targeted directly
    let hoverFunc = refs.get(target);

    // let's try to see if any of the children of the hover event are hovered
    if (!hoverFunc) {
      for (let r of refs.keys()) {
        if (containsEvent(r, target)) {
          hoverFunc = refs.get(r);
        }
      }
    }

    previousHoverFunc && previousHoverFunc(false);
    hoverFunc && hoverFunc(true);

    // cache the previous hover so we can un-hover this later on
    previousHoverFunc = hoverFunc;
  }

  function hoverEvent(event: any) {
    hover(event.target);
  }

  function unhover() {
    previousHoverFunc && previousHoverFunc(false);
  }

  function captureMousePosition(event: any) {
    mousePosition.x = event.pageX;
    mousePosition.y = event.pageY;
  }

  // touch devices have a bug where the onMouseOver is handled while it should not
  // if the user would click something it keeps hovered while it should unhover
  // so only listen to these events if the device has a mouse
  if (hasMouse) {
    document.onmouseover = hoverEvent;
    document.onmousemove = captureMousePosition;
    document.ontouchstart = unhover;
    document.ontouchend = unhover;
    document.ontouchcancel = unhover;
    document.ontouchmove = unhover;
  }

  function add(ref: any, setHovered: any) {
    refs.set(ref, setHovered);
  }

  function remove(ref: any) {
    refs.delete(ref);
  }

  return {
    add,
    remove,
    mousePosition,
    hover,
  };
}

function setAndForwardRef({ getForwardedRef, setLocalRef }: any) {
  return function forwardRef(ref: React.ElementRef<any>) {
    const forwardedRef = getForwardedRef();
    setLocalRef(ref);

    // Forward to user ref prop (if one has been specified)
    if (typeof forwardedRef === 'function') {
      // Handle function-based refs. String-based refs are handled as functions.
      forwardedRef(ref);
    } else if (typeof forwardedRef === 'object' && forwardedRef != null) {
      // Handle createRef-based refs
      forwardedRef.current = ref;
    }
  };
}

function enhanceScrollView(WrappedComponent: any) {
  const EnhancedScrollView = ({
    forwardedRef,
    onScroll,
    scrollEventThrottle,
    ...rest
  }: any) => {
    const onScrollInner = (e: any) => {
      onScroll && onScroll(e);
      const { mousePosition, hover } = hoverListener;
      hover(document.elementFromPoint(mousePosition.x, mousePosition.y));
    };
    return (
      <WrappedComponent
        ref={forwardedRef}
        onScroll={onScrollInner}
        scrollEventThrottle={scrollEventThrottle || 25}
        {...rest}
      />
    );
  };

  return React.forwardRef((props, ref) => {
    return <EnhancedScrollView {...props} forwardedRef={ref} />;
  });
}

export const Pressable = React.forwardRef(PressableWithoutRef);
export const ScrollView = enhanceScrollView(
  NativeScrollView
) as React.ElementType<ScrollViewProps>;
export const FlatList = enhanceScrollView(NativeFlatList) as React.ElementType<
  FlatListProps<unknown>
>;
export const VirtualizedList = enhanceScrollView(
  NativeVirtualizedList
) as React.ElementType<VirtualizedListProps<unknown>>;
