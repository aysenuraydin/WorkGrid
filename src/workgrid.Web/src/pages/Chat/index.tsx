// src/pages/Chat/index.tsx
import React, { useMemo, useEffect, useState } from "react";
import { Container } from "reactstrap";
import { toast } from "react-toastify";
import { useAuth } from "context/AuthContext";
import { useChat } from "context/ChatContext";
import {
  useAllUsers, useChannels, useChannelMessages, useRecentContacts,
  useConversation, useSendDirectMessage, useSendChannelMessage,
  useCreateChannel, useDeleteChannel,
  useMyGroups, useGroupMessages, useCreateGroup, useDeleteGroup,
  useUpdateGroupName, useAddGroupMember, useRemoveGroupMember,
  useSendGroupMessage, useOnlineUsers, useMarkAsRead,
} from "hooks/useChat"; 
import ChatSidebar from "./ChatSidebar";
import ChatTopbar from "./ChatTopbar";
import ChatMessages from "./ChatMessages";
import ChatInput, { PendingAttachment } from "./ChatInput";
import CreateGroupModal from "./CreateGroupModal";
import CreateChannelModal from "./CreateChannelModal";
import ManageMembersModal from "./ManageMembersModal";
import { useChatUI } from "./useChatUI";
import PersonalInfo from "./PersonalInfo"; 
import { useGetBrand } from "hooks/useBrand";
import { useUploadFile } from "hooks/useFiles";

