# jotai-yjs 💊🚀

jotai-yjs makes yjs state [even easier](https://github.com/dai-shi/valtio-yjs)

## What is this

[valtio](https://github.com/pmndrs/valtio) is
a proxy state library for ReactJS and VanillaJS.
[yjs](https://github.com/yjs/yjs) is
an implmentation of CRDT algorithm. [jotai](https://github.com/pmndrs/jotai) is a primitive and flexible state management for React.

jotai-yjs is a three-way binding to bridge them. Typescript ready btw.

## Project status

It started as an experiment, and the experiment is finished.
Now, it's in alpha.

## Install

```bash
yarn add react jotai-yjs jotai valtio valtio-yjs yjs
```

## How to use it

```ts
import * as Y from "yjs";
import { useYArray, useYMap } from "jotai-yjs";

// create a new Y doc
const ydoc = new Y.Doc();

// useYArray & useYMap returns the proxy source so that you can mutate it directly thanks to valtio-yjs
const settings = useYMap<Settings>(yDoc, "settings");

// here we're creating a proxy array (thanks to valtio-yjs) available globally (thanks to jotai) through its name, "games", attached to the yDoc we created earlier
const gamesSource = useYArray<Game>(yDoc, "games");

// and here you can get the snapshot to read from it, as per the valtio docs https://github.com/pmndrs/valtio#react-via-usesnapshot
const games = useSnapshot(gamesSource);

// you can do anything you could do with valtio here with those
```

# Adding a provider

> Currently, I only tried it with a WebsocketProvider but as long as the provider as an `awareness` property it should work the same.

```ts
// [optional] create a provider
const provider = new WebsocketProvider(wsUrl, yDoc.guid, yDoc, { connect: false });

// here we're creating an init function that should be called only once in the hook below
const addProviderToDoc = () => {
    console.log("connect to a ws provider with room", yDoc.guid);

    provider.connect();
    // do what/ever you want with that provider here

    return () => {
        console.log("disconnect", yDoc.guid);
        provider.destroy();
    };
};

// very basic hook which purpose is to connect the provider to the server
export const useProviderInit = () => {
    useEffect(() => {
        const unmount = addProviderToDoc();
        return () => unmount();
    }, []);

    return yDoc;
};
```

# Presence

Using hooks, you get access to what I call your `presence`, which is the current user local awareness state in YJS terms.
It is used like a `useState`, as simple as :

```ts
const [presence, setPresence] = usePresence();
```

But that `usePresence` hook doesn't come straight from `jotai-yjs`, it comes from you !

You can create it using the `makePresence` function and passing your custom arguments.

```ts
import { makePresence } from "jotai-yjs";

// provider could be the WebsocketProvider that we created earlier
// initialPresence is the object to use as the initial local awareness state, aka presence
// onUpdate is an optional function that is called whenever the presence is updated and takes the current presence as argument,

// here, persistPlayer could be an action like persisting the presence to localStorage
export const { useYAwarenessInit, useYAwareness, presenceProxy, usePresence, usePresenceSnap } = makePresence({
    provider,
    initialPresence: player,
    onUpdate: persistPlayer,
});
```

Inspired by [`zustand`](https://github.com/pmndrs/zustand) hook store.

Quite a lot coming from that `makePresence` return ! Let's see what comes from it:

-   `useYAwarenessInit`: hook to init the provider, basically it syncs an atom with each updates from the [`awareness`](https://docs.yjs.dev/getting-started/adding-awareness) service
-   `useYAwareness`: returns the resulting `awareness` state set by`useYAwarenessInit`
-   `presenceProxy`: the actual proxy source created by `valtio`
-   `usePresence`: we talked about that one already [here](#presence)
-   `usePresenceSnap`: just a shortcut, it's basically `const usePresenceSnap = () => useSnapshot(presenceProxy);`

And since all of these hooks were created by **YOU**, you don't need to pass any arguments ! You did that already when you used `makePresence` so everything will be deduced from here.

## Demos

> you can check the [demo app in the repository](./demo/src/pages/Demo.tsx) made with [this template](https://github.com/astahmer/vite-chakra)

Using `usePresence` and
`WebsocketProvider` in [y-websocket](https://github.com/yjs/y-websocket),
we can create multi-client React apps pretty easily.

-   https://codesandbox.io/s/github/astahmer/jotai-yjs/tree/main/demo
-   (...open a PR to add your demos)

# Notes

Huge thanks to [Daishi Kato](https://twitter.com/dai_shi) for everything he does.
I copy/pasted valtio-yjs README and changed a few things to make this one so this might look familiar.
