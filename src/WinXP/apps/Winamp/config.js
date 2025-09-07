// from Webamp demo

const album = 'netBloc Vol. 24: tiuqottigeloot';

// Optional Cloudflare Worker proxy for CORS/caching
// Set REACT_APP_CF_PROXY to your worker URL.
// Supported formats:
//  - "https://<worker>/fetch?url={url}" (use {url} placeholder)
//  - "https://<worker>" (defaults to appending "/fetch?url=..." with encoded target URL)
const CF_PROXY = process.env.REACT_APP_CF_PROXY || '';
const proxyUrl = url => {
  if (!CF_PROXY) return url;
  if (CF_PROXY.includes('{url}'))
    return CF_PROXY.replace('{url}', encodeURIComponent(url));
  const base = CF_PROXY.endsWith('/') ? CF_PROXY.slice(0, -1) : CF_PROXY;
  return `${base}/fetch?url=${encodeURIComponent(url)}`;
};

// Allow overriding audio host with a public R2 domain (or any CDN)
// Examples:
//  - REACT_APP_AUDIO_BASE=https://pub-xxxx.r2.dev
//  - Use placeholder in track URL: "{Audio_Base}/path/to/file.mp3"
const AUDIO_BASE =
  process.env.REACT_APP_AUDIO_BASE || process.env.REACT_APP_R2_BASE || '';
const joinBase = (base, key) => {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const parts = String(key)
    .split('/')
    .filter(Boolean)
    .map(encodeURIComponent);
  return `${b}/${parts.join('/')}`;
};
const withBase = url => {
  // Support "{Audio_Base}/..." placeholder in config
  const m = /^\{Audio_Base\}\/(.+)$/i.exec(url || '');
  if (m) {
    if (!AUDIO_BASE) return url; // env not set; leave as-is
    return joinBase(AUDIO_BASE, m[1]);
  }
  if (!AUDIO_BASE) return url;
  try {
    const name = new URL(url).pathname.split('/').pop() || '';
    // Only remap known media files; leave others (e.g., Google Drive preview) untouched
    if (!/\.(mp3|ogg|wav)$/i.test(name)) return url;
    return joinBase(AUDIO_BASE, name);
  } catch (_) {
    // If it's a bare filename or relative path, join with base
    if (/^(?:[^:]+)\.(mp3|ogg|wav)$/i.test(url))
      return joinBase(AUDIO_BASE, url);
    return url;
  }
};

// Raw tracks list; URLs will be proxied at export time if CF proxy is configured
const rawTracks = [
  {
    url: '',
    duration: 0,
    metaData: { title: "enjoy!", artist: "songs i've made :)", album },
  },
  {
    url: '{Audio_Base}/yesu - have fun remix.mp3',
    duration: 96,
    metaData: { title: 'yesu - have fun remix', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/ash - lesserafim remix.mp3',
    metaData: { title: 'ash - lesserafim remix', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/degenrock ft. teto.mp3',
    metaData: { title: 'degenrock ft. teto', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/DERO (OTACHOC Remix).mp3',
    metaData: { title: 'DERO (OTACHOC Remix)', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/e.t..mp3',
    metaData: { title: 'e.t.', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/e2.mp3',
    metaData: { title: 'e2', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/erd tree.mp3',
    metaData: { title: 'erd tree', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/gloom.mp3',
    metaData: { title: 'gloom', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/kensuke ushio would be proud.mp3',
    metaData: { title: 'kensuke ushio would be proud', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/kishhhy hella quiet.mp3',
    metaData: { title: 'kishhhy hella quiet', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/lofitry.mp3',
    metaData: { title: 'lofitry', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/move along.mp3',
    metaData: { title: 'move along', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/psycho.mp3',
    metaData: { title: 'psycho', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/Queencard - i-dle (OTAHOC Remix).mp3',
    metaData: {
      title: 'Queencard - i-dle (OTAHOC Remix)',
      artist: 'me',
      album,
    },
  },
  {
    url: '{Audio_Base}/sad songs.mp3',
    metaData: { title: 'sad songs', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/sighano.mp3',
    metaData: { title: 'sighano', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/sleep.mp3',
    metaData: { title: 'sleep', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/unlearning.mp3',
    metaData: { title: 'unlearning', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/updated psycho.mp3',
    metaData: { title: 'updated psycho', artist: 'me', album },
  },
  {
    url: '{Audio_Base}/ギターと孤独と蒼い惑星 piano lofi!.mp3',
    metaData: {
      title: 'ギターと孤独と蒼い惑星 piano lofi!',
      artist: 'me',
      album,
    },
  },
  {
    url: '',
    duration: 0,
    metaData: {
      title:
        'try automating soundcloud post -> crawling cloudflare worker -> upload to r2 -> add here',
      artist: 'note to self',
      album,
    },
  },
];

export const initialTracks = rawTracks.map(t => ({
  ...t,
  url: proxyUrl(withBase(t.url)),
}));
