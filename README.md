# NativeScript HTML

HTML (and various other web platform features) for NativeScript!

- [happy-dom](https://github.com/capricorn86/happy-dom), an alternative to JSDOM provides the runtime. So we get DOM, HTML, and a bunch of other things.
- We apply various patches to make things like the Events/Gestures agree with HTML's event model (e.g. dispatch CustomEvents to a target instead of notifying a single receiver).
- We wrap up NativeScript UI elements in HTMLElements.

More information to come!
