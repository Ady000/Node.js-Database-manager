const express = require ('express');
const users = require ('./MOCK_DATA.json');
const fs = require('fs');


const app = express();
const PORT = 8000;
app.use(express.urlencoded({extended:false}));


app.get('/',(req,res)=>{
    res.send("Homepage");
})
app.route('/api/users')
.get((req,res)=>{
    return res.json(users)
})
.post((req,res)=>{
    const body = req.body;
    users.push({id:users.length+1,body});
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
        return res.json({status:"User added with ID number: ",id:users.length})
    });
});
app.get('/users',(req,res)=>{
    const html = `
    <ul>
        ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
    <ul>
    `;
    res.send(html);
});
app
.route("/api/users/:id")
.get((req,res)=>{
    const id =Number(req.params.id);
    const user = users.find((user)=>user.id === id);
    return res.json(user);
})
.patch((req, res) => {
    const id = parseInt(req.params.id, 10);
    const updates = req.body;

    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ status: "User not found" });
    }

    users[userIndex] = { ...users[userIndex], ...updates };

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ status: "Error writing file", error: err.message });
        }
        return res.json({ status: "User updated", user: users[userIndex] });
    });
})
.delete((req,res)=>{
    const id = parseInt(req.params.id, 10);

    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ status: "User not found" });
    }

    users.splice(userIndex, 1);

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ status: "Error writing file", error: err.message });
        }
        return res.json({ status: "User deleted", id });
    });
})
.put((req,res)=>{
    return res.json({status:"pending"});
});


app.listen(PORT,()=>console.log('Server started at port 8000'));