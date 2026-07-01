import { RELATIONSHIP_STORAGE, RELATIONSHIP_VIEW_STATE } from "helpers/storage_helper";
import { Dispatch, SetStateAction } from "react";
import { RelationshipTable } from "./useRelationships";

export const DEFAULT_POSITIONS = [{"id":1,"isSeen":true,"isOpen":true,"zIndex":10917,"x":26,"y":1187},{"id":2,"isSeen":true,"isOpen":true,"zIndex":10918,"x":431,"y":904},{"id":3,"isSeen":true,"isOpen":true,"zIndex":10916,"x":0,"y":831},{"id":4,"isSeen":true,"isOpen":true,"zIndex":10904,"x":1011,"y":1334},{"id":5,"isSeen":true,"isOpen":true,"zIndex":10881,"x":1449,"y":579},{"id":6,"isSeen":true,"isOpen":true,"zIndex":10901,"x":1804,"y":21},{"id":7,"isSeen":true,"isOpen":true,"zIndex":10896,"x":1198,"y":57},{"id":8,"isSeen":true,"isOpen":true,"zIndex":10897,"x":669,"y":90},{"id":9,"isSeen":true,"isOpen":true,"zIndex":10889,"x":2024,"y":1482},{"id":10,"isSeen":true,"isOpen":true,"zIndex":10891,"x":1579,"y":1619},{"id":11,"isSeen":true,"isOpen":true,"zIndex":10880,"x":1865,"y":924},{"id":12,"isSeen":true,"isOpen":true,"zIndex":10907,"x":2633,"y":988},{"id":13,"isSeen":true,"isOpen":true,"zIndex":10885,"x":1824,"y":291},{"id":14,"isSeen":true,"isOpen":true,"zIndex":10886,"x":1014,"y":451},{"id":15,"isSeen":true,"isOpen":true,"zIndex":10887,"x":1014,"y":913},{"id":16,"isSeen":true,"isOpen":true,"zIndex":10875,"x":3117,"y":0},{"id":17,"isSeen":true,"isOpen":true,"zIndex":10877,"x":2634,"y":59},{"id":18,"isSeen":true,"isOpen":true,"zIndex":10878,"x":2235,"y":439},{"id":19,"isSeen":true,"isOpen":true,"zIndex":10906,"x":3041,"y":668},{"id":20,"isSeen":false,"isOpen":false,"zIndex":9999,"x":0,"y":0}];

const DEFAULT_POSITIONS_MAP = Object.fromEntries(DEFAULT_POSITIONS.map(p => [p.id, p]));

export const useResetPositions = (
    setTableList: Dispatch<SetStateAction<Record<number, RelationshipTable>>>
) => {
    const resetPositions = () => {
        setTableList(prev => {
            const updated: Record<number, RelationshipTable> = {};

            Object.values(prev).forEach((t) => {
                const def = DEFAULT_POSITIONS_MAP[t.id!];
                updated[t.id!] = {
                    ...t,
                    x: def?.x ?? 0,
                    y: def?.y ?? 0,
                    isSeen: def?.isSeen ?? false,
                    isOpen: def?.isOpen ?? false,
                    zIndex: def?.zIndex ?? 1000,
                };
            });

            localStorage.setItem(
                RELATIONSHIP_STORAGE,
                JSON.stringify(
                    Object.values(updated).map((t: RelationshipTable) => ({
                        id: t.id!,
                        isSeen: t.isSeen,
                        isOpen: t.isOpen,
                        zIndex: t.zIndex,
                        x: t.x,
                        y: t.y,
                    }))
                )
            );

            return updated;
        });
    };

    return { resetPositions };
};