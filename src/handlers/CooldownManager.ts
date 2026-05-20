import { Collection } from "discord.js";

export default class CooldownManager {
  private cooldowns = new Collection<string, Collection<string, number>>();

  public async checkCooldown(commandName: string, userId: string, cooldownSeconds: number): Promise<{ allowed: boolean; timeLeft?: number }> {
    if (!this.cooldowns.has(commandName)) {
      this.cooldowns.set(commandName, new Collection());
    }

    const timestamps = this.cooldowns.get(commandName)!;
    const now = Date.now();
    const cooldownAmount = cooldownSeconds * 1000;

    if (timestamps.has(userId)) {
      const expirationTime = (timestamps.get(userId) || 0) + cooldownAmount;
      if (now < expirationTime) {
        return { allowed: false, timeLeft: (expirationTime - now) / 1000 };
      }
    }

    timestamps.set(userId, now);
    setTimeout(() => timestamps.delete(userId), cooldownAmount);
    return { allowed: true };
  }
}
