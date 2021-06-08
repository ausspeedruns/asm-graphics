export interface GoogleToken {
    accessToken:  string;
    refreshToken: string;
    scope:        string;
    tokenType:    string;
    expiryDate:   number;
}