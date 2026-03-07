import { run } from "@grammyjs/runner";
import { Bot } from "grammy";

import * as handler from "./handlers";

const TOKEN = process.env["TOKEN"];

if (!TOKEN) {
  throw new Error("Missing TOKEN env variable");
}

const bot = new Bot(TOKEN);

bot.command("start", handler.handle_start);
bot.command("help", handler.handle_help);
bot.command("rights", handler.handle_rights);
bot.command("mute", handler.handle_mute);
bot.command("unrestrict", handler.handle_unrestrict);
bot.command("ban", handler.handle_ban);
bot.command("unban", handler.handle_unban);

bot.on("::bot_command", async (context) => {
  if (context.chat.type !== "private") return;
  const response = "Команда не найдена! Список команд -> /help";
  await context.reply(response);
});

bot.on("message:text", handler.handleMessage);

void bot.api.setMyCommands([
  { command: "help", description: "Помощь" },
  { command: "rights", description: "Узнать необходимые права" },
  { command: "mute", description: "Замутить пользователя" },
  { command: "unrestrict", description: "Размутить пользователя" },
  { command: "ban", description: "Забанить пользователя" },
  { command: "unban", description: "Разбанить пользователя" },
]);

const runner = run(bot);

const stopRunner = () => runner.isRunning() && runner.stop();
process.once("SIGINT", stopRunner);
process.once("SIGTERM", stopRunner);
