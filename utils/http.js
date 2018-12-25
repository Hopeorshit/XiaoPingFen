import {
  Base
} from './base.js'

class Login extends Base {
  constructor() {
    super();
  }
  encrypt(encryptedData, iv, callBack, fcallBack) {
    var params = {
      url: 'user/encrypt_user_info',
      sCallBack: function (res) {
        callBack && callBack(res);
      },
      fCallBack: function (res) {//失败的回调函数
        fcallBack && fcallBack(res);
      },
      method: 'POST',
      data: {
        encryptedData: encryptedData,
        iv: iv
      }
    };
    this.request(params);
  }
  
  bindID(name,id,callBack){
    var params = {
      url: 'user/bind_id',
      sCallBack: function (res) {
        callBack && callBack(res);
      },
      method: 'POST',
      data: {
        name: name,
        id: id
      }
    };
    this.request(params);
  }
}

export { Login }


class NewRoom extends Base {
  constructor() {
    super();
  }
  newRoom(name,callBack) {
    var params = {
      url: 'room/new',
      sCallBack: function (res) {
        callBack && callBack(res);
      },
      method: 'POST',
      data: {
        name:name
      }
    };
    this.request(params);
  }

  speakerAdd(room_id, callBack) {
    var params = {
      url: 'room/speaker_add',
      sCallBack: function (res) {
        callBack && callBack(res);
      },
      method: 'POST',
      data: {
        room_id: room_id
      }
    };
    this.request(params);
  }
}

export { NewRoom }



class Room extends Base {
  constructor() {
    super();
  }
  owner(room_id, callBack) {
    var params = {
      url: 'room/owner?room_id='+room_id,
      sCallBack: function (res) {
        callBack && callBack(res);
      },
    };
    this.request(params);
  }
  speakerAdd(room_id, callBack) {
    var params = {
      url: 'room/speaker_add',
      sCallBack: function (res) {
        callBack && callBack(res);
      },
      method: 'POST',
      data: {
        room_id: room_id
      }
    };
    this.request(params);
  }
  start(room_id, callBack) {
    var params = {
      url: 'room/start',
      sCallBack: function (res) {
        callBack && callBack(res);
      },
      method: 'POST',
      data: {
        room_id: room_id
      }
    };
    this.request(params);
  }
  scoreNew(room_id,score,callBack){
    var params = {
      url: 'score/new',
      sCallBack: function (res) {
        callBack && callBack(res);
      },
      method: 'POST',
      data: {
        room_id: room_id,
        score:score
      }
    };
    this.request(params);
  }
  scoreAll(room_id,callBack){
    var params = {
      url: 'score/all?room_id='+room_id,
      sCallBack: function (res) {
        callBack && callBack(res);
      },
    };
    this.request(params);
  }
}
export { Room }


class Index extends Base {
  constructor() {
    super();
  }
  roomAll(callBack) {
    var params = {
      url: 'room/all',
      sCallBack: function (res) {
        callBack && callBack(res);
      },
    };
    this.request(params);
  }
}
export { Index }