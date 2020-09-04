# react-native-web-hover

Some enhanced elements for react-native-web to support hover on the web!

![ezgif-6-6aca55b7ed39](https://user-images.githubusercontent.com/6492229/92249982-28e3a200-eecb-11ea-8672-a86328acbe2d.gif)


It requires a React Native version with Pressable support which was introduced in version 0.63

## Demo

https://codesandbox.io/s/young-surf-bbmzz?file=/src/App.tsx

## Installation

```sh
npm install react-native-web-hover
```

## Usage
```
import { Hoverable, Pressable, } from 'react-native-web-hover'

// The Pressable, you can still provide normal styles or children without functions!
 <Pressable
      style={({ hovered, focused, pressed }) => [
        styles.buttonRoot,
        hovered && styles.buttonHovered,
        focused && styles.buttonFocused,
        pressed && styles.buttonPressed
      ]}
    >
      {({ hovered, focused, pressed }) => (
        <View style={styles.buttonInner}>
          <Text style={styles.buttonLabel}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>

       // The Hoverable
      <Hoverable>
        {({ hovered }) => (
          <Button
            title="legacy button"
            onPress={() => {}}
            color={hovered ? "black" : "grey"}
          />
        )}
      </Hoverable>
```

We recommend the "Pressable" component. You can see examples here:
https://codesandbox.io/s/young-surf-bbmzz?file=/src/App.tsx




### If your app is inside an iframe
If your webapp is included in an iframe you will need the FlatList, ScrollViews or VirtualizedList from our library.

import { ScrollView, FlatList, VirtualizedList } from 'react-native-web-hover'

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
