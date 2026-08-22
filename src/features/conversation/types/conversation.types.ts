export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  providerId: string;
  lastMessageAt: string;
  createdAt: string;
  user: { id: string; firstName: string | null; lastName: string | null; avatar: string | null };
  lastMessage: Message | null;
  unreadCount: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedMessages {
  items: Message[];
  pagination: PaginationMeta;
}
