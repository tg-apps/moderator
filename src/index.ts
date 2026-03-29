import { run } from "@grammyjs/runner";
import { Bot } from "grammy";

import { handle_help, handle_rights } from "./handlers/help";
import {
  handle_ban,
  handle_mute,
  handle_unban,
  handle_unrestrict,
} from "./handlers/moderation";
import { handle_report } from "./handlers/report";
import { handle_start } from "./handlers/start";
import { handleMessage } from "./handlers/swear";

const TOKEN = process.env["TOKEN"];

if (!TOKEN) {
  throw new Error("Missing TOKEN env variable");
}

const bot = new Bot(TOKEN);

const m = bot.on("message:text");

m.command("start", handle_start);
m.command("help", handle_help);
m.command("rights", handle_rights);
m.command("mute", handle_mute);
m.command("unrestrict", handle_unrestrict);
m.command("ban", handle_ban);
m.command("unban", handle_unban);
m.command("report", handle_report);

bot.on("::bot_command", async (context) => {
  if (context.chat.type !== "private") return;
  const response = "Команда не найдена! Список команд -> /help";
  await context.reply(response);
});

bot.on("message:text", handleMessage);

void bot.api.setMyCommands([
  { command: "help", description: "Помощь" },
  { command: "rights", description: "Узнать необходимые права" },
  { command: "mute", description: "Замутить пользователя" },
  { command: "unrestrict", description: "Размутить пользователя" },
  { command: "ban", description: "Забанить пользователя" },
  { command: "unban", description: "Разбанить пользователя" },
  { command: "report", description: "Пожаловаться на пользователя" },
]);

const runner = run(bot);

const stopRunner = () => runner.isRunning() && runner.stop();
process.once("SIGINT", stopRunner);
process.once("SIGTERM", stopRunner);
