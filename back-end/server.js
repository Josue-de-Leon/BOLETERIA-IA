const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.json());
const port=2501;
app.use('/',require('./routes/routes'));
app.listen(port,()=>{
    console.log(`Server on port ${port}`);
});
