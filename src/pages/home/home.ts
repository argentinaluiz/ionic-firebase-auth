import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import firebase from 'firebase/app';
import firebaseConfig from '../../app/firebase-config';
import 'firebase/auth';
import 'firebase/database';
declare const cordova;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    verificationCode = '';
    verificationId = '';
    constructor(public navCtrl: NavController, private platform: Platform) {
        firebase.initializeApp(firebaseConfig);

    }

    ionViewDidLoad() {
        this.platform.ready().then(() => {
            cordova.plugins.firebase.auth.verifyPhoneNumber('+55XXXXXXXXXXXXXXXXXXXXXXXX', 0)
                .then(
                    verificationId => {
                        this.verificationId = verificationId;
                        console.log('verificationId',verificationId)
                    },
                    error => {
                        console.log('verificationIdError',error);
                    }
                );
        });
    }

    verificar() {
        cordova.plugins.firebase.auth.onAuthStateChanged((userInfo) =>{
            if (userInfo && userInfo.uid) {
                console.log('userInfo from Cordova',userInfo);
                const fbCredential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.verificationCode)
                firebase.auth()
                    .signInAndRetrieveDataWithCredential(fbCredential)
                    .then(
                        (user) => {
                            console.log('User authenticated',user);
                        },
                        (error) => {
                            console.log('User not authenticated',error);
                        }
                    );
            } else {
                // user was signed out
            }
        });
        // cordova.plugins.firebase.auth
        //     .signInWithVerificationId(this.verificationId, this.verificationCode)
        //     .then(
        //         (userInfo) => {
        //             console.log(userInfo)
        //         },
        //         (error) => {
        //             console.log(error);
        //         }
        //     )
    }

}
