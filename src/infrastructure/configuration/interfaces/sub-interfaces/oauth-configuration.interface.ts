export interface OAuthConfiguration {
  google: {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope: string[];
  };
}