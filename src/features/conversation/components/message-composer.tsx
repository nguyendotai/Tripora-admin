"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSendMessageMutation } from "../api/conversation.api";
import { messageSchema, type MessageFormValues } from "../schemas/conversation.schema";

export function MessageComposer({ conversationId }: { conversationId: string }) {
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  const onSubmit = async (values: MessageFormValues) => {
    try {
      await sendMessage({ conversationId, content: values.content }).unwrap();
      reset({ content: "" });
    } catch {
      // loi hien qua state form, khong can toast rieng o day
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-end gap-2 border-t border-border p-4"
    >
      <div className="flex-1">
        <Textarea
          placeholder="Nhập tin nhắn..."
          rows={2}
          {...register("content")}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit(onSubmit)();
            }
          }}
        />
        {errors.content && (
          <p className="mt-1 text-xs text-destructive">{errors.content.message}</p>
        )}
      </div>
      <Button type="submit" size="icon" className="rounded-full" disabled={isLoading}>
        <Send className="h-4 w-4" />
        <span className="sr-only">Gửi</span>
      </Button>
    </form>
  );
}
