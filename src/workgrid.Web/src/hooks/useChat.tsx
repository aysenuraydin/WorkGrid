// src/queries/chatQueries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiClient } from "helpers/api_helper";

const api = () => getApiClient();

interface AttachmentFields {
  attachmentUrl?: string;
  attachmentType?: string;   
  attachmentName?: string;
}

// ── DIRECT ──
export const useSendDirectMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { receiverId: string; messageText?: string } & AttachmentFields) =>
      api().create("/chat/messages", data),   
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["conversation", vars.receiverId] });
      qc.invalidateQueries({ queryKey: ["recentContacts"] });
    },
  });
};

// ── CHANNEL ──
export const useSendChannelMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { channelId: string; messageText?: string } & AttachmentFields) => 
      api().create(`/chat/channels/${data.channelId}/messages`, {
        messageText: data.messageText,
        attachmentUrl: data.attachmentUrl,
        attachmentType: data.attachmentType,
        attachmentName: data.attachmentName,
      }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["channelMessages", vars.channelId] });
    },
  });
};

// ── GROUP ──
export const useSendGroupMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { groupId: string; messageText?: string } & AttachmentFields) =>
      api().create(`/chat/groups/${data.groupId}/messages`, {
        messageText: data.messageText,
        attachmentUrl: data.attachmentUrl,
        attachmentType: data.attachmentType,
        attachmentName: data.attachmentName,
      }),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["groupMessages", vars.groupId] }),
  });
};













// ── Direct Messages ──────────────────────────────────

export const useConversation = (otherUserId: string | null) =>
    useQuery({
        queryKey: ["conversation", otherUserId],
        queryFn: () => api().get(`/chat/messages/${otherUserId}`),
        enabled: !!otherUserId,
        staleTime: 0
});

export const useRecentContacts = () =>
    useQuery({
        queryKey: ["recentContacts"],
        queryFn: () => api().get("/chat/contacts")
}); 

 // ── Channels ─────────────────────────────────────────

export const useChannels = () =>
    useQuery({
        queryKey: ["channels"],
        queryFn: () => api().get("/chat/channels")
});

export const useChannelMessages = (channelId: string | null) =>
    useQuery({
        queryKey: ["channelMessages", channelId],
        queryFn: () => api().get(`/chat/channels/${channelId}/messages`),
        enabled: !!channelId,
        staleTime: 0
});

export const useCreateChannel = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: { name: string }) =>
        api().create("/chat/channels", data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["channels"] })
    });
};

export const useDeleteChannel = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (channelId: string) =>
        api().delete(`/chat/channels/${channelId}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["channels"] })
    });
}; 
export const useAllUsers = () =>
  useQuery({
    queryKey: ["allUsers"],
    queryFn: () => api().get("/user/all")
  });


  export const useMyGroups = () =>
  useQuery({
    queryKey: ["myGroups"],
    queryFn: () => api().get("/chat/groups")
  });

export const useGroupMessages = (groupId: string | null) =>
  useQuery({
    queryKey: ["groupMessages", groupId],
    queryFn: () => api().get(`/chat/groups/${groupId}/messages`),
    enabled: !!groupId,
    staleTime: 0
  });

export const useCreateGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; memberIds: string[] }) =>
      api().create("/chat/groups", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myGroups"] })
  });
};

export const useDeleteGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => api().delete(`/chat/groups/${groupId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myGroups"] })
  });
};

export const useUpdateGroupName = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, name }: { groupId: string; name: string }) =>
      api().put(`/chat/groups/${groupId}/name`, { name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myGroups"] })
  });
};

export const useAddGroupMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      api().create(`/chat/groups/${groupId}/members`, { userId }),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["myGroups"] })
  });
};

export const useRemoveGroupMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      api().delete(`/chat/groups/${groupId}/members/${userId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myGroups"] })
  });
}; 

export const useOnlineUsers = () =>
  useQuery({
    queryKey: ["onlineUsers"],
    queryFn: () => api().get("/chat/presence"),
    refetchInterval: 30000  
  });

export const useMarkAsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (otherUserId: string) =>
      api().create(`/chat/messages/${otherUserId}/read`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversation"] })
  });
};