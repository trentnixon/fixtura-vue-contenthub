declare namespace NodeJS {
  interface ProcessEnv {
    readonly VUE_APP_API_BASE_URL: string;
    readonly VUE_APP_API_KEY: string;
    readonly VUE_APP_USERNAME: string;
    readonly VUE_APP_PASSWORD: string;
    readonly NEXT_PUBLIC_POSTHOG_KEY: string;
    readonly NEXT_PUBLIC_POSTHOG_HOST: string;
    readonly NEXT_PUBLIC_FEATURE_ANALYTICS: string;
  }
}
