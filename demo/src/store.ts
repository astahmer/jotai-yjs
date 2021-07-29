import { stringify } from "@pastable/core";
import { makePresence } from "jotai-yjs";
import { useEffect } from "react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { Player } from "./types";
import { makePlayer } from "./utils";

const yDocId = "jotai-yjs";
const wsUrl = "wss://y.svelt-yjs.dev";

const yDocOptions = { guid: yDocId };
export const yDoc = new Y.Doc(yDocOptions);

const provider = new WebsocketProvider(wsUrl, yDoc.guid, yDoc, {
    connect: false,
});

const getPlayer = (): Player => {
    const player = localStorage.getItem(yDocId + "/player");
    return player ? JSON.parse(player) : makePlayer();
};
const player = getPlayer();
const persistPlayer = (player: Player) => localStorage.setItem(yDocId + "/player", stringify(player));

const addProviderToDoc = () => {
    console.log("connect to a ws provider with room", yDoc.guid);

    provider.connect();
    provider.awareness.setLocalState(player);
    persistPlayer(player);

    return () => {
        console.log("disconnect", yDoc.guid);
        provider.destroy();
    };
};

export const useProviderInit = () => {
    useEffect(() => {
        const unmount = addProviderToDoc();
        return () => unmount();
    }, []);

    return yDoc;
};

export const { useYAwarenessInit, useYAwareness, presenceProxy, usePresence, usePresenceSnap } = makePresence({
    provider,
    initialPresence: player,
    onUpdate: persistPlayer,
});
