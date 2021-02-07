const Chat = require("../models/chat");
const user_controller = require("./userController");
const place_controller = require("./placeController");

exports.getChatList = function(req,res,next) {
    Chat
    .find({})
    .populate("user place")
    .exec(function(err, chats) {
        if (err) throw err;
        let arr = [];
        for (let i in chats) {
            console.log("res.locals.userID:", res.locals.userID, "chat[i].user._id:", chats[i].user._id)
            if (chats[i].user._id == res.locals.userID)
                arr.push(chats[i]);
        }
        console.log(arr);
        res.send(arr);
    });
};

exports.getChat = async function(req, res, next) {
    if (res.statusCode === 401 || res.statusCode === 403) {
        res.send();
        return;
    }
    Chat
    .find({})
    .populate("user place")
    .exec(async function(err, chats) {
        if (err) throw err;

        let chat;
        for (let i in chats) {
            if (chats[i].user._id == res.locals.userID && chats[i].place._id == req.body.placeID) {
                console.log("FOUND THE CHAT:", chats[i]._id);
                chat = chats[i];
                break;
            }
        }

        if (chat != undefined)
            res.redirect(chat.url);
        
        else {
            const place = await place_controller.getPlaceByID(req.body.placeID);
            const newChat = new Chat({
                user: res.locals.user,
                place: place,
                content: []
            });
            await newChat.save();
            res.redirect(newChat.url);
        }
    });
}

exports.sendMessage = async function(req, res, next) {
    const chat = await Chat.findById(req.body.chatID);
    console.log(chat);
    const content = {
        sender: req.body.sender,
        message: req.body.message,
        date: Date.now()
    };
    console.log("content: ", content);
    chat.content.push(content);
    await chat.save();
    res.redirect("back");
}

exports.getConversation = async function(req, res, next) {
    const chat = await Chat.findById(req.params.id);
    const place = await place_controller.getPlaceByID(chat.place);
    console.log(chat)
    //chat.place.populate("location");
    if (chat == undefined) {
        res.sendStatus(500);
    }
    else {
        res.send({chat: chat, place: place});
    }
}