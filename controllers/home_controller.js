module.exports.home = async function(req, res){
    try {
        return res.render('home',{
            title: "ERMS | Home",
        });
    } catch (error) {
       console.log('Error', error); 
       return;
    }
}