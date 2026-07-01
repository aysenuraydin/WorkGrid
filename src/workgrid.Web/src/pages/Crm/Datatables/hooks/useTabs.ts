import { useEffect } from "react";
import { toast } from "react-toastify";
import { ActiveTab, TabItem, ToggleTabArgs } from "./useTabState";

export const useTabs = (
    activeTab: ActiveTab, 
    setTabState: (id?: number, isEdit?: boolean) => void, 
    tabs: TabItem[], 
    toggleTab: (args: ToggleTabArgs) => void, 
    setTabs: React.Dispatch<React.SetStateAction<TabItem[]>> 
) => {
    useEffect(() => {
        const listener = (e: KeyboardEvent) => handleSaveShortcut(e, activeTab);

        window.addEventListener("keydown", listener);
        return () => window.removeEventListener("keydown", listener);
    }, [activeTab]);

    const handleSaveShortcut = (
            e: KeyboardEvent,
            activeTab: { id?: number; name: string } | undefined
        ) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
                e.preventDefault();
                if (activeTab?.id != null) {
                    setTabState(activeTab.id, false); 
                    toast.success("Tablo başarıyla kaydedildi!");
                }
            }
    };

    const changeTabs = (id: number) => {
        if (id && id > 0) {
            toggleTab({ name: "Tablolar", id: 0 });
            setTabs((prev: TabItem[]) => prev?.filter(t => t.id !== id));
        }
    }

    return { changeTabs };
}