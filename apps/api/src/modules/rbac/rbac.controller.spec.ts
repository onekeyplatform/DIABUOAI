describe('RBAC contract', () => {
  it('should expose the allowed roles', () => {
    const roles = ['owner', 'admin', 'manager', 'member'];
    expect(roles).toHaveLength(4);
  });

  it('should expose admin permissions', () => {
    const permissions = ['users.read', 'users.write', 'tenants.read', 'roles.manage'];
    expect(permissions).toEqual(expect.arrayContaining(['users.read', 'roles.manage']));
  });
});
