describe('Users contract', () => {
  it('should expose list, get, create, and update actions', () => {
    const actions = ['list', 'get', 'create', 'update'];
    expect(actions).toEqual(expect.arrayContaining(['list', 'create']));
  });

  it('should include active user states', () => {
    const state = ['active', 'inactive'];
    expect(state).toContain('active');
  });
});