const Chat = () => {
  const { user } = useAuth();
  const {
    connection,
    directMessages: realtimeDMs,
    channelMessages: realtimeCMs,
    groupMessages: realtimeGMs,
    onlineUserIds,
    readReceipts,
  } = useChat();

  const isAdmin = user?.roles?.includes("Admin") ?? false;

  // ── Veriler (Queries) ──
  const { data: allUsers = [] } = useAllUsers();
  const { data: contacts = [] } = useRecentContacts();
  const { data: channels = [] } = useChannels();
  const { data: myGroups = [] } = useMyGroups();
  const { data: onlineUsersData = [] } = useOnlineUsers();

  const ui = useChatUI();

  const { data: conversationData = [] } = useConversation(
    ui.chatMode === "direct" ? ui.selectedUserId : null
  );
  const { data: channelMsgData = [] } = useChannelMessages(
    ui.chatMode === "channel" ? ui.selectedChannelId : null
  );
  const { data: groupMsgData = [] } = useGroupMessages(
    ui.chatMode === "group" ? ui.selectedGroupId : null
  );

  // ── İşlemler (Mutations) ──
  const sendDM = useSendDirectMessage();
  const sendCM = useSendChannelMessage();
  const sendGM = useSendGroupMessage();
  const createChannel = useCreateChannel();
  const deleteChannel = useDeleteChannel();
  const createGroup = useCreateGroup();
  const deleteGroup = useDeleteGroup();
  const updateGroupName = useUpdateGroupName();
  const addMember = useAddGroupMember();
  const removeMember = useRemoveGroupMember();
  const markAsRead = useMarkAsRead();

  useEffect(() => {
    if (!connection || ui.chatMode !== "group" || !ui.selectedGroupId) return;
    connection.invoke("JoinGroup", ui.selectedGroupId).catch(console.error);
    return () => { connection.invoke("LeaveGroup", ui.selectedGroupId).catch(console.error); };
  }, [connection, ui.chatMode, ui.selectedGroupId]);

  const directMsgs = [...conversationData, ...(realtimeDMs[ui.selectedUserId ?? ""] ?? []).filter((rt: any) => !conversationData.find((m: any) => m.id === rt.id))];
  const channelMsgs = [...channelMsgData, ...(realtimeCMs[ui.selectedChannelId ?? ""] ?? []).filter((rt: any) => !channelMsgData.find((m: any) => m.id === rt.id))];
  const groupMsgs = [...groupMsgData, ...(realtimeGMs[ui.selectedGroupId ?? ""] ?? []).filter((rt: any) => !groupMsgData.find((m: any) => m.id === rt.id))];
  
  const activeMessages = ui.chatMode === "direct" ? directMsgs : ui.chatMode === "channel" ? channelMsgs : groupMsgs;

  const onlineSet = useMemo(() => {
    const set = new Set<string>();
    if (Array.isArray(onlineUsersData)) onlineUsersData.forEach((id: string) => set.add(id));
    onlineUserIds.forEach(id => set.add(id));
    return set;
  }, [onlineUsersData, onlineUserIds]);

  const activeGroup = myGroups.find((g: any) => g.id === ui.selectedGroupId);
  const isGroupAdmin = activeGroup?.members?.find((m: any) => m.userId === user?.id)?.isAdmin ?? false;
 
  const { mutateAsync: uploadFile } = useUploadFile();
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (attachment?: PendingAttachment) => {
    if (!ui.curMessage.trim() && !attachment) return;

    setIsSending(true);
    try {
      let attachmentUrl, attachmentType, attachmentName;

      if (attachment) {
        attachmentUrl = await uploadFile(attachment.file); 
        attachmentType = attachment.type;                  
        attachmentName = attachment.file.name;             
      }

      const text = ui.curMessage.trim() || undefined;

      if (ui.chatMode === "direct" && ui.selectedUserId)
        await sendDM.mutateAsync({ receiverId: ui.selectedUserId, messageText: text ?? "", attachmentUrl, attachmentType, attachmentName });
      else if (ui.chatMode === "channel" && ui.selectedChannelId)
        await sendCM.mutateAsync({ channelId: ui.selectedChannelId, messageText: text ?? "", attachmentUrl, attachmentType, attachmentName });
      else if (ui.chatMode === "group" && ui.selectedGroupId)
        await sendGM.mutateAsync({ groupId: ui.selectedGroupId, messageText: text ?? "", attachmentUrl, attachmentType, attachmentName });

      ui.setCurMessage("");
      ui.setEmojiPicker(false);
    } catch (e) {
      toast.error("Mesaj gönderilemedi, lütfen tekrar deneyin.");
    } finally {
      setIsSending(false);
    }
  }; 

  const handleCreateChannel = async () => {
    if (!ui.newChannelName.trim()) return;
    await createChannel.mutateAsync({ name: ui.newChannelName });
    toast.success("Kanal başarıyla oluşturuldu.");
    ui.setNewChannelName("");
  };

  const handleCreateGroup = async () => {
    if (!ui.newGroupName.trim()) return;
    await createGroup.mutateAsync({ name: ui.newGroupName, memberIds: ui.newGroupMembers });
    toast.success("Grup başarıyla oluşturuldu.");
    ui.resetGroupForm();
    ui.setCreateGroupOpen(false);
  };

  const handleSaveGroupName = async () => {
    await updateGroupName.mutateAsync({ groupId: ui.selectedGroupId!, name: ui.tempGroupName });
    toast.success("Grup adı güncellendi.");
    ui.setSelectedName(ui.tempGroupName);
    ui.setEditingGroupName(false);
  };

  const canSendInChannel = ui.chatMode !== "channel" || isAdmin;

  const { data: brand } = useGetBrand();
  document.title = "Sohbet | " + (brand?.companyName || "Workgrid");

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
            <ChatSidebar
              customActiveTab={ui.customActiveTab}
              setCustomActiveTab={ui.setCustomActiveTab}
              contacts={contacts}
              channels={channels}
              myGroups={myGroups}
              allUsers={allUsers}
              onlineSet={onlineSet}
              isAdmin={isAdmin}
              currentUserId={user?.id ?? ""}
              chatMode={ui.chatMode}
              selectedUserId={ui.selectedUserId}
              selectedChannelId={ui.selectedChannelId}
              selectedGroupId={ui.selectedGroupId}
              onUserClick={(id, name, avatar) => ui.openUserChat(id, name, avatar, (uid: any) => markAsRead.mutate(uid))}
              onChannelClick={ui.openChannelChat}
              onGroupClick={ui.openGroupChat}
              onDeleteChannel={(id) => { deleteChannel.mutate(id); toast.info("Kanal silindi."); }}
              onCreateGroupOpen={() => ui.setCreateGroupOpen(true)}
              onCreateChannelOpen={() => ui.setCreateChannelOpen(true)}
            />

            <div className="user-chat w-100 overflow-hidden border" ref={ui.userChatShow}>
              <div className="chat-content d-lg-flex">
                <div className="w-100 overflow-hidden position-relative">
                  <div className="position-relative">
                    <ChatTopbar
                      chatMode={ui.chatMode}
                      selectedName={ui.selectedName}
                      selectedAvatar={ui.selectedAvatar}
                      selectedUserId={ui.selectedUserId}
                      activeGroup={activeGroup}
                      isGroupAdmin={isGroupAdmin}
                      onlineSet={onlineSet}
                      isAdmin={isAdmin}
                      onBack={() => ui.userChatShow.current?.classList.remove("user-chat-show")}
                      editingGroupName={ui.editingGroupName}
                      tempGroupName={ui.tempGroupName}
                      setTempGroupName={ui.setTempGroupName}
                      onStartEditGroupName={() => { ui.setTempGroupName(ui.selectedName); ui.setEditingGroupName(true); }}
                      onSaveGroupName={handleSaveGroupName}
                      onCancelEditGroupName={() => ui.setEditingGroupName(false)}
                      onManageMembers={() => ui.setManageMembersOpen(true)}
                      onDeleteGroup={() => { deleteGroup.mutate(ui.selectedGroupId!); toast.info("Grup silindi."); }}
                    />
                    <ChatMessages messages={activeMessages} currentUserId={user?.id ?? ""} chatMode={ui.chatMode} readReceipts={readReceipts} />
                    <ChatInput curMessage={ui.curMessage} setCurMessage={ui.setCurMessage} emojiPicker={ui.emojiPicker} setEmojiPicker={ui.setEmojiPicker} onSend={handleSend} canSend={canSendInChannel} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <CreateGroupModal isOpen={ui.createGroupOpen} toggle={() => ui.setCreateGroupOpen(false)} allUsers={allUsers} currentUserId={user?.id ?? ""} newGroupName={ui.newGroupName} setNewGroupName={ui.setNewGroupName} newGroupMembers={ui.newGroupMembers} setNewGroupMembers={ui.setNewGroupMembers} onSubmit={handleCreateGroup} onCancel={() => { ui.resetGroupForm(); ui.setCreateGroupOpen(false); }} />
      {isAdmin && <CreateChannelModal isOpen={ui.createChannelOpen} toggle={() => ui.setCreateChannelOpen(false)} newChannelName={ui.newChannelName} setNewChannelName={ui.setNewChannelName} onSubmit={handleCreateChannel} />}
      {ui.chatMode === "group" && isGroupAdmin && activeGroup && <ManageMembersModal isOpen={ui.manageMembersOpen} toggle={() => ui.setManageMembersOpen(false)} activeGroup={activeGroup} allUsers={allUsers} selectedGroupId={ui.selectedGroupId!} onAddMember={addMember.mutate} onRemoveMember={removeMember.mutate} />}
      <PersonalInfo show={ui.isInfoDetails} onCloseClick={() => ui.setIsInfoDetails(false)} currentuser={ui.selectedName} cuurentiseImg={ui.selectedAvatar} />
    </React.Fragment>
  );
};

export default Chat;