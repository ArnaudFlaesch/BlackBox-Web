export class User {
    _id: number;
    name: string;
    firstname: string;
    email: string;
    password: string;
    isPremiumUser: Boolean;
    premiumDateOfExpiration: Date;
    storageSpace: Number;

  public User() {}
}
