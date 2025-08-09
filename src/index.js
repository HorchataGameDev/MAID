import { Client, ClientUser, EmbedBuilder } from 'discord.js';
import { config } from 'dotenv';

config();

//ID horchata 356909830608388116
//ID chrono 405479566107475969

//Para lanzar el bot: 
//  npm run maid

//Acepta solo mensajes en platica, radioputamadre, dms mios y dms de chrono

const client = new Client({ intents: ['Guilds', 'GuildMessages', 'DirectMessages', 'MessageContent']});
const TOKEN = process.env.TOKEN_MAID;
const prefijo = process.env.PREF;
let funcionando = false;
let aprilFools = false;
let miCumple = false;
let ignorar = false;
let chrono = false;
let stop = false;
let fechas = "vacio";
let mensajeErroneo = "NO SE HA RECUPERADO EL MENSAJE QUE HA CAUSADO EL ERROR";

var canalDebug;
var saluditos;

client.login(TOKEN);

client.on('ready', () => {
    console.log("El bot "+client.user.tag+" está funcionando");

    //Me envía un mensaje privado diciendo que todo guay
    client.users.fetch('356909830608388116').then(usuarioDev => {
        usuarioDev.send("activo");
    });

    //Canal al que envía los mensajes. Ahora los envía al servidor de pruebas
    canalDebug = client.channels.cache.get("1080809872817401927");
    canalDebug.send("Mensaje enviado por id del canal");
});

//Detección de mensajes:
client.on('messageCreate', (mensaje) => {
    try{
        if(miCumple){
            if(mensaje.channelId == "587359513095700502"){//general
                if(mensaje.content.includes("felicidades")||mensaje.content.includes("feliz")||mensaje.content.includes("feliz cum")||mensaje.content.includes("cumple")||mensaje.content.includes("cumpleaños")){
                    mensaje.react("💖");
                }
            }
        }
        leerMensaje(mensaje);
        return;
    }
    catch(error){
        client.users.fetch('356909830608388116').then(usuario => {
            console.log("error");
            usuario.send("Algo ha salido mal al leer el último mensaje");
            usuario.send(error.message);
            usuario.send(error.stack);
        });
    }
});

