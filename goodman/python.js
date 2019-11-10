module.exports = 
{

accountGen : function ()
{
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python3',["/home/cwakefield/github/hack19/goodman/account_gen.py"  , ""]); 
}, 

backup : function(PATH , ObjId)
{
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python',["/home/cwakefield/github/hack19/goodman/account_gen.py" , PATH  , ObjId]); 
}

}

var python = require('./python');
python.accountGen(); 