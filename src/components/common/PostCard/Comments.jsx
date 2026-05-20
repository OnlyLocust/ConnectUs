"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { ScrollArea } from "../../ui/scroll-area";

const Comments = ({ children, comments }) => {
  const commentsAll = useMemo(() => [...comments].reverse(), [comments]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-64 pr-4">
          <div className="space-y-4 mt-2">
            {commentsAll.length > 0 ? (
              commentsAll.map((comment, index) => (
                <div key={comment._id || index} className="border p-3 rounded-md flex gap-2">
                  <p className="text-sm font-semibold">
                    {comment.author?.username}
                  </p>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No comments yet</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default Comments;
