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
            client.sendReact(m.chat, 'π', m.key)
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
            let caption = `δΉ  *Y T - P L A Y*\n\n`
            caption += `	β¦  *Title* : ${decode(title)}\n`
            caption += `	β¦  *Size* : ${filesizeF}\n`
            caption += `	β¦  *Duration* : ${duration}\n`
            caption += `	β¦  *Bitrate* : 128kbps\n\n`
            caption += global.footer
            let chSize = Func.sizeLimit(filesizeF, global.max_upload)
            if (chSize.oversize) return client.reply(m.chat, `π File size (${filesizeF}) exceeds the maximum limit, download it by yourself via this link : ${await (await scrap.shorten(dl_link)).data.url}`, m)
            client.sendMessageModify(m.chat, caption, m, {
               title: 'Β© neoxr-bot v2.2.0 (Public Bot)',
               largeThumb: true,
               thumbnail: await Func.fetchBuffer(thumb)
            }).then(async () => {
               client.sendFile(m.chat, dl_link, decode(title) + '.mp3', '', m, {
                  document: true
               })
            })
            break
         }

         case 'ytmp3': {
            if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://youtu.be/zaRFmdtLhQ8'), m)
            if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return client.reply(m.chat, global.status.invalid, m)
            client.sendReact(m.chat, 'π', m.key)
            const {
               dl_link,
               thumb,
               title,
               duration,
               filesizeF
            } = await yta(args[0])
            if (!dl_link) return client.reply(m.chat, global.status.fail, m)
            let caption = `δΉ  *Y T - M P 3*\n\n`
            caption += `	β¦  *Title* : ${decode(title)}\n`
            caption += `	β¦  *Size* : ${filesizeF}\n`
            caption += `	β¦  *Duration* : ${duration}\n`
            caption += `	β¦  *Bitrate* : 128kbps\n\n`
            caption += global.footer
            let chSize = Func.sizeLimit(filesizeF, global.max_upload)
            if (chSize.oversize) return client.reply(m.chat, `π File size (${filesizeF}) exceeds the maximum limit, download it by yourself via this link : ${await (await scrap.shorten(dl_link)).data.url}`, m)
            client.sendMessageModify(m.chat, caption, m, {
               title: 'Β© neoxr-bot v2.2.0 (Public Bot)',
               largeThumb: true,
               thumbnail: await Func.fetchBuffer(thumb)
            }).then(() => {
               client.sendFile(m.chat, dl_link, decode(title) + '.mp3', '', m, {
                  document: true
               })
            })
            break
         }

         case 'ytmp4': {
            if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://youtu.be/zaRFmdtLhQ8'), m)
            if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return client.reply(m.chat, global.status.invalid, m)
            client.sendReact(m.chat, 'π', m.key)
            const {
               dl_link,
               thumb,
               title,
               duration,
               filesizeF
            } = await ytv(args[0])
            if (!dl_link) return client.reply(m.chat, global.status.fail, m)
            let caption = `δΉ  *Y T - M P 4*\n\n`
            caption += `	β¦  *Title* : ${decode(title)}\n`
            caption += `	β¦  *Size* : ${filesizeF}\n`
            caption += `	β¦  *Duration* : ${duration}\n`
            caption += `	β¦  *Quality* : 480p\n\n`
            caption += global.footer
            let chSize = Func.sizeLimit(filesizeF, global.max_upload)
            if (chSize.oversize) return client.reply(m.chat, `π File size (${filesizeF}) exceeds the maximum limit, download it by yourself via this link : ${await (await scrap.shorten(dl_link)).data.url}`, m)
            let isSize = (filesizeF).replace(/MB/g, '').trim()
            if (isSize > 99) return client.sendMessageModify(m.chat, caption, m, {
               title: 'Β© neoxr-bot v2.2.0 (Public Bot)',
               largeThumb: true,
               thumbnail: await Func.fetchBuffer(thumb)
            }).then(async () => await client.sendFile(m.chat, dl_link, decode(title) + '.mp4', '', m, {
               document: true
            }))
            client.sendFile(m.chat, dl_link, Func.filename('mp4'), caption, m)
            break
         }

         case 'ig': {
            if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://www.instagram.com/p/CK0tLXyAzEI'), m)
            if (!args[0].match(/(https:\/\/www.instagram.com)/gi)) return client.reply(m.chat, global.status.invalid, m)
            client.sendReact(m.chat, 'π', m.key)
            let old = new Date()
            let json = await Api.ig(Func.igFixed(args[0]))
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            json.data.map(async v => {
               client.sendFile(m.chat, v.url, '', `π *Fetching* : ${((new Date - old) * 1)} ms`, m)
               await Func.delay(1500)
            })
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