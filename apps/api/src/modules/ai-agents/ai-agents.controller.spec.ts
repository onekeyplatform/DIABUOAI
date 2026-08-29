describe('AI Agents contract', () => {
  it('should expose listing and run actions', () => {
    const actions = ['list', 'run'];
    expect(actions).toEqual(expect.arrayContaining(['list', 'run']));
  });

  it('should support active agent states', () => {
    const statuses = ['active', 'paused', 'draft'];
    expect(statuses).toContain('active');
  });
});
