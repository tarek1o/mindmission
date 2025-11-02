export interface OAuthPlatform {
  clientId: string;
  clientSecret: string;
  scopeUrl: string;
  tokenUrl: string;
}

export interface OAuth {
  linkedin: OAuthPlatform;
  gmail: OAuthPlatform;
  facebook: OAuthPlatform;
  twitter: OAuthPlatform;
}
