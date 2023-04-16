import { ViewBase, View } from '@nativescript/core';

export function findChild<T extends ViewBase>(
  view: View,
  predicate: (child: ViewBase, index: number) => child is T
): T | undefined {
  let returnValue: ViewBase | undefined = undefined;
  let i = 0;
  view.eachChild((child) => {
    const found = predicate(child, i++);
    if (found) {
      returnValue = child;
    }
    return !found;
  });

  // We can't simply reuse the below findChildIndex() because ViewBase doesn't
  // implement LayoutBase.getChildAt().
  return returnValue;
}

export function findChildIndex<T extends ViewBase>(
  view: View,
  predicate: (child: ViewBase, index: number) => child is T
): number {
  let returnValue: ViewBase | undefined = undefined;
  let i = 0;
  view.eachChild((child) => {
    const found = predicate(child, i++);
    if (found) {
      returnValue = child;
    }
    return !found;
  });

  return returnValue ? i : -1;
}
