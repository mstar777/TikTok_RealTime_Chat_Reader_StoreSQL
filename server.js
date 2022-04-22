require('dotenv').config();

let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tiktok'
});

connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
});

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { WebcastPushConnection } = require('tiktok-live-connector');
const { Console } = require('console');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

let globalConnectionCount = 0;
let roomId = "";
setInterval(() => {
    io.emit('statistic', { globalConnectionCount });
}, 5000)


io.on('connection', (socket) => {
    let chatConnection;

    function disconnectChat() {
        if (chatConnection) {
            chatConnection.disconnect();
            chatConnection = null;
        }
    }

    socket.on('setUniqueId', (uniqueId, options) => {

        console.log('connecting', uniqueId, options);

        let thisConnection = new WebcastPushConnection(uniqueId, options);

        thisConnection.connect().then(state => {
            disconnectChat();
            chatConnection = thisConnection;
            if (!socket.connected) {
                disconnectChat();
                return;
            }
            socket.emit('setUniqueIdSuccess', state);
            roomId = state.roomId;
            var sql = "INSERT INTO tik_room(roomId) VALUES('"+roomId+"')";
            connection.query(sql, function (err, result) {  
                if (err) throw err;  
                console.log("1 record inserted into tik_room table.");  
            });
        }).catch(err => {
            socket.emit('setUniqueIdFailed', err.toString());
        })

        thisConnection.on('gift', (msg) => {
            
            socket.emit('gift', msg);
            if(msg.gift.repeat_end == 1)
                return;

            var sql = "INSERT INTO tik_gift(userId, giftId, profilePictureUrl, uniqueId, gift_desc, gift_icon, gift_image,gift_name, gift_diamondCount, gift_type, gift_repeat_count, gift_repeat_end, roomId)"+
            " VALUES('"+msg.userId+"','"+msg.giftId+"','"+msg.profilePictureUrl+"','"+
            msg.uniqueId+"','"+msg.extendedGiftInfo.describe+"','"+
            msg.extendedGiftInfo.icon.url_list[0]+"','"+msg.extendedGiftInfo.image.url_list[0]+"','"+msg.extendedGiftInfo.name+"','"+
            msg.extendedGiftInfo.diamond_count+"','"+msg.gift.gift_type+"','"+
            msg.gift.repeat_count+"','"+msg.gift.repeat_end+"','"+roomId+"')";

            connection.query(sql, function (err, result) {  
                if (err) throw err;  
                console.log("1 record inserted");  
            });
        });
        thisConnection.on('chat', (msg) => {
            socket.emit('chat', msg);
            var comments = "";
            if (typeof msg.comment !== "undefined")
            comments = msg.comment.substring(msg.comment.indexOf('+')+1,msg.comment.lastIndexOf('+') );

            var sql = "INSERT INTO tik_chat(profilePictureUrl,uniqueId, comments, roomId)VALUES" +
            "('"+msg.profilePictureUrl+"','"+ msg.uniqueId+ "','"+comments+"','"+roomId+"')";
            connection.query(sql, function (err, result) {  
                if (err) throw err;  
                console.log("1 record inserted");  
            });  
        });
        thisConnection.on('like', (msg) => {
            socket.emit('like', msg)
            if (typeof msg.likeCount === 'number') {
                var comments = "";
                if (typeof msg.comment !== "undefined")
                comments = msg.comment.substring(msg.comment.indexOf('+')+1,msg.comment.lastIndexOf('+') );
                var sql = "INSERT INTO tik_chat(profilePictureUrl,uniqueId, comments, likeCount ,roomId)VALUES" +
                "('"+msg.profilePictureUrl+"','"+ msg.uniqueId+ "','"+comments+"','"+msg.likeCount+"','"+roomId+"')";
                connection.query(sql, function (err, result) {  
                    if (err) throw err;  
                    console.log("1 record inserted");  
                }); 
            }
            if (typeof msg.totalLikeCount === 'number') {
                var sql = "UPDATE tik_room SET totalLikeCount = '"+msg.totalLikeCount+"' WHERE roomId ='"+roomId+"'";
                connection.query(sql, function (err, result) {  
                    if (err) throw err;  
                    console.log("1 record updated in tik_room table.");  
                });
            }
        });
        thisConnection.on('member', (msg) => {
            socket.emit('member', msg);
            // var sql = "INSERT INTO tik_chat(profilePictureUrl,uniqueId, comments, roomId)VALUES" +
            // "('"+msg.profilePictureUrl+"','"+ msg.uniqueId+ "','"+"joined"+"','"+roomId+"')";
            // connection.query(sql, function (err, result) {  
            //     if (err) throw err;  
            //     console.log("1 record inserted into tik_chat table.");  
            // });
        });
        thisConnection.on('social', (msg) => {
            socket.emit('social', msg);
            var comments = "";
            if (typeof msg.comment !== "undefined")
            comments = msg.comment.substring(msg.comment.indexOf('+')+1,msg.comment.lastIndexOf('+') );
            var sql = "INSERT INTO tik_chat(profilePictureUrl,uniqueId, comments, roomId)VALUES" +
            "('"+msg.profilePictureUrl+"','"+ msg.uniqueId+ "','"+comments+"','"+roomId+"')";
            connection.query(sql, function (err, result) {  
                if (err) throw err;  
                console.log("1 record inserted into tik_chat");  
            });
        });
        thisConnection.on('roomUser', (msg) => {
            socket.emit('roomUser', msg);
            if (typeof msg.viewerCount === 'number') {
                var sql = "UPDATE tik_room SET viewerCount= '"+msg.viewerCount+"' WHERE roomId = '"+roomId+"'";
                connection.query(sql, function (err, result) {  
                    if (err) throw err;  
                    console.log("1 record updated in tik_room table.");  
                });
            }
        });

        thisConnection.on('streamEnd', () => socket.emit('streamEnd'));

        thisConnection.on('connected', () => {
            console.log("chatConnection connected");
            globalConnectionCount += 1;
        });

        thisConnection.on('disconnected', () => {
            console.log("chatConnection disconnected");
            globalConnectionCount -= 1;
        });

        thisConnection.on('error', (err) => {
            console.error(err);
        });
    })
    // socket.on('gift', (msg) => {
    //             console.log("gift event emited.");
    //             socket.emit('gift', msg);
    //             var sql = "INSERT INTO tik_gift(userId, giftId, profilePictureUrl, uniqueId, gift_desc, gift_icon, gift_image,gift_name, gift_diamondCount, gift_type, gift_repeat_count, gift_repeat_end, roomId)"+
    //             " VALUES('"+msg.userId+"','"+msg.giftId+"','"+msg.profilePictureUrl+"','"+
    //             msg.uniqueId+"','"+msg.extendedGiftInfo.describe+"','"+
    //             msg.extendedGiftInfo.icon+"','"+msg.extendedGiftInfo.image+"','"+msg.extendedGiftInfo.name+"','"+
    //             msg.extendedGiftInfo.diamond_count+"','"+msg.gift.gift_type+"','"+
    //             msg.gift.repeat_count+"','"+msg.gift.repeat_end+"','"+roomId+"')";
    
    //             connection.query(sql, function (err, result) {  
    //                 if (err) throw err;  
    //                 console.log("1 record inserted");  
    //             });
    // });
    socket.on('chat', (msg) => {
        socket.emit('chat', msg)
        console.log("===>  "+ msg.comment);
        var sql = "INSERT INTO tik_chat(profilePictureUrl,uniqueId, comments, roomId)VALUES" +
        "('"+msg.profilePictureUrl+"','"+ msg.uniqueId+ "','"+msg.comment+"','"+roomId+"')";
        connection.query(sql, function (err, result) {  
            if (err) throw err;  
            console.log("1 record inserted");  
        });  
    });
    // socket.on('like', (msg) => {
    //     socket.emit('like', msg)
    //     if (typeof msg.likeCount === 'number') {
    //         var sql = "INSERT INTO tik_chat(profilePictureUrl,uniqueId, comments, roomId)VALUES" +
    //         "('"+msg.profilePictureUrl+"','"+ msg.uniqueId+ "','"+msg.label+"','"+roomId+"')";
    //         connection.query(sql, function (err, result) {  
    //             if (err) throw err;  
    //             console.log("1 record inserted");  
    //         }); 
    //     }
    //     if (typeof msg.totalLikeCount === 'number') {
    //         var sql = "UPDATE tik_room SET totalLikeCount = "+msg.totalLikeCount+" WHERE roomId ="+roomId;
    //         connection.query(sql, function (err, result) {  
    //             if (err) throw err;  
    //             console.log("1 record updated in tik_room table.");  
    //         });
    //     }
    // });
    // socket.on('member', (msg) => {
    //     socket.emit('member', msg);
    //     var sql = "INSERT INTO tik_chat(profilePictureUrl,uniqueId, comments, roomId)VALUES" +
    //     "('"+msg.profilePictureUrl+"','"+ msg.uniqueId+ "','"+"joined"+"','"+roomId+"')";
    //     connection.query(sql, function (err, result) {  
    //         if (err) throw err;  
    //         console.log("1 record inserted into tik_chat table.");  
    //     });
    // });
    // socket.on('social', (msg) => {
    //     socket.emit('social', msg);
    //     var sql = "INSERT INTO tik_chat(profilePictureUrl,uniqueId, comments, roomId)VALUES" +
    //     "('"+msg.profilePictureUrl+"','"+ msg.uniqueId+ "','"+msg.label+"','"+roomId+"')";
    //     connection.query(sql, function (err, result) {  
    //         if (err) throw err;  
    //         console.log("1 record inserted into tik_chat");  
    //     });
    // });
    // socket.on('roomUser', (msg) => {
    //     socket.emit('roomUser', msg);
    //     if (typeof msg.viewerCount === 'number') {
    //         var sql = "UPDATE tik_room SET viewerCount="+msg.viewerCount+" WHERE roomId = '"+roomId+"'";
    //         connection.query(sql, function (err, result) {  
    //             if (err) throw err;  
    //             console.log("1 record updated in tik_room table.");  
    //         });
    //     }
    // });
    // socket.on('chat', (msg) => {
    //     socket.emit('chat', msg);
    //     var comments = "";
    //     comments = msg.comment.substring(msg.comment.indexOf('+')+1,msg.comment.lastIndexOf('+') );
    //     //console.log("===>  "+comments);

    //     var sql = "INSERT INTO tik_chat(profilePictureUrl,uniqueId, comments, roomId)VALUES" +
    //     "('"+msg.profilePictureUrl+"','"+ msg.uniqueId+ "','"+comments+"','"+roomId+"')";
    //     connection.query(sql, function (err, result) {  
    //         if (err) throw err;  
    //         console.log("1 record inserted");  
    //     });  
    // });
    socket.on('disconnect', () => {
        disconnectChat();
        console.log('client disconnected');
    })
    console.log('client connected');
});

// Server frontend files
app.use(express.static('public'));

const port = process.env.PORT || 8081;

httpServer.listen(port);

console.info(`Server running! Please visit http://localhost:${port}`);