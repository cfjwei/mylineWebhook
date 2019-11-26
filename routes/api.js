var express = require('express');
var router = express.Router();
const AssistantController = require('../Controller/AssistantController');
const MongodbCtl = require('../Controller/MongodbController');
MongodbCtl.init();
/**
 * sTime
 * eTime
 */
router.post('/db/find', async function (req, res, next) {
    console.log(JSON.stringify(req.body, null, 2));

    let nosqlQuery = {
        timestamp: {
            '$gt': req.body.sTime,
            '$lt': req.body.eTime
        }
    }

    let findResult = await MongodbCtl.find('LineBot', 'chatLog', {})
    //console.log(findResult);
    res.status(200).send(findResult);
});

router.post('/chat', async function (req, res, next) {
    console.log(req.body);
    let params = req.body;

    let assistantReturn = await AssistantController.sendMessage(params.userId, params.userSay);

    console.log('[assistantReturn]', assistantReturn);

    res.status(200).send({
        success: true,
        message: assistantReturn.message
    });

});
module.exports = router;