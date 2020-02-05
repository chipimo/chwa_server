const knex = require("../knex"); // the connection!
const uuidv4 = require("uuid/v4");

function CreateId() {
  return uuidv4();
}

module.exports = {
  _getAllUsers(socketId, callback) {
    knex
      .select()
      .from("users")
      .then(function(users) {
        callback({
          Error: false,
          socketId: socketId,
          Users: { users }
        });
      })
      .catch(err => {
        callback({ Error: true, msg: err });
      });
  },
  _getUser_ById(user_credentials, callback) {
    knex
      .select()
      .from("users")
      .where("user_id", user_credentials.user.id)
      .then(function(user) {
        if (user.length === 0) {
          callback({
            isSet: false,
            socketId: user_credentials.socketId,
            userData: { isRegistered: false, credentials: user }
          });
        } else {
          callback({
            isSet: true,
            socketId: user_credentials.socketId,
            userData: { isRegistered: true, credentials: user }
          });
        }
      });
  },

  _getUser_ByUserName(user_credentials, callback) {
    knex
      .select()
      .from("users")
      .where("email", user_credentials.user.email)
      .then(function(user) {
        if (user.length === 0) {
          callback({
            isSet: false,
            socketId: user_credentials.socketId,
            userData: { isRegistered: false, credentials: user }
          });
        } else {
          callback({
            isSet: true,
            socketId: user_credentials.socketId,
            userData: { isRegistered: true, credentials: user }
          });
        }
      });
  },

  _getUser_ByUserEmail(user_email, callback) {},
  _getAllUsers_ByLocation(locaion_id) {},
  _getUsers_Location(users_id) {},
  _getUsers_Subscription(user_id) {},

  _getAllProudcts(productData, callback) {
    knex
      .select()
      .from("products")
      .then(function(product) {
        callback({
          Error: true,
          socketId: productData.socketId,
          productData: { product }
        });
      })
      .catch(err => {
        callback({ Error: true });
      });
  },

  _getProudct(productData, callback) {
    knex
      .select()
      .from(productData.data.pdf_type)
      .where("author", productData.data.id)
      .then(function(product) {
        callback({
          socketId: productData.socketId,
          productData: { product }
        });
      })
      .catch(err => {
        callback({ Error: true });
      });
  },

  _putNewProudct(data, callback) {
    // let productId = CreateId();

    knex(data.data.pdf_type)
      .insert({
        id: data.data.pdf_id,
        name: data.data.pdf_name,
        downloads: "0",
        state: "",
        link: data.data.pdfURL,
        overview: { about: data.data.pdf_about },
        comment_status: {},
        author: data.data.userId,
        featured_image: {},
        price: data.data.pdf_price,
        secure_url: "",
        is_active: true
      })
      .then(function() {
        knex
          .select()
          .from(data.data.pdf_type)
          .where("author", data.data.userId)
          .then(function(product) {
            callback({
              socketId: data.socketId,
              productData: { product }
            });
          });
      });
  },

  _putNewNewBundle(data, callback) {
    knex
      .select()
      .from("subscriptions")
      .then(function(Bundle) {
        if (Bundle.length === 0) {
          knex("subscriptions")
            .insert({
              contener: { main: data.contener }
            })
            .then(function() {
              knex
                .select()
                .from("subscriptions")
                .then(function(Bundle) {
                  callback({
                    // socketId: BundleData.socketId,
                    BundleData: { Bundle }
                  });
                })
                .catch(err => {
                  callback({ Error: true });
                });
            });
        } else {
          knex("subscriptions")
            .update({
              contener: knex.raw(`jsonb_set(??, '{main}', ?)`, [
                "contener",
                { main: data.contener }
              ])
            })
            .then(function() {
              knex
                .select()
                .from("subscriptions")
                .then(function(Bundle) {
                  callback({
                    // socketId: BundleData.socketId,
                    BundleData: { Bundle }
                  });
                })
                .catch(err => {
                  callback({ Error: true });
                });
            });
        }
      })
      .catch(err => {
        callback({ Error: true });
      });
  },

  _getAllBundles(callback) {
    knex
      .select()
      .from("subscriptions")
      .then(function(Bundle) {
        callback({
          // socketId: BundleData.socketId,
          BundleData: { Bundle }
        });
      })
      .catch(err => {
        callback({ Error: true });
      });
  },

  _putNewUser(user_credentials, callback) {
    knex
      .select()
      .from("users")
      .where("email", user_credentials.email)
      .then(function(user) {
        if (user.length === 0) {
          let userId = CreateId();

          knex("users")
            .insert({
              user_id: user_credentials.id ? user_credentials.id : userId,
              user_name: user_credentials.name,
              email: user_credentials.email,
              Fname: user_credentials.name,
              Lname: user_credentials.lname,
              Password: user_credentials.password,
              Profile_pic: user_credentials.withImg ? user_credentials.img : {},
              Purchases: {},
              NotificationId: user_credentials.notificationId
            })
            .then(function() {
              knex
                .select()
                .from("users")
                .where(
                  "user_id",
                  user_credentials.id ? user_credentials.id : userId
                )
                .then(function(user) {
                  callback({
                    socketId: user_credentials.socketId,
                    userData: { isRegistered: true, credentials: user },
                    exists: false
                  });
                });
            });
        } else {
          callback({
            socketId: user_credentials.socketId,
            userData: {},
            exists: true
          });
        }
      });
  },

  _updateUserProfile(data, callback) {
    knex("users")
      .where("user_id", data.token)
      .update({
        Profile_pic: data.result
      })
      .then(function() {
        knex
          .select()
          .from("users")
          .where("user_id", data.token)
          .then(function(user) {
            callback({
              userData: { isRegistered: true, credentials: user },
              exists: false
            });
          });
      });
  },

  _removeItem(id, callback) {
    knex("products")
      .where("product_id", id)
      .del()
      .then(function() {
        knex
          .select()
          .from("products")
          .then(function(removed) {
            callback({ Error: false, Data: { removed } });
          });
      })
      .catch(err => {
        callback({ Error: true });
      });
  },

  _update(id, callback) {
    if (id.data.isImageChaged) {
      knex("products")
        .where("product_id", id.data.id)
        .update({
          name: id.data.name,
          description: id.data.descripion,
          image: id.img.url,
          product_price_discount: id.data.discount,
          product_price_default: id.data.price,
          is_subscribable: id.data.isSub,
          updated_at: id.data.updated_at
        })
        .then(function() {
          knex
            .select()
            .from("products")
            .then(function(products) {
              callback({
                socketId: id.socketId,
                productData: { products }
              });
            });
        });
    } else {
      knex("products")
        .where("product_id", id.data.id)
        .update({
          name: id.data.name,
          description: id.data.descripion,
          product_price_discount: id.data.discount,
          product_price_default: id.data.price,
          is_subscribable: id.data.isSub,
          updated_at: id.data.updated_at
        })
        .then(function() {
          knex
            .select()
            .from("products")
            .then(function(products) {
              callback({
                socketId: id.socketId,
                productData: { products }
              });
            });
        });
    }
  }
};
