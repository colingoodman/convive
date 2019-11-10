module.exports = 
{

accountGen : function ()
{
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python3',["account_gen.py"  , ""]); 
}, 

backup : function(PATH , ObjId)
{
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python',["backup2.py" , PATH  , ObjId]); 
}

}

var python = require('./python');
python.accountGen(); 