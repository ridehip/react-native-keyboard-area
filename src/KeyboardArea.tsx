import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { RNKeyboard } from './module';

// TODO: on ios try to make the animation smoother
// From: https://medium.com/man-moon/writing-modern-react-native-ui-e317ff956f02
// const defaultAnimation = {
//   duration: 200,
//   create: {
//     duration: 500,
//     type: LayoutAnimation.Types.easeInEaseOut,
//     property: LayoutAnimation.Properties.opacity,
//   },
//   update: {
//     type: LayoutAnimation.Types.spring,
//     springDamping: 200,
//   },
// };

interface IProps {
  style?: StyleProp<ViewStyle>;
  /**
   * If true, will keep the the keyboard area open even if the Keyboard is dismiss
   * Useful to switch to another view and then come back to the Keyboard view
   * NOTE: if false will not close the keyboard area to avoid layout jumping, use the close() method
   */
  isOpen?: boolean;
  /**
   * Content to be placed under the Keyboard
   */
  children?: ReactNode;
  /**
   * Until the keyboard shows once, we don't know it real height,
   * so we need a initial default height
   * (Default: 250)
   */
  initialHeight?: number;
  /**
   * Minimum height for manually open view
   * (Default: 250)
   */
  minHeight?: number;
  /**
   * Event fired when keyboard height changes
   */
  onChange?: (isOpen: boolean, height: number) => void;
}

export type KeyboardAreaRef = {
  isOpen: () => boolean;
  open: () => void;
  close: () => void;
};

export const KeyboardArea = forwardRef<KeyboardAreaRef, IProps>(
  (
    {
      style,
      children = null,
      isOpen: externalOpen,
      initialHeight = 250,
      minHeight = 250,
      onChange,
    },
    ref,
  ) => {
    const isOpen = useRef(false);
    const forceOpen = useRef(false);
    const keyboardHeight = useRef(initialHeight);
    const [currentHeight, setCurrentHeight] = useState(0);

    const open = () => {
      isOpen.current = true;
      setCurrentHeight(keyboardHeight.current);
      if (onChange) {
        onChange(true, keyboardHeight.current);
      }
    };

    const close = () => {
      isOpen.current = false;
      setCurrentHeight(0);
      if (onChange) {
        onChange(false, 0);
      }
    };

    useImperativeHandle(ref, () => ({
      isOpen: () => isOpen.current,
      open,
      close,
    }));

    useEffect(() => {
      const keyboardHeightChanged = (height: number) => {
        if (height > 0 && height !== keyboardHeight.current) {
          keyboardHeight.current = height > minHeight ? height : minHeight;
        }
        const needToOpen = forceOpen.current || height > 0;
        if (needToOpen) {
          open();
        } else {
          close();
        }
      };
      RNKeyboard.addKeyboardListener(keyboardHeightChanged);
      return () => {
        RNKeyboard.removeKeyboardListener(keyboardHeightChanged);
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      forceOpen.current = externalOpen || false;
      if (forceOpen.current) {
        open();
      }
    }, [externalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    return <View style={[{ height: currentHeight }, style]}>{children}</View>;
  },
);