async function leerMensaje(m){
    mensajeErroneo = m.content;
    try{
        
        var esAdmin = false;
        var esChrono = false;
        var c;

        //Comprobaciones
        if(m.channel.type == 1){
            if(m.author == '405479566107475969'){esChrono = true;}  //El md es de chrono, no se ignora
            else if(m.author != '356909830608388116'){return;}      //Si el md no es mio ni de chrono, se ignora
        }
        else{
            //Canales válidos: (en este orden) consola, platica, radioputamadre
            if(!(m.channel.id == "1080809872817401927" || m.channel.id == "587367962340491285" || m.channel.id == '587362579194576896')){/*console.log("ignorado por blacklist de canales");*/ return;}
        }
        if(m.content.charAt(0) != prefijo){
            if(!esChrono){return;}
            //No es un comando ni un md de chrono, se ignora
        }

        if(m.author.id == "356909830608388116"){esAdmin=true;}

        if(m.author.id == "1080524006807060541"){return;}//Ignorado por ser un mensaje del bot
        

        //Formato comando
        c = m.content.toLowerCase();
        c = c.slice(1);
        c = c.split(" ");

        //Lectura de comandos
        if(c[0] != ""){

            //Comandos normales

            //hola
            if(c[0] == "hola"){
                //console.log("comando hola");
                var saludos = ["hola", "saludos", "buenas", "hola, qué tal", "hey", "cómo estás", "qué transa", "11000010 10100001 01001000 01101111 01101100 01100001 00100001", ":wave:", "hOla"];
                client.channels.cache.get(m.channel.id).send(saludos[Math.floor(Math.random() * (8 - 0 + 1) + 0)]+" "+m.author.username);
            }

            //comando 'info'
            else if(c[0]=="info"){
                const exampleEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Bot de discord de horchata')
                    .setDescription(`Este es mi asistente de interfaz de discord o M.A.I.D.
                                    Ahora mismo lo único que hace es avisar de los cumpleaños.
                                    Sentíos libres de enviarme sugerencias para mejorar el bot y añadirle funciones.`)
                    .setThumbnail(client.user.avatarURL())
                    .addFields(
                        { name: '\u200B', value: '\u200B' },//Salto de linea
                        { name: 'Sobre mí:', value: "¡Hola! Soy MAID.\n Me encargo de comprobar todos los días de año a las 00:00 si es el cumpleaños de alguien o si es alguna otra fecha especial para avisaros a todos.\n\nAhora mismo tengo muy pocas funciones además de esa, pero con el tiempo y vuestras sugerencias aprenderé a hacer muchas más funciones.\n\nPuedes ver todo lo que puedo hacer por ti con el comando \""+prefijo+"help.\"" },
                    )
                    .setImage('https://cdn.discordapp.com/attachments/1080809872817401927/1099710360715530250/ynbaile.gif')
                    .setTimestamp()
                    .setFooter({ text: 'Bot de HorchataGameDev', iconURL: 'https://pbs.twimg.com/profile_images/1392419936648278016/zCo-xMo5_400x400.jpg' })
                    .setURL('https://horchatagamedev.github.io/Web_Oficial/');
                 client.channels.cache.get(m.channel.id).send({ embeds: [exampleEmbed] });
            }

            //comando 'help'
            else if(c[0]=="help"){
                m.channel.send(client.user.avatarURL());
            }

            //comando 'alguien'
            else if(c[0]=="alguien"){
                if(fechas=="vacio"){
                    m.channel.send("nadie");
                }
                else{
                    m.channel.send(fechas["fechas"]["cumples"][Math.floor(Math.random() * (fechas["fechas"]["cumples"].length - 0 + 1) + 0)].persona);
                }
            }

            //comando 'react'
            else if(c[0]=="react"){
                m.react('1107358513631600660');

                const emoji = client.emojis.cache.get("1107358513631600660");

                m.channel.send(`${emoji}`)
            }

            //comando 'orden'
            else if(c[0]=="orden"){

                m.channel.send(`Se ha deshabilitado este comando conforme a las normas de confidencialidad de la orden. Disculpa las molestias.`);
            }


            //Comandos de admin
            if(esAdmin){
                //start
                if(c[0]=="start"){
                    //activa las comprobaciones
                    if(funcionando){
                        m.channel.send("Las comprobaciones ya están activadas");
                        return;
                    }
                    startup();
                    funcionando=true;
                    m.react("✅");
                }
                //startc
                else if(c[0]=="startc"){
                    //activa las comprobaciones y comprueba el día de hoy
                    if(funcionando){
                        m.channel.send("Las comprobaciones ya están activadas");
                        return;
                    }
                    checkDiario();
                    funcionando=true;
                    m.react("✅");
                }
                else if(c[0]=="stop"){
                    //Evita que el bot envíe avisos y desactiva el bucle a partir de la comprobación ya programada
                    if(!funcionando){
                        m.channel.send("Las comprobaciones no están activadas");
                        return;
                    }
                    stop = !stop;
                    if(stop){
                        m.channel.send("off");
                    }
                    if(!stop){
                        m.channel.send("on");
                    }
                }
                else if(c[0]=="actualizar"){
                    //actualiza la base de datos con un txt adjuntado
                    const file = m.attachments.first()?.url;
                    if (!file){ m.channel.send("No hay un archivo adjunto"); return};

                    m.channel.send("Se ha encontrado un archivo:");

                    const response = await fetch(file);

                    // if there was an error send a message with the status
                    if (!response.ok)
                    return m.channel.send(
                        'No se ha podido leer el archivo. ',
                        response.statusText,
                    );

                    const text = await response.text();
                    if (text) {
                        m.channel.send(text.slice(0,200)+"\n(...)");
                        fechas = JSON.parse(text);
                    }
                }

                //mostrar base de datos
                else if(c[0]=="datos"){
                    if(fechas=="vacio"){
                        m.channel.send("No hay datos cargados ahora mismo.");
                    }
                    else{
                        //2000 character limit
                        let salida="";
                        for(let i=0;i<fechas["fechas"]["cumples"].length;i++){
                            let texto = fechas["fechas"]["cumples"][i].fecha+" - "+fechas["fechas"]["cumples"][i].persona+"\n";
                            if(salida.length+texto.length > 2000){
                                m.channel.send(salida);
                                salida = texto;
                            }
                            else{
                                salida = salida+texto;
                            }
                        }
                        m.channel.send(salida+"------------------------------------------------");
                        salida="";
                        for(let i=0;i<fechas["fechas"]["eventos"].length;i++){
                            let texto = fechas["fechas"]["eventos"][i].fecha+" - "+fechas["fechas"]["eventos"][i].nombre+"\n";
                            if(salida.length+texto.length > 2000){
                                m.channel.send(salida);
                                salida = texto;
                            }
                            else{
                                salida = salida+texto;
                            }
                        }
                        m.channel.send(salida);
                    }
                }

                //recuerdame
                else if(c[0]=="recuerdame"){
                    m.channel.send("Funcionamiento del bot:\nLo primero que tienes que hacer es darle una base de datos con el comando çactualizar y el JSON adjuntado al mensaje. Después, le dices çstart o çstartc. La diferencia es que start hará la comprobación mañana a las 12 y cstart hará una comprobación con avisos en el momento y otra a las 12.\nStop funciona raro. çstop evita que se haga la comprobación al llegar las 12 y no se vuelve a comprobar al día siguiente. La parte de chrono debería funcionar sin tener que intervenir.\nçdatos enseña los datos que hay subidos y creo que todo tiene catch de excepciones que me envia por md si en cualquier momento hay un error.")
                }

                //estado
                else if(c[0]=="estado"){
                    let ahora = new Date(Date.now());
                    let manana = new Date(ahora);
                    manana.setDate(ahora.getDate()+1);
                    manana.setHours(0);
                    manana.setMinutes(0);
                    manana.setSeconds(0);
                    manana.setMilliseconds(0);
                    
                    //muestra qué día es hoy
                    m.channel.send("Hoy es "+ahora.toLocaleString()+" ("+ahora.getTime()+")");

                    //muestra cuánto queda para el siguiente check
                    if(funcionando){
                        m.channel.send("Siguiente check "+manana.toLocaleString()+" (en "+ parseInt(((manana.getTime()-ahora.getTime())/3600000))+" horas y "+parseInt(((manana.getTime()-ahora.getTime())%3600000)/60000)+" minutos)");
                        if(chrono){
                            if(ignorar){
                                m.channel.send("Chrono ha dicho que no se notifique el cumpleaños de mañana");
                            }
                            else{
                                m.channel.send("Sin restricciones para notificar mañana");
                            }
                        }
                        else{
                            m.channel.send("No va a hacerse everyone mañana");
                        }
                    }
                    else{
                        m.channel.send("Las comprobaciones están desactivadas");
                    }
                    if(fechas=="vacio"){
                        m.channel.send("No hay un JSON de datos");
                    }
                    else{
                        m.channel.send("Hay subido un JSON con datos");
                    }
                }
            }

            //Confirmacion de chrono
            else if(esChrono){
                if(!ignorar && chrono){
                    ignorar = true;
                    console.log("Chrono dice que no avise.");
                    m.react("✅");
                }
            }
            else{
                console.log("comando desconocido o mal formado \""+c[0]+"\"");
                return;
            }
        }
    }
    catch(ex){
        client.users.fetch('356909830608388116').then(usuario => {
            usuario.send("Se ha producido un error al leer el comando \""+mensajeErroneo+"\"");
            usuario.send(ex.message);
            usuario.send(ex.stack);
        });
    }
}

