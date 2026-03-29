import type { CommandContext, Context } from "grammy";

export async function handle_report(context: CommandContext<Context>) {
  if (context.chat.type === "private") {
    return context.reply("Данная команда работает только в группах");
  }
  const target = context.message?.reply_to_message?.from;
  if (!target) {
    return context.reply(
      "Вы не выбрали пользователя которого хотите сообщить. Ответьте на сообщение пользователя /report <причина>",
    );
  }
  const reporter = context.from;
  if (!reporter) return;
  const reason = context.match || "не указана";
  const reportedMessage = context.message?.reply_to_message;
  const reportedMessageText = reportedMessage?.text || "[не текст]";
  const reportMessage = `⚠️ *Жалоба на пользователя*\n\nОт: @${reporter.username || reporter.first_name}\nНа кого: @${target.username || target.first_name}\nПричина: ${reason}\n\nСообщение: ${reportedMessageText}`;
  await context.reply(reportMessage, { parse_mode: "MarkdownV2" });
}
