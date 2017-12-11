import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import {FormBuilder} from "@angular/forms";
import {Validators} from "../../providers/Validators";
import {Storage} from '@ionic/storage';
import {GlobalData} from "../../providers/GlobalData";
import {APP_SERVE_IP} from "../../providers/Constants";

/**
 * Generated class for the ServerSetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-server-set',
  templateUrl: 'server-set.html',
})
export class ServerSetPage {
  form: any;

  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	private viewCtrl: ViewController,
  	private formBuilder: FormBuilder,
  	private storage: Storage,
  	private globalData:GlobalData) {
  	this.form = this.formBuilder.group({
      serverIP: ['', [Validators.required]]
    });
  }


  onSubmit() {
    let serverIP = this.form.value.serverIP;
    /*this.mineService.updateUserPassword(oldPsw, newPsw).subscribe(res => {
      this.nativeService.showToast('密码修改成功');
      this.dismiss();
    });*/

    this.storage.set("SERVERIP",serverIP);
    this.globalData.serverIP=serverIP;
    this.dismiss();
  }

  ionViewDidLoad() {
    this.storage.get('SERVERIP').then((serverIp: string) => {
      if(serverIp){
        this.form.patchValue({
            serverIP:serverIp
        });
      }else{
      	this.form.patchValue({
            serverIP:APP_SERVE_IP
        });
      }
  	});
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
