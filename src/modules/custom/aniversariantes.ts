import axios, { AxiosError, AxiosResponse } from "axios";
import { Message } from "discord.js";
import { Logger } from "../../helpers";
import { BirthDay, Command, CommandParams } from "../../interfaces";
import { ApiResponseException, Violation } from "../../interfaces";

import birthdayServices from "../../services/BirthdayService";

const command: Command = {
  name: "aniversariantes",
  description: "Traz a lista de aniversariantes do dia!",
  guildOnly: true,
  cooldown: 15,
  adminOnly: true,
  aliases: ["aniversarios", "aniversariosdodia"],
  async execute({ message, args }: CommandParams) {
    // Exibe logs
    Logger.info("Buscando aniversarios do dia para: " + message.author.username);
    // Busca e se encontrar tenta atualizar
    try {
      const birthdays:AxiosResponse<BirthDay[]> = await birthdayServices.get(
        `/birthday/today`
      );
      
      if (birthdays.data != null && birthdays.data.length != 0) {
        Logger.info("Encontrado, montando lista de aniversáriantes");
        message.reply(`Localizei os aniversáriantes do dia ${message.author.username}, aguarda um momento que vou mandar a lista aqui.` );
        
        const aniversarios:string[] = [];
        
        birthdays.data.forEach(birthday => {
          aniversarios.push(`${birthday.name}: <@${birthday.snowflake}>`);
        });
        
        return message.channel.send(`${aniversarios.join('\n')}`);
      } 
      return message.reply("Ninguém cadastrado faz aniversário hoje.");
    } catch (err: unknown | AxiosError) {
        Logger.warn("Erro ao buscar aniversáriantes", err);
        return handleException(message, err);
    }
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
