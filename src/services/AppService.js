app.service('AppService', [
  '$rootScope',
  '$mdDialog',
  '$log',
  '$location',
  '$timeout',
  'fb',
  function($rootScope, $mdDialog, $log, $location, $timeout, fb){
    
    // @var object config The default app config
    this.config = {
      note: undefined,
      notes: [],
      updated: Date.now()
    };
    
    this.reset = function(){
      this.title = 'Notes';
      this.auth = 0;
      this.reloading = 0;
      this.timeout = undefined;
      this.snapshot = undefined;
      this.userRef = undefined;
      this.accountRef = undefined;
      this.userRef = undefined;
      this.stateRef = undefined;
      this.note = undefined;
      this.notes = [];
      this.account = {};
      
      $rootScope.$emit('load', this.notes, this.note);
    };
    
    this.logout = function(){
      this.reset();
      fb.unauth();
    };
    
    /**
     * Creates a key by converting a uid to md5
     *
     * @return string The md5 key
     */
    this.key = function(){
      return CryptoJS.MD5(this.auth.uid).toString();
    };
    
    /**
     * Encrypts a string
     *
     * @param string str The string
     * @return string The encrypted string
     */
    this.encrypt = function(str){
      return CryptoJS.AES.encrypt(str, this.key()).toString();
    };
    
    /**
     * Decrypts a string
     *
     * @param string str The string
     * @return string The decrypted string
     */
    this.decrypt = function(str){
      return CryptoJS.AES.decrypt(str, this.key()).toString(CryptoJS.enc.Utf8);
    };
    
    /**
     * Handle Firebase snapshot events
     *
     * @param object snapshot The Firebase snapshot
     * @param string action The event action
     */
    this.handle = function(snapshot, action){
      if(this.getAuth()){
        this.snapshot = snapshot;
        
        $log.info('Firebase '+action+': '+snapshot.key());
        
        // Initial state load
        if(action === 'added'){
          if(snapshot.key() === 'state'){
            this.setState(snapshot.val());
          }else if(snapshot.key() === 'account'){
            this.account = snapshot.val();
          }
        }
        
        if(0 && !this.reloading){
          clearTimeout(this.timeout);
          
          this.timeout = setTimeout(function(){
            $scope = angular.element(document.getElementById('content')).scope();
            $scope.$apply(function(){
              $scope.reload();
            });
          }, 1000);
        }
      }
    };
    
    // SETTERS & GETTERS ------------------------------------
    
    this.setAuth = function(auth){
      $log.log('setAuth');
      
      var $app = this;
      
      $app.reset();
      
      $app.auth = auth;
      
      $app.userRef = fb.child($app.key());
      
      // Firebase Events
      $app.userRef.on('child_added', function(snapshot){
        $app.handle(snapshot, 'added');
      });
      
      $app.userRef.on('child_changed', function(snapshot){
        $app.handle(snapshot, 'changed');
      });
      
      $app.userRef.on('child_removed', function(snapshot){
        $app.handle(snapshot, 'removed');
      });
      
      $app.userRef.on('child_moved', function(snapshot){
        $app.handle(snapshot, 'moved');
      });
      
      $app.stateRef = $app.userRef.child('state'),
      $app.accountRef = $app.userRef.child('account');
      
      // Initial signups
      if(/^\/signup\/?/.test($location.path())){
        $app.signup();
      }else if(/^\/login\/?/.test($location.path())){
        $location.path('/');
      }
    }
    
    this.getAuth = function(){
      return this.auth;
    }
    
    this.setTitle = function(title){
      this.title = title;
      $mdDialog.hide();
    };
    
    this.getTitle = function(){
      return this.title;
    };
    
    /**
     * Sets the current state
     */
    this.setState = function(str){
        $log.log('setState');
      
        var $app = this;
        
        if($app.getAuth() && str){
          str = this.decrypt(str);
          
          if(/^\{/.test(str)){
            try{
                state = JSON.parse(str);
            }catch(e){
                $log.error(e);
            }
            
            if(typeof state === 'object'){
              $app.note = {};
              $app.notes = state.notes || [];
              
              // Set the instance of note from notes
              if(state.note && state.note.id){
                for(var i=0; i<$app.notes.length; i++){
                  var note = $app.notes[i];
                  if(note.id === state.note.id){
                    $app.note = note;
                  }
                }
              }
              
              $timeout(function(){
                $log.log('Emit: load');
                $rootScope.$emit('load', $app.notes, $app.note);
              }, 100);
            }
          }
        }
    };
    
    /**
     * Gets the account name by concat first and last name
     *
     * @return string The account name
     */
    this.getName = function(){
      return (this.account && this.account.first_name) ? this.account.first_name + ' ' + this.account.last_name : '';
    }
    
    // APP LOGIC ------------------------------------
    
    /**
     * Completes signup
     */
    this.signup = function(){
      $scope = angular.element(document.getElementById('content')).scope();
      
      if($scope){
        this.account = {
          first_name: $scope.first_name,
          last_name: $scope.last_name,
          email: $scope.email
        };
        
        var state = {
            note: this.note,
            notes: this.notes,
            updated: Date.now()
          },
          str = JSON.stringify(state);
           
        // Firebase
        str = this.encrypt(str);
        
        this.userRef.set({
          account: this.account,
          state: str
        }, function(){
          $location.path('/');
        });
      }
    };
     
    /**
     * Updates a note
     */
    this.update = function(){
      var note = this.note,
          id = note.id || 0,
          now = Date.now();

      // ADD NOTE
      if(!id){
        id = (this.notes.length) ? _.max(this.notes, function(note){ return note.id; }).id++ : 1;
        
        note.id = id;
        note.created = now;
        note.updated = now;
        this.notes.unshift(note);
        this.show(note);
        
        $log.log('Adding Note...');
      // UPDATE NOTE
      }else{
        this.note.updated = now;
        
        $log.log('Updating Note...');
      }

      this.updated = now;
      this.save();
    };
    
    /**
     * Gets a note
     *
     * @param integer [id] The note id
     * @return object The note object
     */
    this.get = function(id){
      id = id || this.id;
      return _.findWhere(this.notes, {id: id});
    };
    
    /**
     * Adds a note
     */
    this.add = function(){
      this.note = {};
      this.save();
      $rootScope.$emit('load', this.notes, this.note);
    };

    /**
     * Removes a note
     *
     * @param integer|object [id=this.note] The note id or object
     */
    this.remove = function(id){
      if(typeof id === 'object' && id.id){
        id = id.id;
      }
      
      var note = (typeof id === 'number') ? _.findWhere(this.notes, {id: id}) : this.note;
      
      if(note){
          var $app = this;
          
          $mdDialog.show({
            templateUrl: 'views/dialogs/confirm.html',
            locals: {
              params: {
                title: 'Delete Note?',
                message: '<div class="center">You are about to delete the note named...<br /><br /><strong>'+note.name+'</strong></div>',
                onOk: function(){
                  $app.notes = _.without($app.notes, note);
                  $app.note = undefined;
                  $app.save();
                  $rootScope.$emit('load', $app.notes, $app.note);
                },
                onCancel: function(){}
              }
            },
            parent: 'body',
            controller: ConfirmDialog
          });
      }
    };

    /**
     * Shows a note
     *
     * @param object note The note
     */
    this.show = function(note){
      var $app = this;
      this.note = note;
      //this.save();
      
      // Timeout used here because the main view needs time to load
      $timeout(function(){
        $rootScope.$emit('load', $app.notes, $app.note);
      }, 100);
    };
    
    /**
     * Saves the application state
     */
    this.save = function(){
      var state = {};
      
      // Build runtime state
      for(var prop in this.config){
        state[prop] = this[prop];
      }
      
      var str = JSON.stringify(state);
      
      // Clean state and remove any conflicting $$hashKey
      state = JSON.parse(str);
      if(state.notes){
        for(var i=0; i<state.notes.length; i++){
          var note = state.notes[i];
          delete note['$$hashKey'];
        }
      }
      
      if(state.note){
        delete state.note['$$hashKey'];
      }
      
      if(0){
        $log.log('CLEAN STATE...');
        $log.log(state.notes);
      }
      
      str = JSON.stringify(state);
      
      // Firebase
      str = this.encrypt(str);
      this.stateRef.set(str);
      this.accountRef.set(this.account);
    };
    
    /**
     * Prompt to reload Firebase state
     */
    this.reload = function(){
      // Reload Firebase state
      if(this.snapshot && !this.reloading){
        this.reloading = true;
        var state, str = this.snapshot.val();
        
        str = this.decrypt(str);
        
        if(/^\{/.test(str)){
          state = JSON.parse(str);
          
          if(state.updated > this.updated){
            
            var $modal = $('#modal-confirm');
            $('.modal-title', $modal).text('Reload?');
            $('.modal-body', $modal).html('<p>A note was updated & saved remotely.<br class="hidden-xs" />\
            Do you want to reload your local notes?</p>');
            
            $modal.off('hidden.bs.modal').on('hidden.bs.modal', function(e){
              $app.reloading = false;
            });
            
            $('.btn-yes', $modal).off('click').on('click', function(e){
              $modal.modal('hide');
              
              str = $app.snapshot.val();
              
              str = $app.decrypt(str);
              
              state = JSON.parse(str);
              
              // Fixes note hash keys
              for(var i=0; i<state.notes.length; i++){
                delete state.notes[i]['$$hashKey'];
              }
              
              this.notes = state.notes;
              
              // Fix note reference
              if(this.note && this.note.id){
                this.note = $scope.get(this.note.id);
              }
              
              this.$apply();
              
              $app.reloading = false;
            });
            
            $('.btn-no', $modal).off('click').on('click', function(e){
              $app.reloading = false;
            });
            
            $modal.modal();
          }else{
            $app.reloading = false;
          }
        }else{
          $app.reloading = false;
        }
      }
    };
    
    var $app = this;
    
    // Initial Page Load Authorization
    fb.onAuth(function(auth){
      if(auth){
        $log.info('Logged In...');
        $app.setAuth(auth);
      }else{
        $log.warn('Logged Out...');
        $app.reset();
        
        if(!/^\/signup\/?/.test($location.path())){
          
          $timeout(function(){
            $location.path('/login');
          }, 100);
        }
      }
    });
  }
]);
