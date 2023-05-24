// import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { ViserWebSocket } from '../../components/Viser/WebSocket/ViserWebSocket';
import  App  from './App';
import store from '../../store';
import axios from 'axios';


window.addEventListener("beforeunload", function(event) {
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get('id');
  const formdata = new FormData();
    formdata.append('title', id);
  const url = 'http://10.177.35.76:8081/api/viewerClose';
  const result = this.navigator.sendBeacon(url, formdata);
  if (!result) {
    axios.post('http://10.177.35.76:8080/api/viewerClose',formdata)
    .then((response)=>{
      console.log(response)
    }).catch((err)=>{
      console.log(err)
    })
  }
})
const ShowModel = () => {

  return (
    <Provider store={store}>
      <ViserWebSocket>
        <App />
      </ViserWebSocket>
    </Provider>
  );
};

export default ShowModel;
