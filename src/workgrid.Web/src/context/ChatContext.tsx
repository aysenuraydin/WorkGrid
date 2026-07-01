import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "./AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useOnlineUsers } from "hooks/useChat";

interface IncomingMessage {
    id?: string;
    senderId: string;
    senderName?: string;
    senderAvatar?: string;
    receiverId?: string;
    channelId?: string;
    groupId?: string;
    messageText?: string;
    sentAt: string;
    attachmentUrl?: string;
    attachmentType?: string;
    attachmentName?: string;
}
interface ChatContextType {
    connection: signalR.HubConnection | null;
    isConnected: boolean;
    directMessages: Record<string, IncomingMessage[]>;
    channelMessages: Record<string, IncomingMessage[]>;
    groupMessages: Record<string, IncomingMessage[]>;
    onlineUserIds: Set<string>;
    readReceipts: Record<string, string>;
    appendDirectMessage: (otherUserId: string, msg: IncomingMessage) => void;
    appendChannelMessage: (channelId: string, msg: IncomingMessage) => void;
    appendGroupMessage: (groupId: string, msg: IncomingMessage) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const { accessToken } = useAuth();
    const qc = useQueryClient();
    const [isConnected, setIsConnected] = useState(false);
    const [directMessages, setDirectMessages] = useState<Record<string, IncomingMessage[]>>({});
    const [channelMessages, setChannelMessages] = useState<Record<string, IncomingMessage[]>>({});
    const [groupMessages, setGroupMessages] = useState<Record<string, IncomingMessage[]>>({});
    const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
    const [readReceipts, setReadReceipts] = useState<Record<string, string>>({});

    const connectionRef = useRef<signalR.HubConnection | null>(null);

    const appendDirectMessage = (otherUserId: string, msg: IncomingMessage) =>
        setDirectMessages(prev => ({ ...prev, [otherUserId]: [...(prev[otherUserId] ?? []), msg] }));
    const appendChannelMessage = (channelId: string, msg: IncomingMessage) =>
        setChannelMessages(prev => ({ ...prev, [channelId]: [...(prev[channelId] ?? []), msg] }));
    const appendGroupMessage = (groupId: string, msg: IncomingMessage) =>
        setGroupMessages(prev => ({ ...prev, [groupId]: [...(prev[groupId] ?? []), msg] }));

    useEffect(() => {
        if (!accessToken) return;

        const conn = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5222/hubs/chat", { accessTokenFactory: () => accessToken })
            .withAutomaticReconnect()
            .build();

        conn.on("ReceiveDirectMessage", (msg: IncomingMessage) => appendDirectMessage(msg.senderId, msg));
        conn.on("ReceiveChannelMessage", (msg: IncomingMessage) => appendChannelMessage(msg.channelId!, msg));
        conn.on("ReceiveGroupMessage", (msg: IncomingMessage) => appendGroupMessage(msg.groupId!, msg));

        conn.on("AddedToGroup", () => qc.invalidateQueries({ queryKey: ["myGroups"] }));
        conn.on("RemovedFromGroup", () => qc.invalidateQueries({ queryKey: ["myGroups"] }));
        conn.on("GroupDeleted", () => qc.invalidateQueries({ queryKey: ["myGroups"] }));
        conn.on("GroupRenamed", () => qc.invalidateQueries({ queryKey: ["myGroups"] }));

        // ── ONLINE/OFFLINE (delta) ──
        conn.on("UserOnline", (userId: string) => {
            setOnlineUserIds(prev => new Set(prev).add(userId));
        });
        conn.on("UserOffline", (userId: string) => {
            setOnlineUserIds(prev => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        });

        conn.on("MessageRead", ({ messageId, readBy }: { messageId: string; readBy: string }) => {
            setReadReceipts(prev => ({ ...prev, [messageId]: readBy }));
        });
        conn.on("MessagesRead", ({ readBy, messageIds }: { readBy: string; messageIds?: string[] }) => {
            if (messageIds?.length) {
                setReadReceipts(prev => {
                    const next = { ...prev };
                    messageIds.forEach(id => { next[id] = readBy; });
                    return next;
                });
            }
            qc.invalidateQueries({ queryKey: ["conversation"] });
        });

        conn.start()
            .then(async () => {
                setIsConnected(true);
                try {
                    const online = await useOnlineUsers(); 
                    if (Array.isArray(online)) setOnlineUserIds(new Set(online));
                } catch (e) { console.error("presence seed failed", e); }
            })
            .catch(console.error);

        connectionRef.current = conn;
        return () => { conn.stop(); };
    }, [accessToken]);

    return (
        <ChatContext.Provider value={{
            connection: connectionRef.current,
            isConnected,
            directMessages, channelMessages, groupMessages,
            appendDirectMessage, appendChannelMessage, appendGroupMessage,
            onlineUserIds, readReceipts,
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useChat must be used within ChatProvider");
    return ctx;
};