let query = async (sql, params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await db.query(sql, params)
      resolve(result)
    } catch (error) {
      return reject(error)
    }
  })
}

function generatePassword() {
  var charset_low = "abcdefghijklmnopqrstuvwxyz",
    charset_upp = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    charset_dig = "0123456789",
    charset_sym = "~!@#$%^&*()_+-={}[]|.<>?",
    retVal = "";
  for (var i = 0, n = charset_low.length; i < 7; ++i) {
    retVal += charset_low.charAt(Math.floor(Math.random() * n));
  }
  for (var i = 7, n = charset_upp.length; i < 12; ++i) {
    retVal += charset_upp.charAt(Math.floor(Math.random() * n));
  }
  for (var i = 12, n = charset_dig.length; i < 14; ++i) {
    retVal += charset_dig.charAt(Math.floor(Math.random() * n));
  }
  for (var i = 14, n = charset_sym.length; i < 16; ++i) {
    retVal += charset_sym.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

const hashCode = function (s) {
  return s.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
}

module.exports = {
  getUsers: async (req, res) => {
    // get all users from the database
    let users = await query('SELECT user_id, username, first_name, last_name, position, department, picture FROM users',[])
    
    if (users === -1) {
      users = []
      console.log('Error retrieving users.')
    } else {
      res.send(users)
      console.log(`Successfully retrieved all users.`)
    }
  },

  getRoles: async (req, res) => {
    // get all roles from the database
    let roles = await query('SELECT * FROM roles',[])
    
    if (roles === -1) {
      roles = []
      console.log('Error retrieving roles.')
    } else {
      res.send(roles)
      console.log(`Successfully retrieved all roles.`)
    }
  },

  getUserRole: async (req, res) => {
    // get role of given user_id from database
    let user_id = req.params.userId
    let role_id = await query(`SELECT role_id FROM user_role_link WHERE user_id = ?`, [user_id])
    let role = []

    if (role_id === -1) {
      console.log('Error retrieving role id.')
    } else {
      role = await query('SELECT * FROM roles WHERE role_id = ?', [role_id[0].role_id])
      role = role[0]
      console.log(`Successfully retrieved user's role.`)
    }
    res.send(role)
  },

  getProjects: async (req, res) => {
    // get all projects assigned to a given user_id from the database
    let user_id = req.params.userId
    let prj_arr = []

    let prj_ids = await query(`SELECT * FROM user_project_link WHERE user_id = ?`, [user_id])
    if (prj_ids === -1) {
      console.log('Error retrieving projects.')
    }
    else {
      let prj
      for (let i in prj_ids) {
        prj = await query(`SELECT * FROM projects WHERE project_id = ?`, [prj_ids[i].project_id])
        if (prj !== -1)
          prj_arr.push(prj[0])
      }

      console.log(`Successfully retrieved all projects.`)
    }
    res.send(prj_arr)
  },

  getUsersFromProject: async (req, res) => {
    // get all users assigned to a given project_id from the database
    let project_id = req.params.projectId
    let usr_arr = []

    let usr_ids = await query(`SELECT * FROM user_project_link WHERE project_id = ?`, [project_id])
    if (usr_ids === -1) {
      console.log('Error retrieving users.')
    }
    else {
      let prj
      for (let i in usr_ids) {
        prj = await query(`SELECT * FROM users WHERE user_id = ?`, [usr_ids[i].user_id])
        if (prj !== -1)
          usr_arr.push(prj[0])
      }

      console.log(`Successfully retrieved all users.`)
    }
    res.send(usr_arr)
  },

  getProjectInfo: async (req, res) => {
    // get project_id's info
    let project_id = req.params.projectId
    let projects = await new Promise(async (resolve, reject) => {
      try {
        let sql = `SELECT * FROM projects where project_id = ?`
        let result = await db.query(sql, project_id)
        resolve(result)
      } catch (error) {
        return reject(error)
      }
    })
    if (projects === -1) {
      projects = []
      console.log('Error retrieving project info.')
    } else {
      res.send(projects)
      console.log(`Successfully retrieved project info.`)
    }
  },
  getUserInfo: async (req, res) => {
    let user_id = req.params.userId
    await query('SELECT * FROM users WHERE user_id=?', [user_id]).then(result => {
      if (result.length > 0) {
        res.send(result[0])
        console.log(`Succesfully retrieved user info for user ${user_id}.`)
      } else {
        res.send('')
        console.log(`Error retrieving user info for user ${user_id}.`)
      }
    }).catch(e => {
      res.send('')
      console.log(`Error retrieving user info for user ${user_id}.`)
    })
  },
  getAllUserRecords: async (req, res) => {
    let userName = req.params.userName
    let userRecords = await new Promise(async (resolve, reject) => {
      try {
        let sql
        if (userName === 'admin')
          sql = `SELECT rh.project_name as project_name, rh.user_name as user_name, rh.week as week, rh.year as year, rh.hours as hours FROM recorded_hours rh WHERE hours is not null ORDER BY year, week DESC`
        else
          sql = `SELECT rh.project_name as project_name, rh.user_name as user_name, rh.week as week, rh.year as year, rh.hours as hours FROM recorded_hours rh WHERE user_name = "${userName}" AND hours is not null ORDER BY year, week DESC`
        let result = await db.query(sql)
        // console.log(result)
        resolve(result)
      } catch (error) {
        return reject(error)
      }
    })
    if (userRecords === -1) {
      userRecords = []
      console.log('Error retrieving all user records.')
    } else {
      res.send(userRecords)
      console.log(`Succesfully retrieved all user records.`)
    }
  },

  getUserInfo: async (req, res) => {
    // get user_id's info
    let user_id = req.params.userId
    await query('SELECT * FROM users WHERE user_id=?', [user_id]).then(result => {
      if (result.length > 0) {
        res.send(result[0])
        console.log(`Successfully retrieved user info for user ${user_id}.`)
      } else {
        res.send('')
        console.log(`Error retrieving user info for user ${user_id}.`)
      }
    }).catch(e => {
      res.send('')
      console.log(`Error retrieving user info for user ${user_id}.`)
    })
  },

  updateUserInfo: async (req, res) => {
    // update user_id's info
    let user_id = req.body.userId
    let first_name = req.body.firstName
    let last_name = req.body.lastName
    let department = req.body.department
    let position = req.body.position

    await query('UPDATE users SET first_name=?, last_name=?, department=?, position=? WHERE user_id=?', [first_name, last_name, department, position, user_id]).then(async result => {
      res.send(true)
      console.log('Successfully updated info for user ' + user_id + '.')
    }).catch(e => {
      res.send(false)
      console.log('Error updating info for user ' + user_id + '.')
    })
  },

  updateUserRole: async (req, res) => {
    // update user_id's role
    let user_id = req.body.userId
    let role_id = req.body.roleId

    await query('SELECT * FROM user_role_link WHERE user_id=? AND role_id=?', [user_id, role_id]).then(async result => {
      if (result.length == 0) {
        await query('UPDATE user_role_link SET role_id=? WHERE user_id=?', [role_id, user_id]).then(async result => {
          if (result.changedRows === 0 && result.affectedRows === 0)
            await query(`INSERT INTO user_role_link (user_id, role_id) VALUES (?,?)`, [user_id, role_id]).then(result => result).catch(e => { console.log(e,'Error adding role.') })
          res.send(true)
          console.log('Successfully updated role for user ' + user_id + '.')
        }).catch(e => {
          res.send(false)
          console.log('Error updating role for user ' + user_id + '.')
        })
      } else {
        res.send(true)
      }
    })
    
  },

  addUserProjectLink: async (req, res) => {
    let userId = req.body.userId
    let projectId = req.body.projectId
    await new Promise(async (resolve, reject) => {
      try {
        let sql = `INSERT INTO user_project_link (user_id, project_id) VALUES (?,?)`
        let result = await db.query(sql, [userId, projectId])
        resolve(result)
      } catch (error) {
        return reject(error)
      }
    }).then(() => {
      console.log(`Successfully added user ${userId} to project ${projectId}.`)
    })
      .catch(() => {
        console.log(`Error adding user ${userId} to project ${projectId}.`)
      })

    res.send()
  },

  deleteUserProjectLink: async (req, res) => {
    let userId = req.body.userId
    let projectId = req.body.projectId
    await new Promise(async (resolve, reject) => {
      try {
        let sql = `DELETE FROM user_project_link WHERE project_id=${projectId} AND user_id=${userId};`
        let result = await db.query(sql)
        resolve(result)
      } catch (error) {
        return reject(error)
      }
    }).then(() => {
      console.log(`Successfully removed user ${userId} from project ${projectId}.`)
    })
      .catch(() => {
        console.log(`Error removing user ${userId} from project ${projectId}.`)
      })
    res.send()
  },
  getUserRecordsWithoutHours: async (req, res) => {
    let userName = req.params.userName
    let userRecords = await new Promise(async (resolve, reject) => {
      try {
        let sql
        if (userName === 'admin')
          sql = `SELECT rh.project_name as project_name, rh.user_name as user_name, rh.week as week, rh.year as year, rh.hours as hours, rh.record_id as record_id FROM recorded_hours rh WHERE hours is null ORDER BY year, week DESC`
        else
          sql = `SELECT rh.project_name as project_name, rh.user_name as user_name, rh.week as week, rh.year as year, rh.hours as hours, rh.record_id as record_id FROM recorded_hours rh WHERE user_name = "${userName}" AND hours is null ORDER BY year, week DESC`
        let result = await db.query(sql)
        resolve(result)
      } catch (error) {
        return reject(error)
      }
    })
    if (userRecords === -1) {
      userRecords = []
      console.log('Error retrieving all user records without hours.')
    } else {
      res.send(userRecords)
      console.log(`Succesfully retrieved all user records without hours.`)
    }
  },

  authentication: async (req, res) => {
    // sign in user
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
      let auth = await query('SELECT user_id, username, first_name, last_name, position, department, picture FROM users WHERE username = ? AND password = ?', [username, password])
      if (auth.length > 0) {
        let user_id = auth[0].user_id
        auth = auth[0]

        let role = await query('SELECT * FROM user_role_link WHERE user_id = ?', [user_id])
        if (role.length > 0) {
          let role_id = role[0].role_id;
          auth.role_id = role_id
          
          res.send({ auth });
          console.log('Login successful!')
        } else {
          console.log('Error getting user role!')
          res.status(400).send('Error getting user role!');
        }
      } else {
        console.log('Incorrect username/password!')
        res.status(400).send('Incorrect username/password!');
      }
    } else {
      console.log('Missing login information!')
      res.status(400).send('Missing login information!');
    }
  },

  addUser: async (req, res) => {
    // adds a new user to database
    generatedPassword = generatePassword()
    let newUserId

    await query('INSERT INTO users (username, password, first_name, last_name, department, position) VALUES (?,?,?,?,?,?)', [req.body.username, hashCode(generatedPassword), req.body.first_name, req.body.last_name, req.body.department, req.body.position]
    ).then(async (result) => {
      console.log(`Sucessfully added user ${req.body.username}.`)
      newUserId = result.insertId
      await query('INSERT INTO user_role_link (user_id, role_id) VALUES (?,?)', [newUserId, 2]
      ).then(() => {
        console.log(`Sucessfully added role 'user' to user ${req.body.username}.`)
        res.send({userId: newUserId})
      }).catch((e) => {
        console.log(`Error adding role 'user' to user ${req.body.username}.`)
      })
    }).catch((e) => {
      console.log(`Error adding user ${req.body.username}.`)
    })
    res.send()
  },

  deleteUser: async (req, res) => {
    // delete user from database by user_id (can be array)
    let idsList = req.body.idsList
    if (idsList) {
      if (idsList.length > 0) {
        idsList.forEach(async id => {
          await query(`DELETE FROM users WHERE user_id=?`, [id]).then(() => {
            console.log(`Sucessfully deleted user ${id}.`)
          }).catch(() => {
            console.log(`Error deleting user ${id}.`)
          })
        })
      }
    }
    res.send()
  },

  checkUsername: async (req, res) => {
    // checks if there is already a user with the given username in the database
    let username = req.params.username

    await query('SELECT username FROM users WHERE username=?', [username]).then(result => {
      if (result.length > 0) {
        res.send(true)
        console.log('Username ' + username + ' already exists.')
      }
      else {
        res.send(false)
        console.log('Username ' + username + ' does not exist.')
      }
    }).catch(e => console.log('Error checking username \"' + username + '\".'))
  },

  changePassword: async (req, res) => {
    let userId = req.body.user_id
    let oldPassword = req.body.old_password
    let password = req.body.password
    let oldPasswordCorrect = false, passwordChangedSuccessfully = false

    await query('SELECT password FROM users WHERE user_id=? AND password=?', [userId, oldPassword]).then(result => {
      if (result.length > 0)
        oldPasswordCorrect = true
    })

    if (oldPasswordCorrect) {
      await query('UPDATE users SET password=? WHERE user_id=?', [password, userId]).then(async () => {
        user = await query('SELECT username FROM users WHERE user_id=?', [userId])
        if (user.length > 0) {
          console.log(`Sucessfully updated password for user ${user[0].username}.`)
          passwordChangedSuccessfully = true
        } else {
          throw "Error updating password for user."
        }
      }).catch((e) => {
        console.log("Error updating password for user " + userId + '.')
        passwordChangedSuccessfully = false
      })
    } else {
      console.log('Change password error: Old password incorrect.')
    }
    res.send([oldPasswordCorrect, passwordChangedSuccessfully])
  }
 
}