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
    let project_id = req.params.projectId
    let prj_arr = []

    let prj_ids = await query(`SELECT * FROM user_project_link WHERE project_id = ?`, [project_id])
    if (prj_ids === -1) {
      console.log('Error retrieving users.')
    }
    else {
      let prj
      for (let i in prj_ids) {
        prj = await query(`SELECT * FROM users WHERE user_id = ?`, [prj_ids[i].user_id])
        if (prj !== -1)
          prj_arr.push(prj[0])
      }

      console.log(`Succesfully retrieved all users.`)
    }
    res.send(prj_arr)
  },
}