import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as commentApi from "../apis/commentApi.js";

/*
=========================================================
GET ALL COMMENTS FOR AN ISSUE
=========================================================
*/

export function useComments(issueId) {
  return useQuery({
    queryKey: ["issue", issueId, "comments"],
    queryFn: async () => {
      const data = await commentApi.getComments(issueId);

      return data.comments;
    },
    enabled: !!issueId,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
    placeholderData: (previousData) => previousData,
  });
}

/*
=========================================================
CREATE COMMENT
=========================================================
*/

export function useCreateComment(issueId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) => commentApi.createComment(issueId, content),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["issue", issueId, "comments"],
      });
    },
  });
}

/*
=========================================================
GET SINGLE COMMENT
=========================================================
*/

export function useComment(commentId) {
  return useQuery({
    queryKey: ["comment", commentId],

    queryFn: () => commentApi.getCommentById(commentId),

    enabled: !!commentId,
  });
}

/*
=========================================================
UPDATE COMMENT
=========================================================
*/

export function useUpdateComment(issueId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }) =>
      commentApi.updateComment(commentId, content),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["issue", issueId, "comments"],
      });
    },
  });
}

/*
=========================================================
DELETE COMMENT
=========================================================
*/

export function useDeleteComment(issueId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => commentApi.deleteComment(commentId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["issue", issueId, "comments"],
      });
    },
  });
}

/*
=========================================================
GET COMMENT REPLIES
=========================================================
*/

export function useCommentReplies(commentId) {
  return useQuery({
    queryKey: ["comment", commentId, "replies"],

    queryFn: () => commentApi.getCommentReplies(commentId),

    enabled: !!commentId,
  });
}

/*
=========================================================
REPLY TO COMMENT
=========================================================
*/

export function useReplyToComment(issueId, commentId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) => commentApi.replyToComment(commentId, content),

    onSuccess: () => {
      // Refresh the replies
      queryClient.invalidateQueries({
        queryKey: ["comment", commentId, "replies"],
      });

      // Refresh the issue comments as well
      queryClient.invalidateQueries({
        queryKey: ["issue", issueId, "comments"],
      });
    },
  });
}

/*
=========================================================
REPORT COMMENT
=========================================================
*/

export function useReportComment(issueId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, reason, details }) =>
      commentApi.reportComment(commentId, { reason, details }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["issue", issueId, "comments"],
      });
    },
  });
}

/*
=========================================================
PIN / UNPIN COMMENT
=========================================================
*/

export function usePinComment(issueId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => commentApi.pinComment(commentId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["issue", issueId, "comments"],
      });
    },
  });
}

export function useUnpinComment(issueId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => commentApi.unpinComment(commentId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["issue", issueId, "comments"],
      });
    },
  });
}
