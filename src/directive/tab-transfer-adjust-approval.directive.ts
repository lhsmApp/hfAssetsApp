
import { Directive, ElementRef, Input } from '@angular/core';
import { TransferFundsReviewStatus } from '../enums/enums';

/*
reviewStatus:" 单据状态"
转资后端字段解释(括号中代表客户端对应字段)
0未提交(新增)
1未审批(待审批)
2已驳回(退回)
3审批中(待审批)
4已审批(已审批)
*/

@Directive({ selector: '[tab]' })
export class TabTransferAdjustApprovalDirective {
  @Input('tab') set topic(topic: any) {
    this.setStyle(topic);
  }

  private el: HTMLElement;
  private tabMaps: Array<{code: string, name: string}> = TransferFundsReviewStatus;

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
      }else if (topic.reviewStatus=='4') {
        this.el.style.background = '#3374de';
        this.el.style.color = '#fff';
      }
      else if (topic.reviewStatus=='1') {
        this.el.style.background = '#BDAE52';
        this.el.style.color = '#fff';
      }
      else if (topic.reviewStatus=='3') {
        this.el.style.background = '#BDAE52';
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
