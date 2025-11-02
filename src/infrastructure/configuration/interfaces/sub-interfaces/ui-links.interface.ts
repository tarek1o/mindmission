interface UIHost {
  origin: string;
}

interface ResetPasswordURL {
  resetPasswordURL: string;
}

interface DashboardLinks extends UIHost, ResetPasswordURL {
  origin: string;
  resetPasswordURL: string;
  setPasswordURL: string;
  changeEmailURL: string;
}

interface MainAppLinks extends UIHost, ResetPasswordURL {
  origin: string;
  resetPasswordURL: string;
  emailVerificationURL: string;
  changeEmailURL: string;
}

export interface UILinks {
  dashboard: DashboardLinks;
  mainApp: MainAppLinks;
}
