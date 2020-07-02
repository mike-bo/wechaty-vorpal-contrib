import Vorpal from 'vorpal'
import {
  log,
  UrlLink as WechatyUrlLink,
  UrlLinkPayload,
}                 from 'wechaty'
import { WechatyVorpalMessages } from 'wechaty-vorpal'
import {
  Observable,
  Observer,
}                 from 'rxjs'

function UrlLink () {
  log.verbose('WechatyVorpalContrib', 'UrlLink()')

  return function UrlLinkExtension (vorpal: Vorpal) {
    log.verbose('WechatyVorpalContrib', 'UrlLinkExtension(vorpal)')

    vorpal
      .command('url_link <url>', 'create a UrlLink message card')
      .option('-d --description <description>', 'the card description')
      .option('-i --image <thumbnailUrl>', 'the card thumbnail image url')
      .option('-t --title <title>', 'the card title')
      .action(urlLinkAction as any)
  }
}

type UrlLinkOptions = Partial<UrlLinkPayload>

async function urlLinkAction (
  this: Vorpal.CommandInstance,
  args: Vorpal.Args
): Promise<Observable<WechatyVorpalMessages>> {
  log.verbose('WechatyVorpalContrib', 'urlLinkAction("%s")', JSON.stringify(args))

  const url: string = args.url
  const options: UrlLinkOptions = args.options

  const urlLink = await WechatyUrlLink.create(url)

  if (options.description) {
    urlLink.payload.description = options.description
  }
  if (options.thumbnailUrl) {
    urlLink.payload.thumbnailUrl = options.thumbnailUrl
  }
  if (options.title) {
    urlLink.payload.title = options.title
  }

  const obs = new Observable(function (
    observer: Observer<WechatyVorpalMessages>
  ) {
    observer.next(urlLink)
    observer.complete()
  })

  return obs
}

export { UrlLink }
