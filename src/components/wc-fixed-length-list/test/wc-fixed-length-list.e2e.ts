import { newE2EPage } from '@stencil/core/testing';

describe('wc-fixed-length-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<wc-fixed-length-list></wc-fixed-length-list>');

    const element = await page.find('wc-fixed-length-list');
    expect(element).toHaveClass('hydrated');
  });
});
