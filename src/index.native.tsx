import * as React from 'react';
import {
  View,
  Pressable,
  ScrollView,
  FlatList,
  VirtualizedList,
  ViewProps,
} from 'react-native';

interface HoverableProps extends ViewProps {
  children:
    | React.ReactNode
    | ((state: { hovered: boolean }) => React.ReactNode);
}

export function Hoverable({ children, ...rest }: HoverableProps) {
  return (
    <View
      children={
        typeof children === 'function' ? children({ hovered: false }) : children
      }
      {...rest}
    />
  );
}

export { Pressable, ScrollView, FlatList, VirtualizedList };
