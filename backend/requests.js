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
    let users = await query('SELECT * FROM users',[])
    
    if (users === -1) {
      users = []
      console.log('Error retrieving users.')
    } else {
      res.send(users)
      console.log(`Succesfully retrieved all users.`)
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
      console.log(`Succesfully retrieved all roles.`)
    }
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

      console.log(`Succesfully retrieved all projects.`)
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

      console.log(`Succesfully retrieved all users.`)
    }
    res.send(usr_arr)
  },

  authentication: async (req, res) => {
    // sign in user
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
      let auth = await query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password])
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

    await query('INSERT INTO users (username, password, first_name, last_name, department, position) VALUES (?,?,?,?,?,?)', [req.body.username, hashCode(generatedPassword), req.body.first_name, req.body.last_name, req.body.department, req.body.position]
    ).then(async (result) => {
      console.log(`Sucessfully added user ${req.body.username}.`)
      await query('INSERT INTO user_role_link (user_id, role_id) VALUES (?,?)', [result.insertId, 2]
      ).then(() => {
        console.log(`Sucessfully added role 'user' to user ${req.body.username}.`)
      }).catch((e) => {
        console.log(`Error adding role 'user' to user ${req.body.username}.`)
      })
    }).catch((e) => {
      console.log(`Error adding user ${req.body.username}.`)
    })
    res.send()
  }
}