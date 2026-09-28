/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SPOTIFY_CLIENT_ID: string | undefined;
  readonly SPOTIFY_CLIENT_SECRET: string | undefined;
  readonly SPOTIFY_SHOW_ID: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
