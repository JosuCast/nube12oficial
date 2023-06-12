import express from 'express'
import { createOrUpdate, deleteUserById, getUserById, readAllUsers } from './db.js'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promises as fsPromises, readFileSync } from 'fs';

const { readFile } = fsPromises;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router()

// READ ALL Users
router.get('/users', async(req, res) => {
    const { success, data } = await readAllUsers()

    if(success){
        //return res.json({success, data})
        console.log(data)
        const htmlTemplate = await readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const tableRows = data.map(user => {
    return `<tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.gender}</td>
            </tr>`;
}).join('');

const modifiedHtml = htmlTemplate.replace('{{tableRows}}', tableRows);

return res.send(modifiedHtml);
    }
    return res.status(500).json({success:false, messsage: "Error"})
})

// Get User by ID
router.get('/user/:id', async(req, res) => {
    const { id } = req.params
    const { success, data } = await getUserById(id)
    console.log(data)
    if(success){
        return res.json({success, data})
        
    }

    return res.status(500).json({success: false, message: "Error"})
})

router.get('/user', async(req,res) =>{
    return res.sendFile(path.join(__dirname, 'create.html'));
})
    
// Create User
router.post('/user', async(req, res) => {
    const { id, name, gender } = req.body;
    const user = {
        id: parseInt(id), // Convertir a número entero
        name,
        gender
    };

  const { success, data } = await createOrUpdate(user);

    if(success){
        return res.json({success, data})
    }

    return res.status(500).json({success: false, message: 'Error'})
})


// Update User by ID
router.put('/user/:id', async(req, res) => {
    const user = req.body
    const { id } = req.params
    user.id = parseInt(id)

    const { success, data } = await createOrUpdate(user)

    if(success){
        return res.json({success, data})
    }

    return res.status(500).json({success: false, message: "Error"})
})


// Delete User by Id
router.delete('/user/:id', async (req, res) => {
    const { id } = req.params
    const { success, data } = await deleteUserById(id)
    if (success) {
      return res.json({ success, data })
    }
    return res.status(500).json({ success: false, message: 'Error'})
})
  



export default router