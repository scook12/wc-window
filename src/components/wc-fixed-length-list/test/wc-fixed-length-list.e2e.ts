import { newE2EPage } from '@stencil/core/testing';

describe('wc-fixed-length-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(/*html*/`<wc-fixed-length-list></wc-fixed-length-list>`);
    await page.$eval('wc-fixed-length-list', (elm: HTMLWcFixedLengthListElement) => {
      elm.numItems = 104
      elm.itemHeight = 50
      elm.windowHeight = 400
    })

    await page.waitForChanges()

    const element = await page.find('wc-fixed-length-list');
    expect(element).toHaveClass('hydrated');
    expect(element.shadowRoot).not.toBeNull()
    expect(element.shadowRoot.querySelector('p').textContent).toEqual('POI: Dunn Mccarty, male - aged 26. Contact: dunnmccarty@zenolux.com')
    expect(element.shadowRoot.querySelectorAll('p').length).toEqual(9)
  });
});
