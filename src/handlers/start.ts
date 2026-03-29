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
