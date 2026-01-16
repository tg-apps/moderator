import type { CommandContext, Context } from "grammy";
import type { User, ChatMember } from "grammy/types";

import { FormattedString } from "@grammyjs/parse-mode";
import { API_CONSTANTS } from "grammy";

import { getRestrictionDurationAndReason } from "../utils/restriction-duration-reason";

function isChatMemberAdmin(chatMember: ChatMember) {
  return (
    chatMember.status === "creator" || chatMember.status === "administrator"
  );
}

function canRestrictMembers(chatMember: ChatMember) {
  if (chatMember.status === "creator") return true;
  if (chatMember.status !== "administrator") return false;
  return chatMember.can_restrict_members;
}

class MentionableFormattedString extends FormattedString {
  constructor(string: string | FormattedString) {
    if (typeof string === "string") {
      super(string);
      return;
    }
    super(string.text, string.entities);
  }

  override mentionUser(user: User): MentionableFormattedString {
    if (user.username) {
      const text = `@${user.username}` as const;
      return new MentionableFormattedString(super.mentionUser(text, user.id));
    }
    const full_name = user.last_name
      ? (`${user.first_name} ${user.last_name}` as const)
      : user.first_name;
    return new MentionableFormattedString(
      super.mentionUser(full_name, user.id),
    );
  }

  override plain(text: string): MentionableFormattedString {
    return new MentionableFormattedString(super.plain(text));
  }
}

export async function handle_mute(context: CommandContext<Context>) {
  if (context.chat.type === "private") {
    return context.reply("Данная команда работает только в группах");
  }
  const target = context.message?.reply_to_message?.from;
  if (!target) {
    return context.reply("Вы не выбрали пользователя которого хотите замутить");
  }
  const messageAuthor = await context.getAuthor();
  const canAuthorRestrictMembers = canRestrictMembers(messageAuthor);
  if (!canAuthorRestrictMembers) {
    return context.reply(
      "У вас нет доступа к данной команде: вы не админ или у вас нет необходимых прав",
    );
  }
  const botChatMember = await context.getChatMember(context.me.id);
  const canBotRestrictMembers = canRestrictMembers(botChatMember);
  if (!canBotRestrictMembers) {
    return context.reply("У бота не достаточно прав для данной команды");
  }
  if (isChatMemberAdmin(await context.getChatMember(target.id))) {
    return context.reply("Нельзя замутить админа");
  }
  const { until_date, humanReadable, reason } = getRestrictionDurationAndReason(
    context.match,
  );
  await context.restrictChatMember(
    target.id,
    { can_send_messages: false },
    { until_date },
  );
  const message = new MentionableFormattedString("Администратор ")
    .mentionUser(messageAuthor.user)
    .plain(" замутил пользователя ")
    .mentionUser(target)
    .plain(` ${humanReadable}`);
  if (!reason) {
    return context.reply(message.text, { entities: message.entities });
  }
  const { text, entities } = message.plain(`\n\nПричина: ${reason}`);
  return context.reply(text, { entities });
}

export async function handle_unrestrict(context: CommandContext<Context>) {
  if (context.chat.type === "private") {
    return context.reply("Данная команда работает только в группах");
  }
  const target = context.message?.reply_to_message?.from;
  if (!target) {
    return context.reply(
      "Вы не выбрали пользователя которого хотите размутить",
    );
  }
  const messageAuthor = await context.getAuthor();
  const canAuthorRestrictMembers = canRestrictMembers(messageAuthor);
  if (!canAuthorRestrictMembers) {
    return context.reply(
      "У вас нет доступа к данной команде: вы не админ или у вас нет необходимых прав",
    );
  }
  const botChatMember = await context.getChatMember(context.me.id);
  const canBotRestrictMembers = canRestrictMembers(botChatMember);
  if (!canBotRestrictMembers) {
    return context.reply("У бота не достаточно прав для данной команды");
  }
  await context.restrictChatMember(
    target.id,
    API_CONSTANTS.ALL_CHAT_PERMISSIONS,
  );
  const message = new MentionableFormattedString("Пользователь ")
    .mentionUser(target)
    .plain(" был размучен администратором ")
    .mentionUser(messageAuthor.user);
  return context.reply(message.text, { entities: message.entities });
}

export async function handle_ban(context: CommandContext<Context>) {
  if (context.chat.type === "private") {
    return context.reply("Данная команда работает только в группах");
  }
  const target = context.message?.reply_to_message?.from;
  if (!target) {
    return context.reply("Вы не выбрали пользователя которого хотите забанить");
  }
  const messageAuthor = await context.getAuthor();
  const canAuthorRestrictMembers = canRestrictMembers(messageAuthor);
  if (!canAuthorRestrictMembers) {
    return context.reply(
      "У вас нет доступа к данной команде: вы не админ или у вас нет необходимых прав",
    );
  }
  const botChatMember = await context.getChatMember(context.me.id);
  const canBotRestrictMembers = canRestrictMembers(botChatMember);
  if (!canBotRestrictMembers) {
    return context.reply("У бота не достаточно прав для данной команды");
  }
  if (isChatMemberAdmin(await context.getChatMember(target.id))) {
    return context.reply("Нельзя забанить админа");
  }
  const { until_date, humanReadable, reason } = getRestrictionDurationAndReason(
    context.match,
  );
  await context.banChatMember(target.id, { until_date });
  const message = new MentionableFormattedString("Администратор ")
    .mentionUser(messageAuthor.user)
    .plain(" забанил пользователя ")
    .mentionUser(target)
    .plain(` ${humanReadable}`);
  if (!reason) {
    return context.reply(message.text, { entities: message.entities });
  }
  const { text, entities } = message.plain(`\n\nПричина: ${reason}`);
  return context.reply(text, { entities });
}

export async function handle_unban(context: CommandContext<Context>) {
  if (context.chat.type === "private") {
    return context.reply("Данная команда работает только в группах");
  }
  const target = context.message?.reply_to_message?.from;
  if (!target) {
    return context.reply(
      "Вы не выбрали пользователя которого хотите разбанить",
    );
  }
  const messageAuthor = await context.getAuthor();
  const canAuthorRestrictMembers = canRestrictMembers(messageAuthor);
  if (!canAuthorRestrictMembers) {
    return context.reply(
      "У вас нет доступа к данной команде: вы не админ или у вас нет необходимых прав",
    );
  }
  const botChatMember = await context.getChatMember(context.me.id);
  const canBotRestrictMembers = canRestrictMembers(botChatMember);
  if (!canBotRestrictMembers) {
    return context.reply("У бота не достаточно прав для данной команды");
  }
  await context.unbanChatMember(target.id);
  const { text, entities } = new MentionableFormattedString("Администратор ")
    .mentionUser(messageAuthor.user)
    .plain(" разбанил пользователя ")
    .mentionUser(target);
  return context.reply(text, { entities });
}
