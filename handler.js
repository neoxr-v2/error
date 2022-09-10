const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
module.exports = async (client, m) => {
   try {
      require('./system/database')(m)
      const isOwner = [global.owner, ...global.db.setting.owners].map(v => v + '@s.whatsapp.net').includes(m.sender)
      const isPrem = (typeof global.db.users[m.sender] != 'undefined' && global.db.users[m.sender].premium) || isOwner
      const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat) : {}
      const participants = m.isGroup ? groupMetadata.participants : [] || []
      const adminList = m.isGroup ? await client.groupAdmin(m.chat) : [] || []
      const isAdmin = m.isGroup ? adminList.includes(m.sender) : false
      const isBotAdmin = m.isGroup ? adminList.includes((client.user.id.split`:` [0]) + '@s.whatsapp.net') : false
      const blockList = typeof await (await client.fetchBlocklist()) != 'undefined' ? await (await client.fetchBlocklist()) : []
      const groupSet = global.db.groups[m.chat],
         chats = global.db.chats[m.chat],
         users = global.db.users[m.sender],
         setting = global.db.setting
      const body = typeof m.text == 'string' ? m.text : false
      if (!setting.online) await client.sendPresenceUpdate('unavailable', m.chat)
      if (setting.online) await client.sendPresenceUpdate('available', m.chat)
      if (setting.debug && !m.fromMe && isOwner) client.reply(m.chat, Func.jsonFormat(m), m)
      if (m.isGroup && isBotAdmin) groupSet.localonly = false
      if (m.isGroup && groupSet.autoread) await client.readMessages([m.key])
      if (!m.isGroup) await client.readMessages([m.key])
      if (m.isGroup) groupSet.activity = new Date() * 1
      if (m.chat.endsWith('broadcast') && m.mtype != 'protocolMessage') {
         let caption = `乂  *S T O R I E S*\n\n`
         if (/video|image/.test(m.mtype)) {
            caption += `${body ? body : ''}\n\n`
            caption += `*From : @${m.sender.replace(/@.+/, '')} (${client.getName(m.sender)})*`
            const media = await m.download()
            client.sendFile(global.forwards, media, '', caption)
         } else if (/extended/.test(m.mtype)) {
            caption += `${body ? body : ''}\n\n`
            caption += `*From : @${m.sender.replace(/@.+/, '')} (${client.getName(m.sender)})*`
            client.reply(global.forwards, caption)
         }
      }
      if (users) users.lastseen = new Date() * 1
      if (chats) {
         chats.lastseen = new Date() * 1
         chats.chat += 1
      }
      if (m.isGroup && !m.isBot && users.afk > -1) {
         client.reply(m.chat, `You are back online after being offline for : ${Func.texted('bold', Func.toTime(new Date - users.afk))}\n\n• ${Func.texted('bold', 'Reason')}: ${users.afkReason ? users.afkReason : '-'}`, m)
         users.afk = -1
         users.afkReason = ''
      }
      if (moment(new Date).format('HH:mm') == '00:00') {
         Object.entries(global.db.users).filter(([_, data]) => !data.limit < 10 && !data.premium).map(([_, data]) => data.limit = global.limit)
         Object.entries(global.db.statistic).map(([_, prop]) => prop.today = 0)
      }
      if (m.isGroup && !m.fromMe) {
         let now = new Date() * 1
         if (!groupSet.member[m.sender]) {
            groupSet.member[m.sender] = {
               lastseen: now,
               warning: 0
            }
         } else {
            groupSet.member[m.sender].lastseen = now
         }
      }
      let getPrefix = body ? body.charAt(0) : ''
      let myPrefix = (setting.multiprefix ? setting.prefix.includes(getPrefix) : setting.onlyprefix == getPrefix) ? getPrefix : undefined
      require('./system/logs')(client, m, myPrefix)
      if (m.isBot || m.chat.endsWith('broadcast')) return
      if (((m.isGroup && !groupSet.mute) || !m.isGroup) && !users.banned) {
         if (body && body == myPrefix) {
            if (m.isGroup && groupSet.mute || !isOwner) return
            let old = new Date()
            let banchat = setting.self ? true : false
            if (!banchat) {
               await client.reply(m.chat, Func.texted('bold', `Checking . . .`), m)
               return client.reply(m.chat, Func.texted('bold', `Response Speed: ${((new Date - old) * 1)}ms`), m)
            } else {
               await client.reply(m.chat, Func.texted('bold', `Checking . . .`), m)
               return client.reply(m.chat, Func.texted('bold', `Response Speed: ${((new Date - old) * 1)}ms (nonaktif)`), m)
            }
         }
      }
      let isPrefix
      if (body && body.length != 1 && (isPrefix = (myPrefix || '')[0])) {
         let args = body.replace(isPrefix, '').split` `.filter(v => v)
         let command = args.shift().toLowerCase()
         let start = body.replace(isPrefix, '')
         let clean = start.trim().split` `.slice(1)
         let text = clean.join` `
         let prefixes = global.db.setting.multiprefix ? global.db.setting.prefix : [global.db.setting.onlyprefix]
         require('./features')(m, {
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
         })
      }
   } catch (e) {
      console.log(e)
      if (!m.fromMe) client.reply(m.chat, Func.jsonFormat(e), m)
   }
}

Func.reload(require.resolve(__filename))