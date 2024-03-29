/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Logger } from '../../helpers';
import { Command,CommandParams } from '../../interfaces';
import bcbsite from '../../services/bancocentralgov';
import { EmbedBuilder } from '@discordjs/builders';

const command : Command = {
    name: 'cotacao',
    description: 'Ele retorna a cotação do dolar do dia',
    aliases: ['dolares' , 'dolar', 'cambio', 'dollares', 'dollar'],
    usage: '[Dolares]',
    hasArgs : true,
    async execute({ message, args }: CommandParams){
        const dolares = parseFloat(args![0].replace(',','.').trim());
        
        if (  isNaN(dolares) ) {
            return message.reply('precisa ser um número válido tente: 10, 149,99 , 30!');
        }

        try { 
            /**const result = await bancocentral.get(`/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${day}'&$top=1&$format=json&$select=cotacaoVenda`);
            //const json = JSON.parse(JSON.stringify(result.data))
            //const reais : number = json.value[0]['cotacaoVenda'] * 1.04
            
            //const result = await cotacao.get('/USD-BRL,EUR-BRL,BTC-BRL');
            //const reais : number = result.data.USDBRL.high
            */
            
            const result = await bcbsite.get('/indicadorCambio');
            
            const prices = result.data.conteudo[0] || result.data.conteudo[1];
            
            // 4 % de Spread
            const reais : number = prices.valorVenda * 1.04;
            

            // conversão direta
            const exchange = (dolares * reais);
            
            // Taxa do IOF 
            const iof = ( (exchange ) * 0.0638);
            // Valor Total com IOF e Spread
            const total = exchange  + iof;
            const total_rounded = total.toFixed(3);
            
            
            
            return message.channel.send({embeds: [new EmbedBuilder({
                title: ':moneybag: Cotaçao banco central do dollar comercial :moneybag:',
                description: 
                    `• US$ 1,00 : BRL R$ ${(reais).toFixed(3).toString().replace('.',',')} (4% spread)\n
                     • Incluindo +R$ ${iof.toFixed(3).toString().replace('.',',')} (6.38% IOF)\n
                     » Convertendo US$ ${dolares} ( 1 : ${reais.toFixed(3).toString().replace('.',',')} ) sai a R$ ${total_rounded}  :money_with_wings: \n
                    Esse valor é o que será pago se você fizer uma compra em dollar com cartão de credito.`,
                color: (await message.guild?.members.fetch(message.author.id))?.displayColor || 0xbd00ff,    
                timestamp: new Date().toISOString(),
                footer: {
                    text: `${process.env.APP_NAME}`
                }    
            })]});
            
            
        } catch ( err: unknown ) {
            Logger.error(err);
            return message.reply('não consegui executar essa ação');
        }

    }
};


function dataAtualFormatada( subdays = 0 ) : string{
    const data = new Date(),
        dia  = (data.getDate()-subdays ).toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
        ano  = data.getFullYear();
    return mes+'/'+dia+'/'+ano;
}

function getFormatedDate(){
    const today = new Date(Date.now()).getDate();
    switch (today) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
            return dataAtualFormatada();
        case 5:
            return dataAtualFormatada(1);
        default:
            return dataAtualFormatada(2);
      }
}

export = command;

