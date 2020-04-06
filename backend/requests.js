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
  }
}