import { useProviderInit } from "@/store";
import { Game } from "@/types";
import { makeGame, makePlayer } from "@/utils";
import { useYArray } from "jotai-yjs";
import { Button, Center, chakra, SimpleGrid, Stack } from "@chakra-ui/react";
import { useSnapshot } from "valtio";

export const Test = () => {
    const yDoc = useProviderInit();
    const gamesSource = useYArray<Game>(yDoc, "games.test");
    const games = useSnapshot(gamesSource);
    const pushTo = () => gamesSource.push(makeGame(makePlayer()));

    return (
        <Stack w="100%">
            <Center flexDir="column" m="8">
                <Button onClick={pushTo}>Add game</Button>
            </Center>
            <SimpleGrid columns={[1, 2, 2, 3, 3, 4]} w="100%" spacing="8">
                {games.map((game, gameIndex) => {
                    return (
                        <Center key={game.id} bgColor="gray.400" w="100%" h="200px" p="15px" rounded={8} pos="relative">
                            <Stack>
                                <chakra.span>
                                    Game: {game.id} ({game.mode})
                                </chakra.span>
                                <Stack>
                                    {game.players.map((player) => (
                                        <chakra.span key={player.id}>
                                            [{player.username} : {player.elo} ELO
                                        </chakra.span>
                                    ))}
                                </Stack>
                                <Button onClick={() => gamesSource[gameIndex].players.push(makePlayer())}>
                                    Add player
                                </Button>
                            </Stack>
                        </Center>
                    );
                })}
            </SimpleGrid>
        </Stack>
    );
};
