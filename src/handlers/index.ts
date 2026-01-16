import type { CommandContext, Context } from "grammy";

import { InlineKeyboard } from "grammy";

export function handle_start(context: CommandContext<Context>) {
  if (!context.match) {
    const reply_markup = new InlineKeyboard().url(
      "Добавить в группу",
      `https://t.me/${context.me.username}?startgroup=addedtogroup&admin=delete_messages+restrict_members`,
    );
    return context.reply("Этот бот помогает с модерацией чатов", {
      reply_markup,
    });
  }

  if (context.match === "addedtogroup") {
    return context.reply("Спасибо что добавил меня в свою группу\n\n/rights");
  }
}

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

export {
  handle_mute,
  handle_unrestrict,
  handle_ban,
  handle_unban,
} from "./moderation";
