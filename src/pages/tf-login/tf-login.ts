import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { DomSanitizer} from '@angular/platform-browser'; 

/**
 * Generated class for the TfLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tf-login',
  templateUrl: 'tf-login.html',
})
export class TfLoginPage {

  myurl = 'http://221.238.231.122:9010/abiplatform';
  srcUrl:any;  
  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl: ViewController,private sanitizer: DomSanitizer) {
  	
    this.srcUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.myurl);  

    

    
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TfLoginPage');
  }

  loaded() {  
  	var token=document.cookie.indexOf("CASTGC");
  	console.log("test"+document.cookie);
    console.log("ok"+frames.document.cookie);
  }

  tfLogin1(){

  	var token=document.cookie.indexOf("CASTGC");
  	console.log("test"+document.cookie);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
