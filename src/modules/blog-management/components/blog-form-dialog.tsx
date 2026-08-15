"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBlogPostMutation, useUpdateBlogPostMutation } from "@/features/blog/api/blog.api";
import type { BlogPost } from "@/features/blog/types/blog.types";
import { ImageUploadField } from "@/shared/components/image-upload-field";

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Vui lòng nhập nội dung"),
});

type FormValues = z.infer<typeof formSchema>;

export function BlogFormDialog({
  open,
  onOpenChange,
  post,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: BlogPost | null;
}) {
  const isEdit = !!post;
  const [createPost, { isLoading: isCreating }] = useCreateBlogPostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdateBlogPostMutation();
  const isLoading = isCreating || isUpdating;
  const [coverImage, setCoverImage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (open) {
      reset({
        title: post?.title ?? "",
        excerpt: post?.excerpt ?? "",
        content: post?.content ?? "",
      });
      setCoverImage(post?.coverImage ?? "");
    }
  }, [open, post, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      title: values.title,
      excerpt: values.excerpt || undefined,
      content: values.content,
      coverImage: coverImage || undefined,
    };

    if (isEdit && post) {
      await updatePost({ id: post.id, data: payload }).unwrap();
    } else {
      await createPost(payload).unwrap();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa bài viết" : "Thêm bài viết"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="excerpt">Mô tả ngắn</Label>
            <Input id="excerpt" {...register("excerpt")} />
          </div>

          <div className="space-y-1.5">
            <Label>Ảnh bìa</Label>
            <ImageUploadField
              images={coverImage ? [coverImage] : []}
              onChange={(images) => setCoverImage(images[images.length - 1] ?? "")}
              maxImages={1}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea id="content" rows={8} {...register("content")} />
            {errors.content && (
              <p className="text-xs text-destructive">{errors.content.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Huỷ
            </Button>
            <Button type="submit" disabled={isLoading} className="rounded-full">
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
