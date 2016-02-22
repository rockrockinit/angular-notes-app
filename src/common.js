if(!Date.now){
  Date.now = function(){ return new Date().getTime(); }
}

if(!window.console||!window.console.log){
  window.console = {
    log: function(){}
  };
}



var cms = {
  submit: function(opts){
      opts = (typeof(opts) === 'object') ? opts : {};
      if(typeof(opts.form) === 'undefined'){
          // HIDDEN FORM
          if($('#cms-hidden-form').length === 0){
              $('body').append('<form id="cms-hidden-form" name="cms-hidden-form" action="" method="post"></form>');
          }
          opts.form = $('#cms-hidden-form');
      }else if(typeof(opts.form) === 'string'){
          opts.form = $(opts.form);
      }
      if(typeof(opts.form) === 'object' && opts.form.length === 1){
          var form = opts.form,
              data = (typeof(opts.data) === 'string') ? $.query(opts.data) : opts.data;
              
          form.html('');
          form.attr('action', '');
          if(typeof(opts.action) === 'string'){
              form.attr('action', opts.action);
          }
          form.get(0).setAttribute('target', '');
          if(typeof(opts.target) === 'string'){
              form.get(0).setAttribute('target', opts.target);
              var frame = $('#'+opts.target);
              if(frame.length){
                  frame.off('load');
                  if(typeof(opts.onload) === 'function'){
                      frame.load(opts.onload);
                  }
              }
          }
          if(typeof(data) === 'object'){
              for(var key in data){
                  if(typeof(data[key]) === 'string' || typeof(data[key]) === 'number'){
                      form.append("<input type='hidden' name='"+key+"' value='"+unescape(urldecode(data[key]).replace(/\'/gi,'&apos;'))+"' />");
                  }else if($.isArray(data[key])){
                      for(var i=0; i<data[key].length; i++){
                          form.append("<input type='hidden' name='"+key+"[]' value='"+unescape(urldecode(data[key][i]).replace(/\'/gi,'&apos;'))+"' />");
                      }
                  }
              }
          }
          form.submit();
      }
      return false;
  }
};
