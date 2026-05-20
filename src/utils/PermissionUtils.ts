import { Message, GuildMember } from "discord.js";

export default class PermissionUtils {
  public static async isAdmin(member: GuildMember | undefined): Promise<boolean> {
    if (!member) return false;
    return member.permissions.has("Administrator") || member.permissions.has("KickMembers");
  }

  public static async checkAdminPermission(memberId: string, guild: any): Promise<boolean> {
    if (!guild) return false;
    const member = await guild.members.fetch(memberId);
    return this.isAdmin(member);
  }
}
