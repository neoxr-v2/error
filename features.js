const decode = require('html-entities').decode
const {
   yta,
   ytv
} = require('./lib/y2mate')
const yt = require('usetube')
module.exports = async (m, {
   client,
   args,
   text,
   isPrefix,
   command,
   participants,
   blockList,
   isPrem,
   isOwner,
   isAdmin,
   isBotAdmin
}) => {
   try {
      switch (command) {
         case 'play': {
            if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'lathi'), m)
            client.sendReact(m.chat, '🕒', m.key)
            const search = await (await yt.searchVideo(text)).videos
            if (!search || search.length == 0) return client.reply(m.chat, global.status.fail, m)
            const {
               dl_link,
               thumb,
               title,
               duration,
               filesizeF
            } = await yta('https://youtu.be/' + search[0].id)
            if (!dl_link) return client.reply(m.chat, global.status.fail, m)
            let caption = `乂  *Y T - P L A Y*\n\n`
            caption += `	◦  *Title* : ${decode(title)}\n`
            caption += `	◦  *Size* : ${filesizeF}\n`
            caption += `	◦  *Duration* : ${duration}\n`
            caption += `	◦  *Bitrate* : 128kbps\n\n`
            caption += global.footer
            let chSize = Func.sizeLimit(filesizeF, global.max_upload)
            if (chSize.oversize) return client.reply(m.chat, `💀 File size (${filesizeF}) exceeds the maximum limit, download it by yourself via this link : ${await (await scrap.shorten(dl_link)).data.url}`, m)
            client.sendMessageModify(m.chat, caption, m, {
               title: '© neoxr-bot v2.2.0 (Public Bot)',
               largeThumb: true,
               thumbnail: await Func.fetchBuffer(thumb)
            }).then(async () => {
               client.sendFile(m.chat, dl_link, decode(title) + '.mp3', '', m, {
                  document: true
               })
            })
            break
         }

         case /yt?(a|mp3)/i.test(command): {
            if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://youtu.be/zaRFmdtLhQ8'), m)
            if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return client.reply(m.chat, global.status.invalid, m)
            client.sendReact(m.chat, '🕒', m.key)
            const {
               dl_link,
               thumb,
               title,
               duration,
               filesizeF
            } = await yta(args[0])
            if (!dl_link) return client.reply(m.chat, global.status.fail, m)
            let caption = `乂  *Y T - M P 3*\n\n`
            caption += `	◦  *Title* : ${decode(title)}\n`
            caption += `	◦  *Size* : ${filesizeF}\n`
            caption += `	◦  *Duration* : ${duration}\n`
            caption += `	◦  *Bitrate* : 128kbps\n\n`
            caption += global.footer
            let chSize = Func.sizeLimit(filesizeF, global.max_upload)
            if (chSize.oversize) return client.reply(m.chat, `💀 File size (${filesizeF}) exceeds the maximum limit, download it by yourself via this link : ${await (await scrap.shorten(dl_link)).data.url}`, m)
            client.sendMessageModify(m.chat, caption, m, {
               title: '© neoxr-bot v2.2.0 (Public Bot)',
               largeThumb: true,
               thumbnail: await Func.fetchBuffer(thumb)
            }).then(() => {
               client.sendFile(m.chat, dl_link, decode(title) + '.mp3', '', m, {
                  document: true
               })
            })
            break
         }

         case /yt?(v|mp4)/i.test(command): {
            if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://youtu.be/zaRFmdtLhQ8'), m)
            if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return client.reply(m.chat, global.status.invalid, m)
            client.sendReact(m.chat, '🕒', m.key)
            const {
               dl_link,
               thumb,
               title,
               duration,
               filesizeF
            } = await ytv(args[0])
            if (!dl_link) return client.reply(m.chat, global.status.fail, m)
            let caption = `乂  *Y T - M P 4*\n\n`
            caption += `	◦  *Title* : ${decode(title)}\n`
            caption += `	◦  *Size* : ${filesizeF}\n`
            caption += `	◦  *Duration* : ${duration}\n`
            caption += `	◦  *Quality* : 480p\n\n`
            caption += global.footer
            let chSize = Func.sizeLimit(filesizeF, global.max_upload)
            if (chSize.oversize) return client.reply(m.chat, `💀 File size (${filesizeF}) exceeds the maximum limit, download it by yourself via this link : ${await (await scrap.shorten(dl_link)).data.url}`, m)
            let isSize = (filesizeF).replace(/MB/g, '').trim()
            if (isSize > 99) return client.sendMessageModify(m.chat, caption, m, {
               title: '© neoxr-bot v2.2.0 (Public Bot)',
               largeThumb: true,
               thumbnail: await Func.fetchBuffer(thumb)
            }).then(async () => await client.sendFile(m.chat, dl_link, decode(title) + '.mp4', '', m, {
               document: true
            }))
            client.sendFile(m.chat, dl_link, Func.filename('mp4'), caption, m)
            break
         }

         case 'run': {
            let _uptime = process.uptime() * 1000
            let uptime = Func.toTime(_uptime)
            client.reply(m.chat, Func.texted('bold', `Running for : [ ${uptime} ]`), m)
            break
         }

         case 'restart': {
            if (!isOwner) return client.reply(m.chat, global.status.owner, m)
            await client.reply(m.chat, Func.texted('bold', 'Restarting . . .'), m).then(async () => {
               await props.save()
               process.send('reset')
            })
            break
         }

         case 'server': { 
            const json = await Func.fetchJson('http://ip-api.com/json')
            return client.reply(m.chat, Func.jsonFormat(json), m)
            break
         }

      }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}