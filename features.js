const decode = require('html-entities').decode
const yta = require('./lib/y2mate').yta
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
         }
      }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}