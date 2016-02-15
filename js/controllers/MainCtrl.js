/**
 * Main Controller
 *
 * @author Ed Rodriguez <ed@edrodriguez.com>
 * @created 2016-02-14
 */
ctrls.controller('MainCtrl', [
  '$scope',
  '$location',
  'fb',
  function($scope, $location, fb){
    console.log('MainCtrl');

    $scope.once = 0;
    $scope.reloading = 0;
    $scope.timeout = undefined;
    $scope.snapshot = undefined;
    $scope.userRef = undefined;
    $scope.auth = fb.getAuth();

    // @var object config The default app config
    $scope.config = {
      note: undefined,
      notes: [],
      updated: Date.now()
    };

    /**
     * Process Firebase snapshot events
     *
     * @param object snapshot The Firebase snapshot
     * @param string msg The event message
     */
    $scope.process = function(snapshot, msg){
      console.log(msg);
      $scope.snapshot = snapshot;

      if(!$scope.reloading){
        clearTimeout($scope.timeout);

        $scope.timeout = setTimeout(function(){
          $scope.$apply(function(){
            $scope.reload();
          });
        }, 1000);
      }
    };
    
    /**
     * Creates a key by converting a uid to md5
     *
     * @return string The md5 key
     */
    $scope.key = function(){
      return CryptoJS.MD5($scope.auth.uid).toString();
    };
    
    /**
     * Encrypts a string
     *
     * @param string str The string
     * @return string The encrypted string
     */
    $scope.encrypt = function(str){
      return CryptoJS.AES.encrypt(str, $scope.key()).toString();
    };
    
    /**
     * Decrypts a string
     *
     * @param string str The string
     * @return string The decrypted string
     */
    $scope.decrypt = function(str){
      return CryptoJS.AES.decrypt(str, $scope.key()).toString(CryptoJS.enc.Utf8);
    };
    
    /**
     * Gets a note
     *
     * @param integer [id] The note id
     * @return object The note object
     */
    $scope.get = function(id){
      id = id || $scope.id;
      return _.findWhere($scope.notes, {id: id});
    };

    /**
     * Updates a note
     */
    $scope.update = function(){
      var id = $scope.note.id,
          now = Date.now();

      // ADD NOTE
      if(!id){
        id = ($scope.notes.length) ? _.max($scope.notes, function(note){ return note.id; }).id++ : 1;

        var note = $scope.note;
        note.id = id;
        note.created = now;
        note.updated = now;
        $scope.notes.unshift(note);
        $scope.show(note);

      // UPDATE NOTE
      }else{
        $scope.note.updated = now;
      }

      $scope.updated = now;
      $scope.save();
    };

    /**
     * Saves the application state locally
     */
    $scope.save = function(){
      var state = {};

      // Build runtime state
      for(var prop in $scope.config){
        state[prop] = $scope[prop];
      }

      var str = JSON.stringify(state);

      // LocalStorage
      localStorage.setItem('notes', str);

      // Firebase
      str = $scope.encrypt(str);
      $scope.userRef.set({state: str});
    };

    /**
     * Adds a note
     */
    $scope.add = function(){
      $scope.note = {};
      $scope.save();
    };

    /**
     * Removes a note
     *
     * @param integer [id] The note id
     */
    $scope.remove = function(id){
      id = id || $scope.note.id;
      $scope.notes = _.without($scope.notes, _.findWhere($scope.notes, {id: id}));
      $scope.note = undefined;
      $scope.save();
    };

    /**
     * Shows a note
     *
     * @param object note The note
     */
    $scope.show = function(note){
      $scope.note = note;
      $scope.save();
    };

    /**
     * Checks if a note is selected
     *
     * @param object note The note to check
     * @return boolean True if selected
     */
    $scope.isSelected = function(note){
      return (note && note.id) ? $scope.note.id === note.id : 0;
    };

    /**
     * Formats a mysql date
     *
     * @param string date THe mysql date
     * @param string pattern The formatted pattern
     * @return string The formatted date
     */
    $scope.formatDate = function(date, pattern){
      return moment(date).format(pattern);
    };

    /**
     * Prompt to reload Firebase state
     */
    $scope.reload = function(){
      // Reload Firebase state
      if($scope.snapshot && !$scope.reloading){
        $scope.reloading = true;
        var state, str = $scope.snapshot.val();

        str = $scope.decrypt(str);

        if(/^\{/.test(str)){
          state = JSON.parse(str);

          if(state.updated > $scope.updated){

            var $modal = $('#modal-confirm');
            $('.modal-title', $modal).text('Reload?');
            $('.modal-body', $modal).html('<p>A note was updated & saved remotely.<br class="hidden-xs" />\
            Do you want to reload your local notes?</p>');

            $modal.off('hidden.bs.modal').on('hidden.bs.modal', function(e){
              $scope.reloading = false;
            });

            $('.btn-yes', $modal).off('click').on('click', function(e){
              $modal.modal('hide');

              str = $scope.snapshot.val();

              str = $scope.decrypt(str);

              state = JSON.parse(str);

              // Fixes note hash keys
              for(var i=0; i<state.notes.length; i++){
                delete state.notes[i]['$$hashKey'];
              }

              $scope.notes = state.notes;

              // Fix note reference
              if($scope.note && $scope.note.id){
                $scope.note = $scope.get($scope.note.id);
              }

              $scope.$apply();

              $scope.reloading = false;
            });

            $('.btn-no', $modal).off('click').on('click', function(e){
              $scope.reloading = false;
            });

            $modal.modal();
          }else{
            $scope.reloading = false;
          }
        }else{
          $scope.reloading = false;
        }
      }
    };

    /**
     * Loads the application state from local storage
     */
    $scope.init = function(snapshot){
      
      if(!$scope.once){
        
        console.log('Auth: ', $scope.auth);
        
        $scope.userRef = fb.child($scope.key());
        
        console.log('userRef: ', $scope.userRef);
        
        // Firebase Events
        $scope.userRef.on('child_added', function(snapshot){
          console.log('Firebase Added');

          if(!$scope.once){
            $scope.$apply(function(){
              $scope.once = 1;
              $scope.init(snapshot);
            });
          }
        });

        $scope.userRef.on('child_changed', function(snapshot){
          $scope.process(snapshot, 'Firebase Changed');
        });

        $scope.userRef.on('child_removed', function(snapshot){
          $scope.process(snapshot, 'Firebase Removed');
        });

        $scope.userRef.on('child_moved', function(snapshot){
          $scope.process(snapshot, 'Firebase Moved');
        });
        
        $('#menu-toggle').off('click').on('click', function(e) {
          e.preventDefault();
          $('#wrapper').toggleClass('toggled');
        });
      }

      var state = 0;

      // Set initial state
      for(var prop in $scope.config){
        $scope[prop] = $scope.config[prop];
      }

      // Load Firebase state
      if(!state && snapshot){
        var str = snapshot.val();
        
        if(str){
          str = $scope.decrypt(str);
          
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
          state = $scope.config;
          localStorage.setItem('notes', JSON.stringify(state));
        }
      }

      // Set current state
      for(var prop in state){
        if(!/^\$/.test(prop)){
          $scope[prop] = state[prop];
        }
      }

      // Fix note reference
      if($scope.note && $scope.note.id){
        $scope.note = $scope.get($scope.note.id);
      }
    };

    // Check Authorization
    if(!$scope.auth){
      $location.path('/login');
    }else{
      $scope.init();
    }
  }
]);