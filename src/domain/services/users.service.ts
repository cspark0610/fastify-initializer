export class UsersService {
  users: { id: number; name: string }[];
  constructor() {
    this.users = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Alice' }
    ];
  }

  async getUsers(req) {
    req.log.info('Getting users');
    return this.users;
  }
}
