import * as React from 'react';
import Sound from 'react-native-sound';
import {AppState} from 'react-native'

// const backgroundMusic = new Sound(require('../Sound/Background.mp3'));

export default class BackgroundProcesses extends React.Component {

    // componentWillMount() {
    //     AppState.addEventListener('change', this._handleAppStateChange);


    //     backgroundMusic.setNumberOfLoops(-1);
    //     setTimeout(() => {
    //       const repeatPlay = () => {
    //         backgroundMusic.play();
    //         setTimeout(() => {
    //           repeatPlay();
    //         }, 1);
    //       };
    //       backgroundMusic.setVolume(.3);
    //       repeatPlay();
    //     }, 2000);
    //   }
    //   componentWillUnmount(){
    //     AppState.removeEventListener('change', this._handleAppStateChange);

    //     backgroundMusic.stop();
    //   }

      // _handleAppStateChange(currentAppState) {
      //   if(currentAppState == "background") {
      //       backgroundMusic.pause();
      //   } 
      //   if(currentAppState == "active") {
      //       backgroundMusic.play();
      //   }
      // }

      render(){
          return null;
      }
      
}