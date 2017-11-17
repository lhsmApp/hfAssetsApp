import { Directive, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[yfktype]' })
export class YfkTypeDirective {
  @Input('yfktype') set type(type: any) {
    this.setStyle(type);
  }

  private el: HTMLElement;
  private tabMaps: Array<{key: string, value: string}> = [
    {
      key: '1',
      value: '预付款',
    },
    {
      key: '2',
      value: '进度款',
    },
    {
      key: '3',
      value: '竣工款',
    },
    {
      key: '4',
      value: '质保金',
    }
  ]

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
    this.setStyle(this.type);
  }

  private setStyle(topic) {
    if (topic) {
      this.el.style.borderRadius = '3px';
      this.el.style.paddingLeft='7px';
      this.el.style.paddingRight='7px';
      this.el.style.paddingTop='4px';
      this.el.style.paddingBottom='4px';
      if (topic.reviewStatus=='1') {
        this.el.textContent = '预付款';
        this.el.style.background = '#32DB64';
        this.el.style.color = '#fff';
      }
      else if (topic.reviewStatus=='2') {
        this.el.textContent = '进度款';
        this.el.style.background = '#BDAE52';
        this.el.style.color = '#fff';
      }else if (topic.reviewStatus=='3') {
        this.el.textContent = '竣工款';
        this.el.style.background = '#3374de';
        this.el.style.color = '#fff';
      }
      else {
        this.el.textContent = this.getValue('4');
        this.el.style.background = '#f53d3d';
        this.el.style.color = '#fff';
      }
    }
  }

  private getValue(key: string): string {
    for(let item of this.tabMaps) {
      if (item.key === key) {
        return item.value;
      }
    }
  }
}
