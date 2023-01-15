import axios, { AxiosError } from "axios";
import { Message } from "discord.js";
import { Logger } from "../../helpers";
import { Command, CommandParams } from "../../interfaces";
import { ApiResponseException, Violation } from "../../interfaces";

import birthdayServices from "../../services/BirthdayService";

const command: Command = {
  name: "birthday",
  description: "Cadastra seu aniversário para ser marcado no dia!",
  usage: "[dia]/[mes]",
  guildOnly: true,
  cooldown: 60,
  aliases: ["aniversario", "niver", "bd", "birthdays"],
  hasArgs: true,
  async execute({ message, args }: CommandParams) {
    // Sanitiza entrada
    const aniversario = args![0].toString().replace(",", "").trim();

    // Verifica formatação
    if (aniversario.indexOf("/") < 1) {
      return message.reply(
        "Para usar o comando, mande: `<dia>/<mês>` do seu aniversário."
      );
    }
    // Monta payload para ser enviado
    const data = {
      day: parseInt(aniversario.split("/")[0]),
      month: parseInt(aniversario.split("/")[1]),
      name: message.author.username,
      snowflake: message.author.id,
    };
    // Exibe logs
    Logger.info("Aniversário recebido: " + aniversario + " - Usuario: "+data.name + " " + data.snowflake);
    // Busca e se encontrar tenta atualizar
    try {
      const birthday = await birthdayServices.get(
        `/birthday/${message.author.id}`
      );
      
      if (birthday.data != null && birthday.data != "") {
        Logger.info("Encontrado, atualizando...");
        await birthdayServices.patch("/birthday", data);
        return message.reply("Aniversário atualizado com sucesso.");
      }
    } catch (err: unknown | AxiosError) {
        Logger.warn("Erro ao atualizar ou buscar aniversário", err);
        return handleException(message, err);
    }
    // Cadastra aniversário
    try {
      await birthdayServices.post("/birthday", data);
    } catch (err: unknown | AxiosError) {
      Logger.warn("Erro ao cadastrar aniversário", err);
      return handleException(message, err);
    }

    return message.reply("Obrigado, salvei seu niver com sucesso.");
  },
};

function handleException(message: Message, err: unknown | AxiosError) {
  if (axios.isAxiosError(err)) {
    const response = err.response?.data as ApiResponseException;
    if (response != null && response.title === "Constraint Violation") {
      const erros = getErrorMessages(response.violations);

      return message.reply(
        "Ei, deu " +
          response.violations.length +
          " erro(s)\n" +
          "são ele(s):\n" +
          erros.toString().replace(",", "\n")
      );
    }
    return message.channel.send(
      "Ocorreu algum erro imprevisto, por favor, o Winter."
    );
  } else {
    console.error(err);
    return message.channel.send(
      "Acho que meus serviços deram algum problema, por favor, tente novamente mais tarde."
    );
  }
}

function getErrorMessages(violations: Violation[]): string[] {
  const erros: string[] = [];

  violations.forEach((element) => {
    const nome = element.field
      .replace("update.request.", "")
      .replace("create.request.", "")
      .replace("month", "Mês")
      .replace("day", "Dia");
    erros.push(nome + " " + element.message);
  });

  return erros;
}

export = command;
