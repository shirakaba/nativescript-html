import {
  GestureTypes,
  GestureEventData,
  GesturesObserver,
} from '@nativescript/core';

declare class NSObject {
  static new(): unknown;
  static extend(obj: unknown, options: Record<string, any>): typeof NSObject;
}

declare class UITapGestureRecognizer extends UIGestureRecognizer {
  numberOfTapsRequired: number;
}

interface UIResponder {
  nextResponder: UIResponder | null;
}

declare class UIGestureRecognizer {
  description: string;
  view: UIResponder;
}

declare class UIGestureRecognizerDelegateImpl {
  /**
   * Returns an instance of the class. Not sure how to write it without
   * TypeScript complaining.
   */
  static new(): unknown;
  gestureRecognizerShouldRequireFailureOfGestureRecognizer(
    gestureRecognizer: UIGestureRecognizer,
    otherGestureRecognizer: UIGestureRecognizer
  ): boolean;
}

declare const UIGestureRecognizerDelegate: any;

const _UIGestureRecognizerDelegateImpl = NSObject.extend(
  {
    gestureRecognizerShouldRecognizeSimultaneouslyWithGestureRecognizer:
      function (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        gestureRecognizer: UIGestureRecognizer,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        otherGestureRecognizer: UIGestureRecognizer
      ): boolean {
        return true;
      },

    gestureRecognizerShouldRequireFailureOfGestureRecognizer: function (
      gestureRecognizer: UIGestureRecognizer,
      otherGestureRecognizer: UIGestureRecognizer
    ): boolean {
      // If both gesture recognizers are of type UITapGestureRecognizer & one of
      // them is a doubleTap, we must require a failure.
      if (
        gestureRecognizer instanceof UITapGestureRecognizer &&
        otherGestureRecognizer instanceof UITapGestureRecognizer &&
        otherGestureRecognizer.numberOfTapsRequired === 2
      ) {
        return true;
      }

      // I'm not too sure about this, so leaving it as a note.
      //
      // // When handling recognizers for the same gesture on the same view, let
      // // just one of the recognizers respond (i.e. defer to addEventListener's
      // // ability to accept multiple event listeners for the same event name).
      // if (
      //   gestureRecognizer.view === otherGestureRecognizer.view &&
      //   gestureRecognizer.constructor.name ===
      //     otherGestureRecognizer.constructor.name
      // ) {
      //   // We pick one of the two arbitrarily but deterministically.
      //   return (
      //     gestureRecognizer.description > otherGestureRecognizer.description
      //   );
      // }

      // If common gesture recognizers are in the same responder chain, let the
      // most nested one succeed (i.e. defer to DOM bubbling).
      // TODO: decide how to handle recognizers in the same responder chain with
      // respect to their type (should only identical-type ones be suppressed?).
      if (
        isInResponderChain(otherGestureRecognizer.view, gestureRecognizer.view)
      ) {
        return true;
      }

      return false;
    },
  },
  {
    name: 'UIGestureRecognizerDelegateImpl',
    protocols: [UIGestureRecognizerDelegate],
  }
);

/**
 * Checks whether `targetResponder` is found in the responder chain of
 * `responder`.
 * @example
 *   // A parent will typically be present in the responder chain of a child:
 *   isInResponderChain(child, parent); // true
 *   // A child won't typically be present in the responder chain of a parent:
 *   isInResponderChain(parent, child); // false
 */
function isInResponderChain(
  responder: UIResponder,
  targetResponder: UIResponder
): boolean {
  let nextResponder = responder.nextResponder;
  while (nextResponder) {
    if (nextResponder === targetResponder) {
      return true;
    }

    nextResponder = nextResponder.nextResponder;
  }
  return false;
}

const patchedRecognizerDelegateInstance =
  _UIGestureRecognizerDelegateImpl.new();

declare class GesturesObserverPrivate {
  // iOS-only internal API that happens to be our only (roundabout) entrypoint
  // by which to patch UIGestureRecognizerDelegateImpl which is fileprivate.
  _createRecognizer(
    type: GestureTypes,
    callback?: (args: GestureEventData) => void,
    swipeDirection?: unknown
  ): {
    delegate?: UIGestureRecognizerDelegateImpl;
  };
}

/**
 * We patch UIGestureRecognizerDelegateImpl to cancel gesture recognition when
 * appropriate to ensure that only the most nested gesture recogniser fires.
 */
export function patchGestures(): void {
  const gop = GesturesObserver as unknown as typeof GesturesObserverPrivate;
  const _createRecognizer = gop.prototype._createRecognizer;

  // UIGestureRecognizerDelegateImpl is fileprivate so we run the patch to hook
  // into _createRecognizer, which gives us an indirect way to get at the
  // delegate to alter it.
  gop.prototype._createRecognizer = function (type, callback, swipeDirection) {
    const recognizer = _createRecognizer.call(
      this,
      type,
      callback,
      swipeDirection
    );

    const delegate = recognizer.delegate;
    if (delegate) {
      recognizer.delegate =
        patchedRecognizerDelegateInstance as UIGestureRecognizerDelegateImpl;
      console.log('replaced delegate!');
    }

    return recognizer;
  };
}
