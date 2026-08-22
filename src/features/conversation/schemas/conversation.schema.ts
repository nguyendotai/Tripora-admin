import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Vui lòng nhập nội dung tin nhắn")
    .max(2000, "Nội dung tối đa 2000 ký tự"),
});

export type MessageFormValues = z.infer<typeof messageSchema>;
