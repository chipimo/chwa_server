const io = require("./index").io;
const {
  USER_IS_REGSTARTED,
  USER_ALREADY_REGSTARTED,
  DEVICE_DISCONNECTED,
  USER_CONNECTED,
  USER_REGSTRATION,
  VERIFY_USER,
  USER_IS_VERIFYED,
  USER_PASS_INCLLECT,
  USER_NOT_EXIST,
  PRODUCT_ENTRY,
  PRODUCTS_RESULTS,
  PRODUCTS,
  GET_ALL_PRODUCTS,
  DELETE_ITEM,
  PRODUCT_REMOVED,
  PRODUCT_REMOVE_ERR,
  PRODUCTS_RESULTS_ERR,
  GET_ALL_USERS,
  ALL_USERS,
  NOTIFICATION_SENT,
  SEND_NOFITION
} = require("./events");
const {
  _putNewUser,
  _getUser_ByUserName,
  _putNewProudct,
  _getProudct,
  _removeItem,
  _update,
  _putNewNewBundle,
  _getAllUsers,
  _getUser_ById,
  _getAllBundles
} = require("./db/queries");
var cloudinary = require("cloudinary").v2;
const _ = require("lodash");

require("custom-env").env();

// Valuebles
let messages = [];
var idlist = [];
var ProductList = {};
var TempActiveUsers = [];
var activeUsers = [];
var Users = [];
require("custom-env").env();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

module.exports = function(socket) {
  socket.on("connected", () => {
    console.log(socket.id);
  });

  socket.on("UserConnected", userId => {
    console.log(userId);
  });

  socket.on("disconnect", () => {
    io.emit(DEVICE_DISCONNECTED, socket.id);
    console.log("Device disconneced");
  });

  socket.on(GET_ALL_USERS, () => {
    _getAllUsers(socket.id, callback => {
      // Users = callback.Users.users;
      // var NewArr = [];
      // var num = 0;

      // _.map(Users, item => {
      //   num++;
      //   _.map(activeUsers, item2 => {
      //     console.log(item2.id);

      //     if (item.user_id === item2.id) {
      //       newList = Object.assign(item, { online: true });
      //       NewArr.push(newList);
      //     } else {
      //       newList = Object.assign(item, { online: false });
      //       NewArr.push(newList);
      //     }
      //   });
      //   if (Users.length === num) {
      // console.log(NewArr);

      io.to(callback.socketId).emit(ALL_USERS, callback);
      //   }
      // });
    });
  });

  socket.on(SEND_NOFITION, data => {
    SendNotfication(data.to, data.info, callback => {
      if (callback) {
        io.emit(NOTIFICATION_SENT, socket.id);
      } else {
      }
    });
    // console.log(data);
  });

  socket.on(USER_CONNECTED, user => {
    TempActiveUsers.push(user.token);
    var result = _(TempActiveUsers)
      .differenceBy(
        [
          {
            id: id.userId,
            socketId: id.socketId,
            name: id.name,
            NotificationId: id.notiId
          }
        ],
        "id"
      )
      .concat([
        {
          id: id.userId,
          socketId: id.socketId,
          name: id.name,
          NotificationId: id.notiId
        }
      ])
      .value();
    activeUsers = result;
    console.log(TempActiveUsers);
  });

  socket.on(VERIFY_USER, user => {
    let userData = {
      user: user,
      socketId: socket.id
    };

    _getUser_ByUserName(userData, callback => {
      if (callback.isSet) {
        if (user.pass === callback.userData.credentials[0].Password) {
          io.to(callback.socketId).emit(
            USER_IS_VERIFYED,
            callback.userData.credentials
          );
        } else {
          io.to(callback.socketId).emit(USER_PASS_INCLLECT);
        }
      } else {
        io.to(callback.socketId).emit(USER_NOT_EXIST);
      }
    });
  });

  socket.on(PRODUCT_ENTRY, data => {
    let productData = {
      data: data,
      socketId: socket.id
    };

    _putNewProudct(productData, callback => {
      io.to(callback.socketId).emit(PRODUCTS_RESULTS, callback.productData);
    });
  });

  // get pdf
  socket.on(PRODUCTS, data => {
    let productData = {
      data: data,
      socketId: socket.id
    };

    _getProudct(productData, callback => {
      if (callback.Error) {
        io.to(callback.socketId).emit(PRODUCTS_RESULTS_ERR);
      } else {
        io.to(callback.socketId).emit(PRODUCTS_RESULTS, callback.productData);
      }
    });
  });

  // socket.on(GET_ALL_PRODUCTS, () => {
  //   let productData = {
  //     socketId: socket.id
  //   };
  //   _getAllProudcts(productData, callback => {
  //     io.to(socket.id).emit(PRODUCTS_RESULTS, callback.);
  //   });
  // });

  socket.on(DELETE_ITEM, data => {
    cloudinary.uploader.destroy(data.public_id, function(error, result) {
      _removeItem(data.Productid, callback => {
        if (callback.Error) {
          return io.emit(PRODUCT_REMOVE_ERR);
        } else {
          ProductList = callback.Data;

          io.emit(PRODUCT_REMOVED, { all: callback.Data, item: data });
        }
      });
    });
  });

  socket.on(USER_REGSTRATION, user => {
    let data = {
      socketId: socket.id,
      name: user.name,
      lname: user.lname,
      email: user.email,
      password: user.password,
      isSingedin: true,
      withImg: false,
      notificationId: "1002nxsydfekl;dasigucdwsxas"
    };

    _putNewUser(data, callback => {
      if (!callback.exists) {
        // sendEmail([
        //   {
        //     name: callback.userData.credentials[0].user_name,
        //     email: callback.userData.credentials[0].email
        //   }
        // ]);

        io.to(callback.socketId).emit(USER_IS_REGSTARTED, callback);
      } else {
        io.to(callback.socketId).emit(USER_ALREADY_REGSTARTED, callback);
      }
    });
  });
};
