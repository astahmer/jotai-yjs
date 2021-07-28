import { ObjectLiteral, SetState } from "@pastable/core";
import { atom, useAtom } from "jotai";
import { atomFamily, useAtomValue, useUpdateAtom } from "jotai/utils";
import { atomWithProxy } from "jotai/valtio";
import { useEffect } from "react";
import { proxy, useSnapshot } from "valtio";
import { bindProxyAndYArray, bindProxyAndYMap } from "valtio-yjs";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

const yAwarenessAtomFamily = atomFamily(
    (provider: WebsocketProvider) => atom(getStatesMap(provider)),
    (a, b) => a.doc.guid === b.doc.guid
);

// type StatesMap = ReturnType<WebsocketProvider["awareness"]["getStates"]>;
const getStatesMap = (provider: WebsocketProvider) => new Map(provider.awareness.getStates());

const yPresenceAtomFamily = atomFamily(
    ({ presenceProxy }: { provider: WebsocketProvider; presenceProxy: any }) => atomWithProxy(presenceProxy),
    (a, b) => a.provider.doc.guid === b.provider.doc.guid
);

export const makePresence = <Value extends ObjectLiteral>({
    provider,
    initialPresence,
    onUpdate,
}: {
    provider: WebsocketProvider;
    initialPresence: Value;
    onUpdate?: (presence: Value) => void;
}) => {
    const useYAwarenessInit = () => {
        const setAwareness = useUpdateAtom(yAwarenessAtomFamily(provider));

        useEffect(() => {
            const update = () => setAwareness(getStatesMap(provider));

            update();
            provider.awareness.on("update", update);

            return () => provider.awareness.destroy();
        }, []);
    };
    const useYAwareness = () => useAtomValue(yAwarenessAtomFamily(provider)) as Map<number, Value>;

    const presenceProxy = proxy(initialPresence);
    const usePresence = () => {
        const [presence, setPresence] = useAtom(yPresenceAtomFamily({ provider, presenceProxy }));
        const setAwareness: SetState<Value> = (state) => {
            const update = typeof state === "function" ? state(presence) : state;
            provider.awareness.setLocalState(update);
            setPresence(update);
            onUpdate?.(update);
        };

        return [presenceProxy, setAwareness] as const;
    };
    const usePresenceSnap = () => useSnapshot(presenceProxy);

    return { useYAwarenessInit, useYAwareness, presenceProxy, usePresence, usePresenceSnap };
};

const yArrayAtomFamily = atomFamily(
    ({ defaultValue }: { name: string; defaultValue: any[] }) => atom(proxy(defaultValue)),
    (a, b) => a.name === b.name
);
export function useYArray<T = any>(yDoc: Y.Doc, name: string): Array<T> {
    const yArray = yDoc.getArray<T>(name);
    const defaultValue = yArray.toArray() as Array<T>;
    const source = useAtomValue(yArrayAtomFamily({ name, defaultValue }));

    useEffect(() => {
        bindProxyAndYArray(source, yArray);
    }, []);

    return source;
}

const yMapAtomFamily = atomFamily(
    ({ defaultValue }: { name: string; defaultValue: ObjectLiteral }) => atom(proxy(defaultValue)),
    (a, b) => a.name === b.name
);
export function useYMap<T extends ObjectLiteral = ObjectLiteral>(yDoc: Y.Doc, name: string): T {
    const yMap = yDoc.getMap(name) as Y.Map<T>;
    const defaultValue = yMap.toJSON() as T;
    const source = useAtomValue(yMapAtomFamily({ name, defaultValue }));

    useEffect(() => {
        bindProxyAndYMap(source, yMap);
    }, []);

    return source as T;
}
