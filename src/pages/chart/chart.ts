import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import {SystemService} from '../../services/systemService';
import {ResultBase} from "../../model/result-base";

@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html'
})
export class ChartPage {

  url: string;
  url1:string;

  constructor(public navCtrl: NavController,private alertCtrl:AlertController,private systemService:SystemService) {

  }

  //初始化View
  ionViewDidLoad() {
    this.systemService.createJFreeChartBar().subscribe(
      object => {
        let resultBase:ResultBase=object[0] as ResultBase;
        if(resultBase.result=='true'){
          let urls = object[1];
          this.url=urls[0].url;
          this.url1=urls[0].url1;
        } else {
            let alert = this.alertCtrl.create({
              title: '提示!',
              subTitle: resultBase.message,
              buttons: ['确定']
            });
            alert.present();
        }
      }, () => {
    
      });
  }
}
