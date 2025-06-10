import { Textarea } from "@/components/ui/textarea";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import React from "react";

const CaptionInput = ({
  caption,
  showEmojiPicker,
  captionRef,
  setCaption,
  setShowEmojiPicker,
}) => {
  const onEmojiClick = (emojiData) => {
    const cursorPosition = captionRef.current?.selectionStart || 0;
    const textBefore = caption.substring(0, cursorPosition);
    const textAfter = caption.substring(cursorPosition);
    setCaption(textBefore + emojiData.emoji + textAfter);
    setShowEmojiPicker(false);
  };

  return (
    <div className="relative">
      <Textarea
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={3}
        className="resize-none pr-10"
        ref={captionRef}
      />
      <button
        type="button"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="absolute right-2 bottom-2 text-gray-400 hover:text-gray-600"
      >
        <Smile className="h-5 w-5" />
      </button>
      {showEmojiPicker && (
        <div className="absolute right-0 bottom-12 z-10">
          <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={350} />
        </div>
      )}
    </div>
  );
};

export default CaptionInput;
