const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'ef7b22d6b312bd',
    pass: 'f3b8eb8c6c223a'
  }
});

const sender = 'admin'
const domain = 'hoursly.com'

Date.prototype.getWeekNumber = function () {
  var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};

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
    let users = await query('SELECT user_id, username, first_name, last_name, position, department, picture FROM users', [])

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
    let roles = await query('SELECT * FROM roles', [])

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
    // get user_id's info
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
    // get all of userName's records
    let userName = req.params.userName
    let userRecords = await new Promise(async (resolve, reject) => {
      try {
        let sql
        if (userName === 'admin')
          sql = `SELECT rh.record_id as record_id, rh.project_name as project_name, rh.user_name as user_name, rh.week as week, rh.year as year, rh.hours as hours FROM recorded_hours rh WHERE hours is not null ORDER BY year, week DESC`
        else
          sql = `SELECT rh.record_id as record_id, rh.project_name as project_name, rh.user_name as user_name, rh.week as week, rh.year as year, rh.hours as hours FROM recorded_hours rh WHERE user_name = "${userName}" AND hours is not null ORDER BY year, week DESC`
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
    let username

    await query('UPDATE users SET first_name=?, last_name=?, department=?, position=? WHERE user_id=?', [first_name, last_name, department, position, user_id]).then(async result => {
      res.send(true)
      console.log('Successfully updated info for user ' + user_id + '.')
      username = await query('SELECT username FROM users WHERE user_id=?', [user_id]).then(result => result[0].username)
      const mailOptions = {
        from: `${sender}@${domain}`,
        to: username + `@${domain}`,
        subject: 'User details changed',
        html: `<img src="cid:hoursly" height="100px"></img><p>Hello, ${username}! Your new user info:<br></br>&nbsp;First name: ${first_name}<br></br>&nbsp;Last name: ${last_name}<br></br>&nbsp;Department: ${department}<br></br>&nbsp;Position: ${position}<br></br><p>Thank you for using hoursly.com</p>`,
        attachments: [{
          filename: 'hoursly.png',
          path: './hoursly.png',
          cid: 'hoursly'
        }]
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }).catch(e => {
      res.send(false)
      console.log('Error updating info for user ' + user_id + '.')
    })
  },

  updateUserRole: async (req, res) => {
    // update user_id's role
    let user_id = req.body.userId
    let role_id = req.body.roleId
    let username, rolename;
    await query('SELECT * FROM user_role_link WHERE user_id=? AND role_id=?', [user_id, role_id]).then(async result => {
      if (result.length == 0) {
        await query('UPDATE user_role_link SET role_id=? WHERE user_id=?', [role_id, user_id]).then(async result => {
          if (result.changedRows === 0 && result.affectedRows === 0)
            await query(`INSERT INTO user_role_link (user_id, role_id) VALUES (?,?)`, [user_id, role_id]).then(result => result).catch(e => { console.log(e, 'Error adding role.') })
          username = await query('SELECT username FROM users WHERE user_id=?', [user_id]).then(result => result[0].username)
          rolename = await query('SELECT rolename FROM roles WHERE role_id=?', [role_id]).then(result => result[0].rolename)
          const mailOptions = {
            from: `${sender}@${domain}`,
            to: username + `@${domain}`,
            subject: 'New role',
            html: `<img src="cid:hoursly" height="100px"></img><p>Hello, ${username}! You have been assigned a new role: '${rolename}'.<br></br><p>Thank you for using hoursly.com</p>`,
            attachments: [{
              filename: 'hoursly.png',
              path: './hoursly.png',
              cid: 'hoursly'
            }]
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          console.log('Successfully updated role for user ' + user_id + '.')
          res.send(true)
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
    // add user - project link
    let userId = req.body.userId
    let projectId = req.body.projectId
    let username, projectname;
    await new Promise(async (resolve, reject) => {
      try {
        let sql = `INSERT INTO user_project_link (user_id, project_id) VALUES (?,?)`
        let result = await db.query(sql, [userId, projectId])
        username = await query('SELECT username FROM users WHERE user_id=?', [userId]).then(result => result[0].username)
        projectname = await query('SELECT project_name FROM projects WHERE project_id=?', [projectId]).then(result => result[0].project_name)
        resolve(result)
      } catch (error) {
        return reject(error)
      }
    }).then(() => {
      console.log(`Successfully added user ${username}(${userId}) to project ${projectname}(${projectId}).`)
      const mailOptions = {
        from: `${sender}@${domain}`,
        to: username + `@${domain}`,
        subject: 'New project assignment',
        html: `<img src="cid:hoursly" height="100px"></img><p>Hello, ${username}! You have been assigned to a new project: ${projectname}. Good luck!<br></br><p>Thank you for using hoursly.com</p>`,
        attachments: [{
          filename: 'hoursly.png',
          path: './hoursly.png',
          cid: 'hoursly'
        }]
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    })
      .catch(() => {
        console.log(`Error adding user ${username}(${userId}) to project ${projectname}(${projectId}).`)
      })

    res.send()
  },

  deleteUserProjectLink: async (req, res) => {
    // delete user - project link
    let userId = req.body.userId
    let projectId = req.body.projectId
    let username, projectname;
    await new Promise(async (resolve, reject) => {
      try {
        let sql = `DELETE FROM user_project_link WHERE project_id=${projectId} AND user_id=${userId};`
        let result = await db.query(sql)
        username = await query('SELECT username FROM users WHERE user_id=?', [userId]).then(result => result[0].username)
        projectname = await query('SELECT project_name FROM projects WHERE project_id=?', [projectId]).then(result => result[0].project_name)
        resolve(result)
      } catch (error) {
        return reject(error)
      }
    }).then(() => {
      console.log(`Successfully removed user ${userId} from project ${projectId}.`)
      const mailOptions = {
        from: `${sender}@${domain}`,
        to: username + `@${domain}`,
        subject: 'Removed from project.',
        html: `<img src="cid:hoursly" height="100px"></img><p>Hello, ${username}! You have been removed from the project: ${projectname}.<br></br><p>Thank you for using hoursly.com</p>`,
        attachments: [{
          filename: 'hoursly.png',
          path: './hoursly.png',
          cid: 'hoursly'
        }]
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    })
      .catch(() => {
        console.log(`Error removing user ${userId} from project ${projectId}.`)
      })
    res.send()
  },

  getUserRecordsWithoutHours: async (req, res) => {
    // get user records with unmarked hours
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
        const mailOptions = {
          from: `${sender}@${domain}`,
          to: req.body.username + `@${domain}`,
          subject: 'New account created',
          html: '<img src="cid:hoursly" height="100px"></img><p>Welcome to Hoursly!</p><p>Username: ' + req.body.username + '.<br></br>Password: ' + generatedPassword + '</p><br></br><p>Thank you for using hoursly.com</p>',
          attachments: [{
            filename: 'hoursly.png',
            path: './hoursly.png',
            cid: 'hoursly'
          }]
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

        console.log(`Sucessfully added role 'user' to user ${req.body.username}.`)
        res.send({ userId: newUserId })
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
    // change user_id's password
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

          const mailOptions = {
            from: `${sender}@${domain}`,
            to: user[0].username + `@${domain}`,
            subject: 'Password change.',
            html: `<img src="cid:hoursly" height="100px"></img><p>Hello, ${user[0].username}! Your password has been successfully changed! Your new password is '${req.body.password}'<br></br><p>Thank you for using hoursly.com</p>`,
            attachments: [{
              filename: 'hoursly.png',
              path: './hoursly.png',
              cid: 'hoursly'
            }]
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

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
  },

  updateProjectInfo: async (req, res) => {
    // update project_id's info
    let project_id = req.body.projectId
    let project_name = req.body.projectName
    let project_details = req.body.projectDetails
    let client = req.body.client
    let isactive = req.body.isActive

    await query('UPDATE projects SET project_name=?, project_details=?, client=?, isactive=? WHERE project_id=?', [project_name, project_details, client, isactive, project_id]).then(result => {
      res.send(true)
      console.log('Successfully updated info for project ' + project_id + '.')
    }).catch(e => {
      res.send(false)
      console.log('Error updating info for project ' + project_id + '.')
    })
  },

  addProject: async (req, res) => {
    // add a new project to database
    let newProjectId
    console.log(req.body)

    await query('INSERT INTO projects (project_name, project_details, client, isactive) VALUES (?,?,?,?)', [req.body.projectName, req.body.projectDetails, req.body.client, req.body.isActive]
    ).then(async (result) => {
      console.log(`Sucessfully added project ${req.body.projectName}.`)
      newProjectId = result.insertId
      await query('INSERT INTO user_project_link (user_id, project_id) VALUES (?,?)', [1, result.insertId]
      ).then(() => {
        console.log(`Sucessfully added user 'admin' to project ${req.body.projectName}.`)
        res.send({ projectId: newProjectId })
      }).catch((e) => {
        console.log(`Error adding user 'admin' to project ${req.body.projectName}.`)
      })
    }).catch((e) => {
      console.log(`Error adding project ${req.body.projectName}.`)
    })

    res.send()
  },

  deleteProjects: async (req, res) => {
    // delete project from database by project_id (can be array)
    let idsList = req.body.idsList
    if (idsList) {
      if (idsList.length > 0) {
        idsList.forEach(async id => {
          await query(`DELETE FROM projects WHERE project_id=?`, [id]).then(() => {
            console.log(`Sucessfully deleted project ${id}.`)
          }).catch(() => {
            console.log(`Error deleting project ${id}.`)
          })
        })
      }
    }
    res.send()
  },

  generateRecords: async () => {
    // generate new record for each active project of each user set to current week
    let username, project_name, week, year, userProjectLinks
    let userMailingInfo = {}
    // week = new Date().getWeekNumber()
    week = 5;
    year = new Date().getFullYear()
    try {
      userProjectLinks = await query('SELECT * FROM user_project_link', []).then(result => result)
      for (let i = 0; i < userProjectLinks.length; i++) {
        username = await (query('SELECT username FROM users WHERE user_id=?', [userProjectLinks[i].user_id])).then(result => result[0].username)
        if (username === 'admin')
          continue
        userMailingInfo[username] = []
        project_name = await (query('SELECT project_name, isactive FROM projects WHERE project_id=?', [userProjectLinks[i].project_id])).then(result => {
          if (result[0].isactive === 1)
            return result[0].project_name
          else
            return ''
        })
        if (project_name === '')
          continue

        record_id = await query('SELECT * FROM recorded_hours WHERE project_name=? AND user_name=? AND week=? AND year=?', [project_name, username, week, year]).then(result => result)
        if (record_id.length > 0)
          continue
        else
          await query('INSERT INTO recorded_hours (project_name, user_name, week, year) VALUES (?,?,?,?)', [project_name, username, week, year]).then(result => result)
        userMailingInfo[username].push(project_name)
        console.log(`Successfully generated record for user ${username} on project ${project_name} (${week}/${year}).`)
      }
    } catch (e) {
      console.log('Error generating records.')
    }
    Object.keys(userMailingInfo).forEach(item => {
      if (userMailingInfo[item].length > 0) {
        const mailOptions = {
          from: `${sender}@${domain}`,
          to: item + `@${domain}`,
          subject: 'Recording hours reminder.',
          html: `<img src="cid:hoursly" height="100px"></img><p>Hello, ${item}! Please remember to log your hours for this week on your currently active projects: ${userMailingInfo[item].join()}.<br></br><p>Thank you for using hoursly.com</p>`,
          attachments: [{
            filename: 'hoursly.png',
            path: './hoursly.png',
            cid: 'hoursly'
          }]
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    })
  },

  addHours: async (req, res) => {
    // add hours to recordId
    let recordId = req.body.recordId
    let hours = req.body.hours
    await new Promise(async (resolve, reject) => {
      try {
        let sql = 'UPDATE recorded_hours SET hours=' + hours + ' WHERE record_id=' + recordId
        let result = await db.query(sql, [recordId, hours])
        console.log((`Successfully added hours to record ${recordId}`))
        resolve(result)
      } catch (error) {
        return reject(error)
      }
    }).catch(() => {
      console.log(`Error adding hours.`)
    }
    )
    res.send()
  },
}