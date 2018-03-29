import { Directive, ElementRef, Input } from '@angular/core';
import { InvoiceSendStatus } from '../enums/enums';

@Directive({ selector: '[tab]' })
export class TabInvoicePaymentListDirective {
  @Input('tab') set topic(topic: any) {
    this.setStyle(topic);
  }

  private el: HTMLElement;
  private tabMaps: Array<{code: number, name: string}> = InvoiceSendStatus;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
    this.setStyle(this.topic);
  }

  private setStyle(topic) {
    if (topic) {
      this.el.style.borderRadius = '3px';
      this.el.style.paddingLeft='7px';
      this.el.style.paddingRight='7px';
      this.el.style.paddingTop='4px';
      this.el.style.paddingBottom='4px';
      this.el.textContent = this.getValue(topic.sendStatus);
      
      if (topic.sendStatus==0) {
        this.el.style.background = '#32DB64';
        this.el.style.color = '#fff';
      }
      else if (topic.sendStatus=='1') {
        this.el.style.background = '#BDAE52';
        this.el.style.color = '#fff';
      }else if (topic.sendStatus=='3') {
        this.el.style.background = '#3374de';
        this.el.style.color = '#fff';
      }
      else {
        this.el.style.background = '#f53d3d';
        this.el.style.color = '#fff';
      }
    }
  }

  private getValue(code: number): string {
    for(let item of this.tabMaps) {
      if (item.code == code) {
        return item.name;
      }
    }
    return code.toString();
  }
}
