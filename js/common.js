if(!Date.now){
  Date.now = function(){ return new Date().getTime(); }
}

if(!window.console||!window.console.log){
  window.console = {
    log: function(){}
  };
}
