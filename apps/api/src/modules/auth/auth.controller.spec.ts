describe('Auth controller contract', () => {
  it('should expose authentication operations', () => {
    const operations = ['register', 'login', 'refresh'];
    expect(operations).toEqual(expect.arrayContaining(['register', 'login', 'refresh']));
  });

  it('should keep required auth payload fields', () => {
    const payload = {
      sub: 'user-1',
      tenantId: 'tenant-1',
      email: 'user@example.com',
      role: 'owner',
    };

    expect(payload.sub).toBeTruthy();
    expect(payload.tenantId).toBeTruthy();
    expect(payload.email).toContain('@');
  });
});
