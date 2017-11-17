import { Directive, ElementRef, Input } from '@angular/core';
import { AcceptReviewStatus } from '../enums/enums';

@Directive({ selector: '[tab]' })
export class TabAcceptApprovalDirective {
  @Input('tab') set topic(topic: any) {
    this.setStyle(topic);
  }

  private el: HTMLElement;
  private tabMaps: Array<{code: string, name: string}> = AcceptReviewStatus;

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
      this.el.textContent = this.getValue(topic.reviewStatus);
      
      if (topic.reviewStatus=='0') {
        this.el.style.background = '#32DB64';
        this.el.style.color = '#fff';
      }
      else if (topic.reviewStatus=='99') {
        this.el.style.background = '#BDAE52';
        this.el.style.color = '#fff';
      }else if (topic.reviewStatus=='1') {
        this.el.style.background = '#3374de';
        this.el.style.color = '#fff';
      }
      else {
        this.el.style.background = '#f53d3d';
        this.el.style.color = '#fff';
      }
    }
  }

  private getValue(code: string): string {
    for(let item of this.tabMaps) {
      if (item.code == code) {
        return item.name;
      }
    }
    return code;
  }
}
