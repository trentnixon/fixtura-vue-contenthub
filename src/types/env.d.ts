declare namespace NodeJS {
  interface ProcessEnv {
    readonly VUE_APP_API_BASE_URL: string;
    readonly VUE_APP_API_KEY: string;
    readonly VUE_APP_USERNAME: string;
    readonly VUE_APP_PASSWORD: string;
    readonly VUE_APP_POSTHOG_KEY: string;
    readonly VUE_APP_POSTHOG_HOST: string;
    readonly VUE_APP_FEATURE_ANALYTICS: string;
    readonly VUE_APP_AUTH_ME_PATH: string;
  }
}
