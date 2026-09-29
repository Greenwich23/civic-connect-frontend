import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as messageApi from "../apis/messageApi.js";

// ── Inbox (Messages.jsx) ─────────────────────────────────

export function useMyConversations() {
  return useQuery({
    queryKey: ["messages", "conversations"],
    queryFn: async () => {
      const { data } = await messageApi.getMyConversations();
      return data.conversations;
    },
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
  });
}

export function useStartConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => messageApi.startConversation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversations"],
      });
    },
  });
}

// ── Thread (ConversationThread.jsx) ──────────────────────

export function useConversationMessages(conversationId) {
  return useQuery({
    queryKey: ["messages", "conversation", conversationId],
    queryFn: async () => {
      const { data } = await messageApi.getConversationMessages(
        conversationId,
      );
      return data;
    },
    enabled: !!conversationId,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
  });
}

export function useSendMessage(conversationId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) => messageApi.sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversation", conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversations"],
      });
    },
  });
}

export function useReportMessage(conversationId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, reason, details }) =>
      messageApi.reportMessage(messageId, { reason, details }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversation", conversationId],
      });
    },
  });
}
