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
}