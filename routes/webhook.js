var express = require('express');
var router = express.Router();
var https = require('https');
const configs = require('../config.js');
const AssistantCtl = require('../Controller/AssistantController.js');
const ChannelAccessKey = configs.channelAccessToken;
const line = require('@line/bot-sdk');

const MongodbCtl = require('../Controller/MongodbController');
MongodbCtl.init();

const client = new line.Client({
  channelAccessToken: ChannelAccessKey
});
// logger simple-node-logger
const SimpleNodeLogger = require('simple-node-logger');

// const MongoClient = require('mongodb').MongoClient;

// //const uri = 'mongodb+srv://rock:rock@clusterrock-ynvoh.gcp.mongodb.net/test?retryWrites=true&w=majority';
// const uri ='mongodb+srv://BigGG:stevebiggg@cluster0-z33ci.mongodb.net/test?retryWrites=true&w=majority';
// const Mclient = new MongoClient(uri, { //useNewUrlParser: true 
//   useUnifiedTopology: true 
// });
// Mclient.connect((err,db) => {
//   if (!err) { console.log('connect to MongoDB'); } 
//   else { console.log('errLog:',err); }

//   var dbo = db.db("runoob");
//   var myobj = { name: "菜鸟教程", url: "www.runoob" };
//   dbo.collection("site").insertOne(myobj, function(err, res) {
//       if (err) throw err;
//       console.log("文档插入成功");
//       db.close();
//   });
//   //const collection = Mclient.db("test").collection("devices");
//   // perform actions on the collection object
//   Mclient.close();
// });

const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

let lineUserSession = {

};


router.post('/line', async function (req, res, next) {

  logger.log('webhook received an event');
  res.status(200).send();

  let targetEvent = req.body.events[0];
  if (targetEvent.type == 'message') {

    if (targetEvent.message.type == 'text') {

      // 取出 userId & user 説的文字
      let userId = targetEvent.source.userId,
        userSay = targetEvent.message.text;

      logger.log(userId, 'says:', userSay);

      // 取得回覆
      let result = await AssistantCtl.sendMessage(userId, userSay);

      // 將回覆傳回給user
      replyToLine(targetEvent.replyToken, result);
      logger.log(userId, 'return message:', result);

      //紀錄ＤＢ
      let document = {
        timestamp : Date.now(),
        userId : userId,
        userSay : userSay,
        AssistantReturn : result
      }
      MongodbCtl.insertOne('LineBot','chatLog',document)
    }
  }
});

module.exports = router;

function replyToLine(rplyToken, messages) {
  client.replyMessage(rplyToken, messages)
    .then((result) => {
      console.log('seccess:', result);
    })
    .catch((err) => {
      console.log('err:', err);
    });
}

let AssistantController = {
  init: function () {
    this.service = new AssistantV2({
      version: '2019-02-28',
      authenticator: new IamAuthenticator({
        apikey: configs.assistant.apiKey,
      }),
      url: configs.assistant.url,
    });
    console.log('debug:', this.service);
  },
  createSession: function () {
    return this.service.createSession({
      assistantId: configs.assistant.assistantId
    }).then(res => {
      return res.result;
    }).catch(err => {
      console.log('createSession', err);
      return err.body;
    });
  },
  deleteSession: function (session_id) {
    return this.service.deleteSession({
      assistantId: configs.assistant.assistantId,
      sessionId: session_id,
    }).then(res => {
      return res.result;
    }).catch(err => {
      console.log('deleteSession', err);
      return err.body;
    });
  },
  message: function (text, session_id) {
    return this.service.message({
      assistantId: configs.assistant.assistantId,
      sessionId: session_id,
      input: {
        'message_type': 'text',
        'text': text
      }
    })
      .then(res => {
        // console.log(JSON.stringify(res, null, 2));
        return res.result;
      }).catch(err => {
        console.log('message', err);
        return err.body;
      });
  }
}
AssistantController.init();

let logger = {
  init: function (fileName) {
    const opts1 = {
      logDirectory: './logs',
      fileNamePattern: `${fileName}-<DATE>.log`,
      dateFormat: 'YYYY-MM-DD',
      timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
    };
    this.normalLogger = SimpleNodeLogger.createRollingFileLogger(opts1);

    const opts2 = {
      logDirectory: './logs',
      fileNamePattern: `${fileName}-error-<DATE>.log`,
      dateFormat: 'YYYY-MM-DD',
      timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
    };
    this.errorLogger = SimpleNodeLogger.createRollingFileLogger(opts2);
  },
  log: function () {
    let mylog = `${Object.values(arguments).join(' ')}`;

    this.normalLogger.info(mylog);
  },
  error: function () {
    let mylog = `${Object.values(arguments).join(' ')}`;

    this.errorLogger.error(mylog);
  }
}
logger.init('webhook');

function test(){
  console.log('start initMongodb');
  let initMongodb = await MongodbCtl.init(); 
  console.log('initMongodb:', initMongodb);
  console.log('start insertResult');
  let insertResult = await MongodbCtl.insertOne('testDB', 'testCollection', {test: 'test'}); 
  console.log('insertResult:', insertResult);
  }

test();