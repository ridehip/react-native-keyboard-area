import { PixelRatio, NativeModules, NativeEventEmitter, Platform, } from 'react-native';
const { RNKeyboard: KBModule } = NativeModules;
const SOFT_INPUT_MODES = {
    SOFT_INPUT_ADJUST_NOTHING: KBModule.SOFT_INPUT_ADJUST_NOTHING,
    SOFT_INPUT_ADJUST_PAN: KBModule.SOFT_INPUT_ADJUST_PAN,
    SOFT_INPUT_ADJUST_RESIZE: KBModule.SOFT_INPUT_ADJUST_RESIZE,
    SOFT_INPUT_ADJUST_UNSPECIFIED: KBModule.SOFT_INPUT_ADJUST_UNSPECIFIED,
    SOFT_INPUT_IS_FORWARD_NAVIGATION: KBModule.SOFT_INPUT_IS_FORWARD_NAVIGATION,
    SOFT_INPUT_MASK_ADJUST: KBModule.SOFT_INPUT_MASK_ADJUST,
    SOFT_INPUT_MASK_STATE: KBModule.SOFT_INPUT_MASK_STATE,
    SOFT_INPUT_MODE_CHANGED: KBModule.SOFT_INPUT_MODE_CHANGED,
    SOFT_INPUT_STATE_ALWAYS_HIDDEN: KBModule.SOFT_INPUT_STATE_ALWAYS_HIDDEN,
    SOFT_INPUT_STATE_ALWAYS_VISIBLE: KBModule.SOFT_INPUT_STATE_ALWAYS_VISIBLE,
    SOFT_INPUT_STATE_HIDDEN: KBModule.SOFT_INPUT_STATE_HIDDEN,
    SOFT_INPUT_STATE_UNCHANGED: KBModule.SOFT_INPUT_STATE_UNCHANGED,
    SOFT_INPUT_STATE_UNSPECIFIED: KBModule.SOFT_INPUT_STATE_UNSPECIFIED,
    SOFT_INPUT_STATE_VISIBLE: KBModule.SOFT_INPUT_STATE_VISIBLE,
};
const eventEmitter = new NativeEventEmitter(KBModule);
/**
 * Native Event name, emitted from Android and iOS
 */
export const KEYBOARD_SIZE_EVENT_NAME = 'KeyboardSizeChanges';
export var SoftInputMode;
(function (SoftInputMode) {
    SoftInputMode["SOFT_INPUT_ADJUST_NOTHING"] = "SOFT_INPUT_ADJUST_NOTHING";
    SoftInputMode["SOFT_INPUT_ADJUST_PAN"] = "SOFT_INPUT_ADJUST_PAN";
    SoftInputMode["SOFT_INPUT_ADJUST_RESIZE"] = "SOFT_INPUT_ADJUST_RESIZE";
    SoftInputMode["SOFT_INPUT_ADJUST_UNSPECIFIED"] = "SOFT_INPUT_ADJUST_UNSPECIFIED";
    SoftInputMode["SOFT_INPUT_IS_FORWARD_NAVIGATION"] = "SOFT_INPUT_IS_FORWARD_NAVIGATION";
    SoftInputMode["SOFT_INPUT_MASK_ADJUST"] = "SOFT_INPUT_MASK_ADJUST";
    SoftInputMode["SOFT_INPUT_MASK_STATE"] = "SOFT_INPUT_MASK_STATE";
    SoftInputMode["SOFT_INPUT_MODE_CHANGED"] = "SOFT_INPUT_MODE_CHANGED";
    SoftInputMode["SOFT_INPUT_STATE_ALWAYS_HIDDEN"] = "SOFT_INPUT_STATE_ALWAYS_HIDDEN";
    SoftInputMode["SOFT_INPUT_STATE_ALWAYS_VISIBLE"] = "SOFT_INPUT_STATE_ALWAYS_VISIBLE";
    SoftInputMode["SOFT_INPUT_STATE_HIDDEN"] = "SOFT_INPUT_STATE_HIDDEN";
    SoftInputMode["SOFT_INPUT_STATE_UNCHANGED"] = "SOFT_INPUT_STATE_UNCHANGED";
    SoftInputMode["SOFT_INPUT_STATE_UNSPECIFIED"] = "SOFT_INPUT_STATE_UNSPECIFIED";
    SoftInputMode["SOFT_INPUT_STATE_VISIBLE"] = "SOFT_INPUT_STATE_VISIBLE";
})(SoftInputMode || (SoftInputMode = {}));
export class RNKeyboard {
    /**
     * This is private method handling the native event listener logic
     * When fired it will invoke all the previously registered callbacks
     * @param height current keyboard height
     */
    static keyboardListener(height) {
        const keyboardHeight = Platform.OS === 'android' ? height / PixelRatio.get() : height;
        RNKeyboard.callbacks.forEach(callback => {
            callback(keyboardHeight);
        });
    }
    /**
     * @android only
     * Change the WindowSoftInput behavior at runtime
     * @param mode See SoftInputMode for all the options
     */
    static setWindowSoftInputMode(mode) {
        return KBModule.setWindowSoftInputMode(SOFT_INPUT_MODES[mode]);
    }
    /**
     * Invoke the provided callback every time the keyboard height changes (when it show/hide)
     * Note: when it invoke the first time it will listen to RNKeyboard native event
     * @param callback Callback that will be invoked with the current keyboard height
     */
    static addKeyboardListener(callback) {
        if (!RNKeyboard.isInitialized) {
            KBModule.startKeyboardListener();
            eventEmitter.addListener(KEYBOARD_SIZE_EVENT_NAME, RNKeyboard.keyboardListener);
            RNKeyboard.isInitialized = true;
        }
        RNKeyboard.callbacks.push(callback);
        return () => RNKeyboard.removeKeyboardListener(callback);
    }
    /**
     * Will remove a previously added callback with the addKeyboardListener method
     * @param callback Callback to remove
     */
    static removeKeyboardListener(callback) {
        RNKeyboard.callbacks = RNKeyboard.callbacks.filter(cb => cb !== callback);
    }
}
RNKeyboard.isInitialized = false;
RNKeyboard.callbacks = [];
