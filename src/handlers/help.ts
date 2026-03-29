import type { CommandContext, Context } from "grammy";

export function handle_help(context: CommandContext<Context>) {
  const HELP_MESSAGE = `
\`/mute\` \\- Замутить пользователя

\`/unrestrict\` \\- Размутить пользователя

\`/ban\` \\- Забанить пользователя

\`/unban\` \\- Разбанить пользователя
  `;
  return context.reply(HELP_MESSAGE, { parse_mode: "MarkdownV2" });
}

export function handle_rights(context: CommandContext<Context>) {
  const RIGHTS_MESSAGE = `
*Необходимые права*

• Удаление сообщений
• Блокировка пользователей
  `;
  return context.reply(RIGHTS_MESSAGE, { parse_mode: "MarkdownV2" });
}
