$(function() {
    if(liff.isInClient()){
        alert('is client');
        initializeLiff();
    }
});

function initializeLiff() {
    liff
    .init({
        liffId: "1653512466-A2YOxWqM" // use own liffId
    })
    .then(() => {
        alert('init success');
        
        $('#send').click(() => {
            sendMessage();
        })
    })
    .catch(err => {
        alert(err.message);
    });
}

function sendMessage(){
    let message = getMessage()
    liff.sendMessages([
        message
    ])
    .then(() => {
        alert('message sent');
    })
    .catch((err) => {
        alert(err.message)
    });
}

function getMessage(){
    return {  
        "type": "flex",
        "altText": "this is a flex message",
        "contents": {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "回報資訊",
                  "weight": "bold",
                  "size": "xl"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "lg",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "系統",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 1
                        },
                        {
                          "type": "text",
                          "text": "XX系統",
                          "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ]
                    },
                    {
                      "type": "box",
                      "layout": "baseline",
                      "spacing": "sm",
                      "contents": [
                        {
                          "type": "text",
                          "text": "帳號",
                          "color": "#aaaaaa",
                          "size": "sm",
                          "flex": 1
                        },
                        {
                          "type": "text",
                          "text": "XXXXXX",
                          "wrap": true,
                          "color": "#666666",
                          "size": "sm",
                          "flex": 5
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
      }
}