import type { Context } from "grammy";
import type { Chat, Message, User } from "grammy/types";

function containsSwear(text: string) {
  return text.includes("\u0445\u0443\u0439");
}

function getUserDisplayName(user: User): string {
  return user.username ? `@${user.username}` : user.first_name;
}

function handleMessage(
  context: Context & { chat: Chat; from: User; message: Message.TextMessage },
) {
  if (context.chat.type === "private") return;
  if (containsSwear(context.message.text)) {
    context.deleteMessage();
    context.reply(`Не ругаемся, ${getUserDisplayName(context.from)}`);
  }
}

export { handleMessage };
