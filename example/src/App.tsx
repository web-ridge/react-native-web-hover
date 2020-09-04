import * as React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Pressable, ScrollView, Hoverable } from 'react-native-web-hover';

function App() {
  return (
    <ScrollView style={styles.scrollView}>
      <Text style={styles.title}>Demo of hovering in react-native-web</Text>
      <Text style={{ padding: 24 }}>
        The 'Hoverable' can be used to support hovering in Touchable and legacy
        pressables
      </Text>

      <Hoverable>
        {({ hovered }) => (
          <Button
            title="legacy button"
            onPress={() => {}}
            color={hovered ? 'black' : 'grey'}
          />
        )}
      </Hoverable>
      <Text style={{ padding: 24 }}>
        We recommend the 'Pressable' component which was introduced in React
        Native 0.63 to create rich button states.
      </Text>
      {[...Array(20)].map((_, i) => (
        <NiceButton key={i} label={`Button ${i}`} />
      ))}
      <View style={{ backgroundColor: 'lightblue', margin: 20 }}>
        <ScrollView style={{ height: 200 }}>
          {[...Array(20)].map((_, i) => (
            <NiceButton key={i} label={`Button ${i}`} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

function NiceButton({ label }: { label: string }) {
  return (
    <Pressable
      style={({ hovered, focused, pressed }) => [
        styles.buttonRoot,
        hovered && styles.buttonHovered,
        focused && styles.buttonFocused,
        pressed && styles.buttonPressed,
      ]}
    >
      {({ hovered, focused, pressed }) => (
        <View style={styles.buttonInner}>
          <Text style={styles.buttonLabel}>
            {label} (
            {[
              focused ? 'focused' : '',
              hovered ? 'hovered' : '',
              pressed ? 'pressed' : '',
            ]
              .filter((n) => n)
              .join(', ')}
            )
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    padding: 24,
    textAlign: 'center',
  },
  scrollView: { flex: 1, backgroundColor: 'pink' },
  buttonLabel: { fontWeight: 'bold' },
  buttonInner: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRoot: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  buttonHovered: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonFocused: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  buttonPressed: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,
    elevation: 19,
  },
});

export default App;
