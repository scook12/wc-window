import { Component, Host, Listen, Prop, State, VNode, h } from '@stencil/core';


export interface IRenderItemProps {
  index: number;
  style: {
    position: string;
    top: string;
    width: string;
  }
}

const renderBasicItem = (props: IRenderItemProps) => {
  const { index, style } = props;
  return <div style={style}>Row {index}</div>
}

@Component({
  tag: 'wc-fixed-length-list',
  styleUrl: 'wc-fixed-length-list.css',
  shadow: true,
})
export class WcFixedLengthList {
  @Prop() numItems: number
  @Prop() itemHeight: number
  @Prop() windowHeight: number
  @Prop() renderItem: (props: IRenderItemProps) => VNode = renderBasicItem

  @State() scrollTop: number = 0

  private get innerHeight() {
    return this.numItems * this.itemHeight
  }

  private get startIndex() {
    return Math.floor(this.scrollTop / this.itemHeight)
  }

  private get endIndex() {
    return Math.min(
      this.numItems - 1, // don't render past the end of the list
      Math.floor((this.scrollTop + this.windowHeight) / this.itemHeight)
    );
  }

  private get itemsToRender() {
    const items = []
    const { itemHeight, startIndex, endIndex, renderItem } = this
    for (let i = startIndex; i <= endIndex; i++) {
      items.push(
        renderItem({ 
          index: i,
          style: { 
            position: 'absolute',
            top: `${i * itemHeight}px`,
            width: '100%',
          } 
        })
      )
    }
    return items
  }


  onScroll(e: any) {
    this.scrollTop = e.currentTarget.scrollTop
  }

  render() {
    return (
      <Host>
        <div id='container' style={{ overflowY: 'scroll', height: `${this.windowHeight}px` }} onScroll={(e) => this.onScroll(e)}>
          <div id='scroller' style={{ position: 'relative', height: `${this.innerHeight}px`}}>
            {this.itemsToRender}
          </div>
        </div>
      </Host>
    );
  }
}
