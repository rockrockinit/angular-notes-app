app.service('AppService', [
  '$rootScope',
  '$log',
  'fb',
  function($rootScope, $log, fb){
    
    // @var object config The default app config
    this.config = {
      note: undefined,
      notes: [],
      updated: Date.now()
    };
    
    this.title = 'Notes';
    this.auth = 0;
    this.once = 0;
    this.reloading = 0;
    this.timeout = undefined;
    this.snapshot = undefined;
    this.userRef = undefined;
    
    this.getAuth = function(){
      return this.auth;
    }
    
    this.setTitle = function(title){
      this.title = title;
    };
    
    this.getTitle = function(){
      return this.title;
    };
    
    this.logout = function(){
      this.title = 'Notes';
      this.auth = 0;
      this.once = 0;
      this.reloading = 0;
      this.timeout = undefined;
      this.snapshot = undefined;
      this.userRef = undefined;
      this.auth = undefined;
      this.notes = [];
      this.note = {};
      $rootScope.$emit('load', this.notes, this.note);
      
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
     * Process Firebase snapshot events
     *
     * @param object snapshot The Firebase snapshot
     * @param string msg The event message
     */
    this.process = function(snapshot, msg){
      $log.info(msg);
      this.snapshot = snapshot;

      if(0 && !this.reloading){
        clearTimeout(this.timeout);

        this.timeout = setTimeout(function(){
          $scope = angular.element(document.getElementById('content')).scope();
          $scope.$apply(function(){
            $scope.reload();
          });
        }, 1000);
      }
    };
    
    /**
     * Updates a note
     */
    this.update = function(note){
      this.note = note;
      
      var id = this.note.id,
          now = Date.now();

      // ADD NOTE
      if(!id){
        id = (this.notes.length) ? _.max(this.notes, function(note){ return note.id; }).id++ : 1;
        
        note.id = id;
        note.created = now;
        note.updated = now;
        this.notes.unshift(note);
        this.show(note);

      // UPDATE NOTE
      }else{
        this.note.updated = now;
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
     * @param integer [id] The note id
     */
    this.remove = function(id){
      id = id || this.note.id;
      this.notes = _.without(this.notes, _.findWhere(this.notes, {id: id}));
      this.note = undefined;
      this.save();
    };

    /**
     * Shows a note
     *
     * @param object note The note
     */
    this.show = function(note){
      this.note = note;
      this.save();
      $rootScope.$emit('load', this.notes, this.note);
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

      // LocalStorage
      localStorage.setItem('notes', str);

      // Firebase
      str = this.encrypt(str);
      this.userRef.set({state: str});
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
    
    /**
     * Loads the application state from local storage
     */
    this.init = function(snapshot){
      var $app = this;
      
      if(!this.auth){
        this.auth = fb.getAuth();
      }
      
      if(!$app.once){
        $app.userRef = fb.child($app.key());
        
        // Firebase Events
        $app.userRef.on('child_added', function(snapshot){
          $log.info('Firebase Added');

          if(!$app.once){
            $app.once = 1;
            $app.init(snapshot);
          }
        });

        $app.userRef.on('child_changed', function(snapshot){
          $app.process(snapshot, 'Firebase Changed');
        });

        $app.userRef.on('child_removed', function(snapshot){
          $app.process(snapshot, 'Firebase Removed');
        });

        $app.userRef.on('child_moved', function(snapshot){
          $app.process(snapshot, 'Firebase Moved');
        });
      }

      var state = 0;

      // Set initial state
      for(var prop in $app.config){
        this[prop] = $app.config[prop];
      }

      // Load Firebase state
      if(!state && snapshot){
        var str = snapshot.val();
        
        if(str){
          str = $app.decrypt(str);
          
          if(/^\{/.test(str)){
            state = JSON.parse(str);
            
            // Fixes note hash keys
            for(var i=0; i<state.notes.length; i++){
              delete state.notes[i]['$$hashKey'];
            }
          }
        }
      }

      // Load LocalStorage state
      if(!state){
        state = localStorage.getItem('notes');

        state = (/^(\{|\[)/.test(state)) ? JSON.parse(state) : 0;

        // First time run
        if(!state){
          state = $app.config;
          localStorage.setItem('notes', JSON.stringify(state));
        }
      }
      
      // Set current state
      for(var prop in state){
        if(!/^\$/.test(prop)){
          $app[prop] = state[prop];
        }
      }

      // Fix note reference
      if($app.note && $app.note.id){
        $app.note = $app.get($app.note.id);
      }
      
      $rootScope.$emit('load', this.notes, this.note);
    };
    
  }
]);