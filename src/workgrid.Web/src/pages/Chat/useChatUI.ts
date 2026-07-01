import { useState, useRef } from "react";

export type ChatMode = "direct" | "channel" | "group";

export const useChatUI = () => {
  const [customActiveTab, setCustomActiveTab] = useState("1");
  const [chatMode, setChatMode] = useState<ChatMode>("direct");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(undefined);
  const [curMessage, setCurMessage] = useState("");
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [isInfoDetails, setIsInfoDetails] = useState(false);

  // Group editing
  const [editingGroupName, setEditingGroupName] = useState(false);
  const [tempGroupName, setTempGroupName] = useState("");

  // Modals
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [createChannelOpen, setCreateChannelOpen] = useState(false);
  const [manageMembersOpen, setManageMembersOpen] = useState(false);

  // New group form
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupMembers, setNewGroupMembers] = useState<string[]>([]);
  const [newChannelName, setNewChannelName] = useState("");

  const userChatShow = useRef<HTMLDivElement>(null);

  const openUserChat = (userId: string, name: string, avatar?: string, onMarkRead?: (id: string) => void) => {
    setChatMode("direct");
    setSelectedUserId(userId);
    setSelectedName(name);
    setSelectedAvatar(avatar);
    onMarkRead?.(userId);
    if (window.innerWidth < 892)
      userChatShow.current?.classList.add("user-chat-show");
  };

  const openChannelChat = (channelId: string, name: string) => {
    setChatMode("channel");
    setSelectedChannelId(channelId);
    setSelectedName(name);
    setSelectedAvatar(undefined);
    if (window.innerWidth < 892)
      userChatShow.current?.classList.add("user-chat-show");
  };

  const openGroupChat = (groupId: string, name: string) => {
    setChatMode("group");
    setSelectedGroupId(groupId);
    setSelectedName(name);
    setSelectedAvatar(undefined);
    if (window.innerWidth < 892)
      userChatShow.current?.classList.add("user-chat-show");
  };

  const resetGroupForm = () => {
    setNewGroupName("");
    setNewGroupMembers([]);
  };

  return {
    // Tab
    customActiveTab, setCustomActiveTab,
    // Chat mode & selections
    chatMode,
    selectedUserId, selectedChannelId, selectedGroupId,
    selectedName, setSelectedName,
    selectedAvatar,
    // Message input
    curMessage, setCurMessage,
    emojiPicker, setEmojiPicker,
    // Info panel
    isInfoDetails, setIsInfoDetails,
    // Group editing
    editingGroupName, setEditingGroupName,
    tempGroupName, setTempGroupName,
    // Modals
    createGroupOpen, setCreateGroupOpen,
    createChannelOpen, setCreateChannelOpen,
    manageMembersOpen, setManageMembersOpen,
    // New forms
    newGroupName, setNewGroupName,
    newGroupMembers, setNewGroupMembers,
    newChannelName, setNewChannelName,
    resetGroupForm,
    // Ref
    userChatShow,
    // Actions
    openUserChat,
    openChannelChat,
    openGroupChat,
  };
};
