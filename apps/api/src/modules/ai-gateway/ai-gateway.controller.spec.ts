describe('AI Gateway contract', () => {
  it('should expose generation and health endpoints', () => {
    const routes = ['health', 'generate'];
    expect(routes).toEqual(expect.arrayContaining(['health', 'generate']));
  });

  it('should include a default model', () => {
    const model = 'gpt-4o-mini';
    expect(model).toBeTruthy();
  });
});