async function checkDiario(){
    try{ 
        miCumple = false;
        aprilFools = false;

        //Se llama a si misma cada día
        //Sólo puede haber una ejecución de esta función a la vez

        //Declaracion de las fechas
        let ahora = new Date(Date.now());
        let manana = new Date(ahora);
        manana.setDate(ahora.getDate()+1);
        ahora = ((ahora.getDate()).toString().padStart(2, '0'))+"/"+((ahora.getMonth()+1).toString().padStart(2, '0'));
        manana = ((manana.getDate()).toString().padStart(2, '0'))+"/"+((manana.getMonth()+1).toString().padStart(2, '0'));

        //comprobación STOP
        if(stop){
            client.users.fetch('356909830608388116').then(usuario => {
                usuario.send("No se ha vuelto a llamar a la función checkDiario() porque se ha desactivado con el comando çstop. Vuelve a activar la función manualmente.");
                funcionando = false;
                stop = false;
                return;
            });
        }

        //comprobación Chrono
        if(ignorar){
            client.users.fetch('405479566107475969').then(usuario => {
                //Mensaje a chrono
                //usuario.send("Son las 12! Que no se te olvide poner el everyone.");
            });
        }
        else{
            //comprobación de fechas de cumpleaños
            if(fechas == "vacio"){
                client.users.fetch('356909830608388116').then(usuario => {
                    usuario.send("No se han comprobado los cumpleaños porque no hay un JSON");
                });
            }
            else{
                for(let i=0;i<fechas["fechas"]["cumples"].length;i++){
                    if(fechas["fechas"]["cumples"][i].fecha == ahora){
                        canalDebug.send("@everyone feliciad todos a <@"+fechas["fechas"]["cumples"][i].codigo+"> que hoy es su cumpleaños.");
                        if(fechas["fechas"]["cumples"][i].persona == "fure"){
                            canalDebug.send("https://cdn.discordapp.com/attachments/1089971759110963321/1108059020838838312/FureBday.gif");
                        }
                    }
                }
            }
        }

        //comprobación de fechas de eventos
        if(fechas == "vacio"){
            client.users.fetch('356909830608388116').then(usuario => {
                usuario.send("No se han comprobado los eventos porque no hay un JSON");
            });
        }
        else{
            for(let i=0;i<fechas["fechas"]["eventos"].length;i++){
                if(fechas["fechas"]["eventos"][i].fecha == ahora){
                    canalDebug.send(fechas["fechas"]["eventos"][i].mensaje);
                }
                if(fechas["fechas"]["eventos"][i].fecha == "01/03"){
                    miCumple = true;
                }
                if(fechas["fechas"]["eventos"][i].fecha == "01/04"){
                    aprilFools = true;
                }
            }
        }
        ignorar = false;
        chrono = false;

        
        //Comprobar si mañana es cumpleaños por si chrono quiere avisar. Ignorar si va a ser el cumpleaños de chrono
        if(fechas != "vacio"){
            for(let i=0;i<fechas["fechas"]["cumples"].length;i++){
                if(fechas["fechas"]["cumples"][i].fecha == manana){
                    client.users.fetch('405479566107475969').then(usuario => {
                        if(fechas["fechas"]["cumples"][i].persona == "chrono"){
                            //Mensaje a chrono
                            //usuario.send("Hola, chrono. Parece que en 24 horas va a ser el cumpleaños de "+fechas["fechas"]["cumples"][i].persona+".\n Como habrás comprobado, esta persona eres tú, así que hoy no puedo darte la opción de cancelar el aviso, lamento el inconveniente.\nQue tengas un muy buen día.");
                            chrono = false;
                        }
                        else{
                            //Mensaje a chrono
                            //usuario.send("Hola, chrono. Parece que en 24 horas va a ser el cumpleaños de "+fechas["fechas"]["cumples"][i].persona+".\nSi ignoras este mensaje me ocuparé yo automáticamente, pero si contestas cualquier cosa no avisaré para que puedas hacerlo tú.\nQue tengas un buen día.");
                            chrono = true;
                        }
                    });
                }
            }
        }
        //Se vuelve a llamar a sí misma
        startup();
    }
    catch(ex){
        client.users.fetch('356909830608388116').then(usuario => {
            usuario.send("Se ha producido un error en la función checkDiario() y se han detenido las comprobaciones");
            usuario.send(ex.message);
            usuario.send(ex.stack);
        });
    }
}

async function startup(){
    try{
        //Llama a chechDiario cuando se acaba el día
        //Sólo puede haber una ejecución de esta función a la vez

        //Cálculo de tiempo para llamar a la función
        let ahora = new Date(Date.now());
        let manana = new Date(ahora);
        manana.setDate(ahora.getDate()+1);
        manana.setHours(0);
        manana.setMinutes(0);
        manana.setSeconds(0);
        manana.setMilliseconds(0);

        let milisegundos = manana.getTime()-ahora.getTime();

        setTimeout(function(){ checkDiario(); }, milisegundos);
    }
    catch(ex){
        client.users.fetch('356909830608388116').then(usuario => {
            usuario.send("Se ha producido un error en la función startup() y se han detenido las comprobaciones");
            usuario.send(ex.message);
            usuario.send(ex.stack);
        });
    }
}