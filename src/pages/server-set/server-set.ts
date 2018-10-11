import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import {FormBuilder} from "@angular/forms";
import {Validators} from "../../providers/Validators";
import {Storage} from '@ionic/storage';
import {GlobalData} from "../../providers/GlobalData";
import {APP_SERVE_IP,APP_PORT_NATIVE} from "../../providers/Constants";
import { NativeService} from "../../providers/NativeService";

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
  	private globalData:GlobalData,
    private nativeService: NativeService) {
  	this.form = this.formBuilder.group({
      serverIP: ['', [Validators.required]],
      serverPort:['', [Validators.required]]
    });
  }


  onSubmit() {
    let serverIP = this.form.value.serverIP;
    let serverPort = this.form.value.serverPort;
    /*this.mineService.updateUserPassword(oldPsw, newPsw).subscribe(res => {
      this.nativeService.showToast('密码修改成功');
      this.dismiss();
    });*/

    if(this.nativeService.isMobile()){
      this.storage.set("SERVERIP",serverIP);
      this.globalData.serverIP=serverIP;

      this.storage.set("SERVERPORT",serverPort);
      this.globalData.serverPort=serverPort;

      this.storage.set("SERVER",serverIP+","+serverPort);
    }
    this.dismiss();
  }

  ionViewDidLoad() {
    this.storage.get('SERVERIP').then((serverIp: string) => {
      if(serverIp){
        this.form.patchValue({
            serverIP:serverIp,
        });
      }else{
      	this.form.patchValue({
            serverIP:APP_SERVE_IP
        });
      }
  	});

    this.storage.get('SERVERPORT').then((serverPort: string) => {
      if(serverPort){
        this.form.patchValue({
            serverPort:serverPort,
        });
      }else{
        this.form.patchValue({
            serverPort:APP_PORT_NATIVE
        });
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
