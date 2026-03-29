import type { CommandContext, Context } from "grammy";
import type { User } from "grammy/types";

export async function handle_report(
  context: CommandContext<Context> & { from: User },
) {
  if (context.chat.type === "private") {
    return context.reply("Данная команда работает только в группах");
  }
  const target = context.message?.reply_to_message?.from;
  if (!target) {
    return context.reply(
      "Вы не выбрали пользователя. Ответьте на сообщение пользователя /report <причина>",
    );
  }
  const reporter = context.from;
  const reason = context.match || "не указана";
  const reportedMessage = context.message?.reply_to_message;
  const reportedMessageText = reportedMessage?.text || "[не текст]";
  const chatTitle = context.chat.title || "группа";
  const reportMessage = `⚠️ *Жалоба на пользователя*\n\nЧат: ${chatTitle}\nОт: @${reporter.username || reporter.first_name}\nНа кого: @${target.username || target.first_name}\nПричина: ${reason}\n\nСообщение: ${reportedMessageText}`;
  const admins = await context.getChatAdministrators();
  const owner = admins.find((admin) => admin.status === "creator");
  if (!owner || owner.user.is_bot) {
    return context.reply("Не удалось найти владельца чата");
  }
  try {
    await context.api.sendMessage(owner.user.id, reportMessage, {
      parse_mode: "MarkdownV2",
    });
    return context.reply("Жалоба отправлена владельцу чата");
  } catch {
    return context.reply("Не удалось отправить жалобу владельцу чата");
  }
}
