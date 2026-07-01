import { useState, useCallback } from "react";

export type TabItem = { name: string; id: number; isEdit?: boolean };
export type ActiveTab = { name: string; id?: number };
export type ToggleTabArgs = { name: string; id: number };

const DEFAULT_TABS: TabItem[] = [
  { name: "Tablolar", id: 0 },
  { name: "Silinen Tablolar", id: 0 },
  { name: "İlişkiler", id: 0 },
];

export const useTabState = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>({ name: "Tablolar", id: 0 });
  const [tabs, setTabs] = useState<TabItem[]>(DEFAULT_TABS);

  const toggleTab = useCallback(({ name, id }: { name: string; id: number }) => {
    if (name && activeTab.name !== name) setActiveTab({ name, id });
  }, [activeTab.name]);

  const setTabState = useCallback((id: number, value: boolean) => {
    setTabs(prev =>
      prev.map(tab => tab.id === id ? { ...tab, isEdit: value } : tab)
    );
  }, []);

  return { 
    activeTab, 
    tabs, 
    setTabs, 
    toggleTab, 
    setTabState 
  };
};