import type { CommandContext, Context } from "grammy";
import type { User } from "grammy/types";

import { escapeMarkdownV2 } from "#lib/escape-markdown";

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

  const from = escapeMarkdownV2(reporter.username || reporter.first_name);
  const targetName = escapeMarkdownV2(target.username || target.first_name);

  const reason = escapeMarkdownV2(context.match) || "не указана";
  const reportedMessage = context.message?.reply_to_message;
  const reportedMessageText = escapeMarkdownV2(
    reportedMessage?.text || "[не текст]",
  );
  const chatTitle = escapeMarkdownV2(context.chat.title) || "группа";

  const reportMessage = `\
⚠️ *Жалоба на пользователя*

Чат: ${chatTitle}
От: @${from}
На кого: @${targetName}
Причина: ${reason}

Сообщение: ${reportedMessageText}`;

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
