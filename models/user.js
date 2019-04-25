'use strict'

let bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a username!'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Hey, please give me a valid email address!'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 32],
          msg: 'Your password must be between 8 and 32 characters in length.'
        }
      }
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    defaultToPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    hooks: {
      beforeCreate: (pendingUser) => {
        if(pendingUser && pendingUser.password) {
          // hash the password before it goes into user table
          let hash = bcrypt.hashSync(pendingUser.password, 12)

          // Reassign the password to the hashed value
          pendingUser.password = hash
        }
      }
    }
  })

  user.associate = function(models) {
    // associations can be defined here
    models.user.hasMany(models.users_pokes, {foreignKey: 'userId', sourceKey: 'id'})
    models.user.hasMany(models.party, {foreignKey: 'userId', sourceKey: 'id'})
  }

  user.prototype.validPassword = function(typedInPassword) {
    return bcrypt.compareSync(typedInPassword, this.password)
  }

  return user
}
